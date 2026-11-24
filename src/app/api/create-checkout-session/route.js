import { getStripe, getStripeSessionUrl } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { FREE_SHIPPING_MINIMUM_CENTS, REFERRAL_PROGRAM } from '@/lib/promotions'

export async function POST(request) {
  try {
    const { items, couponCode, customerName, customerEmail, customerPhone, customerAddr, locale } = await request.json()

    if (!Array.isArray(items) || items.length === 0 || !customerName || !customerEmail) {
      return Response.json({ error: 'Items, name and email are required' }, { status: 400 })
    }

    const quantities = new Map()
    for (const { id, quantity } of items) {
      if (!Number.isSafeInteger(id) || id < 1 || !Number.isSafeInteger(quantity) || quantity < 1) {
        return Response.json({ error: 'Invalid cart items' }, { status: 400 })
      }
      quantities.set(id, (quantities.get(id) || 0) + quantity)
    }

    const products = await prisma.product.findMany({
      where: { id: { in: [...quantities.keys()] }, active: true },
      select: { id: true, name: true, price: true, stock: true },
    })
    if (products.length !== quantities.size || products.some((product) => product.stock < quantities.get(product.id))) {
      return Response.json({ error: 'Some products are no longer available in the requested quantities' }, { status: 409 })
    }

    const orderItems = products.map(({ id, name, price }) => ({ id, name, price, quantity: quantities.get(id) }))
    const subtotalCents = orderItems.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0)
    const userId = getAuthUser(request)?.id
    let coupon
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
      if (!userId || !coupon || coupon.userId !== userId || coupon.usedAt || coupon.orderId
        || (coupon.expiresAt && coupon.expiresAt <= new Date()) || subtotalCents < Math.round(coupon.minAmount * 100)) {
        return Response.json({ error: 'Coupon is no longer valid for this order' }, { status: 400 })
      }
    }

    const discountCents = coupon ? Math.min(subtotalCents, Math.round(coupon.discount * 100)) : 0
    const netCents = subtotalCents - discountCents
    if (netCents < FREE_SHIPPING_MINIMUM_CENTS) {
      return Response.json({
        code: 'SHIPPING_QUOTE_REQUIRED',
        error: locale === 'en' ? 'Request a shipping quote before payment.' : '请先确认实际运费，再安排付款。',
      }, { status: 422 })
    }

    const stripe = getStripe()
    const stripeCoupon = discountCents > 0 ? await stripe.coupons.create({
      amount_off: discountCents, currency: 'usd', duration: 'once', max_redemptions: 1,
    }) : null
    const order = await prisma.order.create({
      data: {
        userId,
        items: JSON.stringify(orderItems),
        total: netCents / 100,
        discount: discountCents / 100,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        customerAddr: customerAddr || '',
      },
    })

    const siteUrl = getStripeSessionUrl()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      ...(stripeCoupon ? { discounts: [{ coupon: stripeCoupon.id }] } : {}),
      customer_email: customerEmail,
      client_reference_id: String(order.id),
      metadata: {
        orderId: String(order.id),
        locale: locale || 'en',
        referralProgram: REFERRAL_PROGRAM,
      },
      success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment/cancel?order_id=${order.id}`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'SG', 'MY', 'TH', 'VN', 'KR', 'NZ', 'NL', 'IT', 'ES', 'CH', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'IE'],
      },
    })

    try {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } })
        if (coupon) {
          const reservation = await tx.coupon.updateMany({
            where: { id: coupon.id, usedAt: null, orderId: null },
            data: { orderId: order.id },
          })
          if (!reservation.count) throw new Error('Coupon already reserved')
        }
      })
    } catch (error) {
      await stripe.checkout.sessions.expire(session.id)
      throw error
    }

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
