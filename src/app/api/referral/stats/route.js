import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { getPendingCommissions } from '@/lib/referral-commission'

export async function GET(request) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '请先登录' }, { status: 401 })

  const [referralCount, commissions] = await Promise.all([
    prisma.referral.count({ where: { referrerId: auth.id } }),
    getPendingCommissions(prisma, auth.id),
  ])
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://myzenbeads.com'

  return NextResponse.json({
    referralCount,
    commissionCents: commissions.reduce((sum, order) => sum + order.amountCents, 0),
    referralLink: new URL(`/auth/register?ref=${auth.id}`, site).href,
  }, { headers: { 'Cache-Control': 'private, no-store' } })
}
