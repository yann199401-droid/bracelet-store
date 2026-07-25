import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request) {
  try {
    const { items, total, discount, couponCode, customerName, customerEmail, customerPhone, customerAddr } = await request.json()

    if (!items || !items.length || !customerName || !customerEmail) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    // If coupon code provided, validate and mark as used
    if (couponCode) {
      const auth = getAuthUser(request)
      if (!auth) {
        return NextResponse.json({ error: '使用优惠码需要先登录' }, { status: 401 })
      }

      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
      if (!coupon || coupon.userId !== auth.id || coupon.usedAt || coupon.orderId) {
        return NextResponse.json({ error: '优惠码无效' }, { status: 400 })
      }

      const order = await prisma.order.create({
        data: {
          items: JSON.stringify(items),
          total,
          discount: discount || 0,
          customerName,
          customerEmail,
          customerPhone,
          customerAddr,
          status: 'PENDING',
        },
      })

      // Mark coupon as used
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedAt: new Date(), orderId: order.id },
      })

      return NextResponse.json({ success: true, orderId: order.id, discount: discount || 0 })
    }

    const order = await prisma.order.create({
      data: {
        items: JSON.stringify(items),
        total,
        discount: discount || 0,
        customerName,
        customerEmail,
        customerPhone,
        customerAddr,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('创建订单失败:', error)
    return NextResponse.json({ error: '创建订单失败，请稍后重试' }, { status: 500 })
  }
}
