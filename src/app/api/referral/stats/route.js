import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const auth = getAuthUser(request)
  if (!auth) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const userId = auth.id

  const [referralCount, referrals, coupon] = await Promise.all([
    prisma.referral.count({ where: { referrerId: userId } }),
    prisma.referral.findMany({
      where: { referrerId: userId },
      include: { referee: { select: { id: true, name: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.coupon.findFirst({
      where: { userId, usedAt: null, orderId: null },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return NextResponse.json({
    referralCount,
    referrals,
    coupon,
    target: 3,
    progress: Math.min(referralCount / 3 * 100, 100),
    referralLink: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3457'}/auth/register?ref=${userId}`,
  })
}
