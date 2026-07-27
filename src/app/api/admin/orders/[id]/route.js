import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function PATCH(request, { params }) {
  const admin = requireAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orderId = parseInt(params.id)
    const { status, trackingNumber, carrier } = await request.json()

    const updateData = {}
    if (status) updateData.status = status
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
    if (carrier !== undefined) updateData.carrier = carrier

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })

    return NextResponse.json({ ...order, items: JSON.parse(order.items || '[]') })
  } catch (error) {
    console.error('更新订单失败:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
