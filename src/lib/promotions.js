export const FREE_SHIPPING_MINIMUM_CENTS = 20_000
export const REFERRAL_COMMISSION_PERCENT = 10
export const REFERRAL_PROGRAM = 'first-order-v1'

export function commissionCents(netMerchandiseCents) {
  return Math.round(netMerchandiseCents * REFERRAL_COMMISSION_PERCENT / 100)
}
