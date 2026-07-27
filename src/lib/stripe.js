let stripeInstance = null

export function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    const Stripe = require('stripe')
    stripeInstance = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return stripeInstance
}

export function getStripeSessionUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3457'
}
