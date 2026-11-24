import { getStripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email'
import { REFERRAL_PROGRAM } from '@/lib/promotions'
import { recordFirstOrderCommission } from '@/lib/referral-commission'

export async function POST(request) {
  const body = await request.text()
  const stripe = getStripe()
  let event
  try {
    event = stripe.webhooks.constructEvent(body, request.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const session = event.data.object
    const orderId = Number(session.metadata?.orderId)
    if (!Number.isSafeInteger(orderId) || orderId < 1) return Response.json({ received: true })

    if (event.type === 'checkout.session.completed' && session.payment_status === 'paid') {
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.updateMany({
          where: { id: orderId, status: 'PENDING', stripeSessionId: session.id },
          data: {
            status: 'PAID',
            stripePaymentIntentId: session.payment_intent,
            customerEmail: session.customer_details?.email || undefined,
            customerName: session.customer_details?.name || undefined,
            customerAddr: [
              session.shipping_details?.address?.line1,
              session.shipping_details?.address?.city,
              session.shipping_details?.address?.state,
              session.shipping_details?.address?.postal_code,
              session.shipping_details?.address?.country,
            ].filter(Boolean).join(', ') || undefined,
          },
        })
        if (!updated.count) return null

        const order = await tx.order.findUnique({ where: { id: orderId } })
        const items = JSON.parse(order.items)
        for (const { id, quantity } of items) {
          await tx.product.updateMany({
            where: { id },
            data: { stock: { decrement: quantity } },
          })
        }

        const paidAt = new Date(event.created * 1000)
        await tx.coupon.updateMany({
          where: { orderId, usedAt: null },
          data: { usedAt: paidAt },
        })
        if (session.metadata?.referralProgram === REFERRAL_PROGRAM && session.currency === 'usd') {
          await recordFirstOrderCommission(tx, {
            order,
            netMerchandiseCents: (session.amount_subtotal || 0) - (session.total_details?.amount_discount || 0),
            paidAt,
          })
        }
        return { order, items }
      })

      if (result) {
        const { order, items } = result
        await sendOrderConfirmation({
          orderId: order.id,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          items,
          total: order.total,
          discount: order.discount,
          shippingAddr: order.customerAddr,
          locale: session.metadata?.locale || 'en',
        })
      }
    }

    if (event.type === 'checkout.session.expired') {
      await prisma.$transaction(async (tx) => {
        const updated = await tx.order.updateMany({
          where: { id: orderId, status: 'PENDING', stripeSessionId: session.id },
          data: { status: 'CANCELLED' },
        })
        if (updated.count) {
          await tx.coupon.updateMany({
            where: { orderId, usedAt: null },
            data: { orderId: null },
          })
        }
      })
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return Response.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return Response.json({ received: true })
}
