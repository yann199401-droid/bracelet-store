import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    const { name, email, password, ref } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
    }
    const user = await prisma.user.create({
      data: { name, email, password: hashPassword(password) },
    })

    // Track referral if ref parameter is provided
    if (ref) {
      const referrerId = parseInt(ref)
      if (!isNaN(referrerId) && referrerId !== user.id) {
        const referrerExists = await prisma.user.findUnique({ where: { id: referrerId } })
        if (referrerExists) {
          await prisma.referral.create({
            data: { referrerId, refereeId: user.id },
          })

          // Check if referrer now has 3 referrals → generate coupon
          const referralCount = await prisma.referral.count({ where: { referrerId } })
          if (referralCount >= 3) {
            const existingCoupon = await prisma.coupon.findFirst({
              where: { userId: referrerId, code: { startsWith: 'ZEN50-' } },
            })
            if (!existingCoupon) {
              const code = `ZEN50-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
              await prisma.coupon.create({
                data: {
                  code,
                  discount: 50,
                  minAmount: 80,
                  userId: referrerId,
                  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
                },
              })
            }
          }
        }
      }
    }

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
}
