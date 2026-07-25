import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { productId, rating, content, name, media } = await request.json()
    if (!productId || !rating || !content) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    let user = await prisma.user.findUnique({ where: { email: 'guest@zencraft.com' } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || '匿名用户',
          email: 'guest@zencraft.com',
          password: 'guest',
        },
      })
    }

    const review = await prisma.productReview.create({
      data: {
        productId,
        userId: user.id,
        rating,
        content,
        media: JSON.stringify(media || []),
      },
    })
    return NextResponse.json({ ...review, media: JSON.parse(review.media) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '评价提交失败' }, { status: 500 })
  }
}
