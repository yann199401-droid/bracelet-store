import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const auth = getAuthUser(request)
  if (!auth) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const total = parseFloat(searchParams.get('total') || '0')

  if (!code) {
    return NextResponse.json({ error: '请输入优惠码' }, { status: 400 })
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } })

  if (!coupon) {
    return NextResponse.json({ valid: false, error: '优惠码不存在' })
  }

  if (coupon.userId !== auth.id) {
    return NextResponse.json({ valid: false, error: '该优惠码不属于当前账户' })
  }

  if (coupon.usedAt || coupon.orderId) {
    return NextResponse.json({ valid: false, error: '该优惠码已被使用' })
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, error: '该优惠码已过期' })
  }

  if (total < coupon.minAmount) {
    return NextResponse.json({
      valid: false,
      error: `订单金额需满 $${coupon.minAmount} 才能使用该优惠码`,
      needsAmount: coupon.minAmount,
    })
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      discount: coupon.discount,
      minAmount: coupon.minAmount,
    },
  })
}
