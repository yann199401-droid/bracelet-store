import { getStripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  const stripe = getStripe()
  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = parseInt(session.metadata?.orderId)
        const paymentIntentId = session.payment_intent

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
              stripePaymentIntentId: paymentIntentId,
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

          // Reduce stock for each item
          const order = await prisma.order.findUnique({ where: { id: orderId } })
          if (order) {
            const orderItems = JSON.parse(order.items)
            for (const item of orderItems) {
              await prisma.product.updateMany({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } },
              })
            }

            // Send order confirmation email
            const locale = session.metadata?.locale || 'en'
            await sendOrderConfirmation({
              orderId: order.id,
              customerEmail: session.customer_details?.email || order.customerEmail,
              customerName: session.customer_details?.name || order.customerName,
              items: orderItems,
              total: order.total,
              discount: order.discount,
              shippingAddr: order.customerAddr,
              locale,
            })
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const expiredSession = event.data.object
        const expiredOrderId = parseInt(expiredSession.metadata?.orderId)
        if (expiredOrderId) {
          await prisma.order.update({
            where: { id: expiredOrderId },
            data: { status: 'CANCELLED' },
          })
        }
        break
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return Response.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return Response.json({ received: true })
}
