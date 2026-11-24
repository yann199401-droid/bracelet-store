import { commissionCents } from './promotions'

const paidStatuses = ['PAID', 'SHIPPED', 'DELIVERED']

const keyFor = (referrerId, refereeId) => `referral-commission:${referrerId}:${refereeId}`

export async function recordFirstOrderCommission(tx, { order, netMerchandiseCents, paidAt }) {
  if (!order.userId || netMerchandiseCents <= 0) return

  const referral = await tx.referral.findUnique({ where: { refereeId: order.userId } })
  if (!referral) return

  const earlierPaidOrder = await tx.order.findFirst({
    where: {
      id: { not: order.id },
      userId: order.userId,
      status: { in: paidStatuses },
      stripePaymentIntentId: { not: null },
    },
    select: { id: true },
  })
  if (earlierPaidOrder) return

  const key = keyFor(referral.referrerId, referral.refereeId)
  await tx.siteSetting.upsert({
    where: { key },
    create: { key, value: JSON.stringify({ orderId: order.id, amountCents: commissionCents(netMerchandiseCents), paidAt }) },
    update: {},
  })
}

export async function getPendingCommissions(prisma, referrerId) {
  const records = await prisma.siteSetting.findMany({
    where: { key: { startsWith: `referral-commission:${referrerId}:` } },
    select: { value: true },
  })
  return records.map(({ value }) => JSON.parse(value))
}
