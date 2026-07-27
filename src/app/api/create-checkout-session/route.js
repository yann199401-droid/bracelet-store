import { getStripe, getStripeSessionUrl } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { getTokenFromCookies, verifyToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { items, total, discount, couponCode, customerName, customerEmail, customerPhone, customerAddr, locale } = body

    // Validate
    if (!items || items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!customerName || !customerEmail) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Get user if logged in
    let userId = null
    try {
      const token = getTokenFromCookies(request)
      if (token) {
        const decoded = verifyToken(token)
        userId = decoded.id
      }
    } catch {
      // Guest checkout is fine
    }

    // Create order in database first (status: PENDING)
    const order = await prisma.order.create({
      data: {
        userId,
        items: JSON.stringify(items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity }))),
        total,
        discount: discount || 0,
        status: 'PENDING',
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        customerAddr: customerAddr || '',
      },
    })

    // Build Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))

    // Apply discount as a negative line item
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: couponCode ? `Coupon (${couponCode})` : 'Discount',
          },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      })
    }

    const siteUrl = getStripeSessionUrl()

    const stripe = getStripe()
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail,
      client_reference_id: String(order.id),
      metadata: {
        orderId: String(order.id),
        locale: locale || 'en',
      },
      success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment/cancel?order_id=${order.id}`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'SG', 'MY', 'TH', 'VN', 'KR', 'NZ', 'NL', 'IT', 'ES', 'CH', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'IE'],
      },
    })

    // Store Stripe session ID on the order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    // Mark coupon as used if applicable
    if (couponCode && userId) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
      if (coupon && !coupon.usedAt) {
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedAt: new Date(), orderId: order.id },
        })
      }
    }

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
