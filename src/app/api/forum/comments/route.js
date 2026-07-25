import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { postId, content, name } = await request.json()
    if (!postId || !content) {
      return NextResponse.json({ error: '请填写必填字段' }, { status: 400 })
    }

    let user = await prisma.user.findUnique({ where: { email: `comment_${name}@zencraft.com` } })
    if (!user) {
      user = await prisma.user.create({
        data: { name: name || '匿名用户', email: `comment_${Date.now()}@zencraft.com`, password: 'guest' },
      })
    }

    const comment = await prisma.forumComment.create({
      data: { content, postId: parseInt(postId), userId: user.id },
    })
    return NextResponse.json(comment, { status: 201 })
  } catch {
    return NextResponse.json({ error: '回复失败' }, { status: 500 })
  }
}
