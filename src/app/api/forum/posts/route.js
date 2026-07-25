import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { title, content, categoryId, name } = await request.json()
    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: '请填写必填字段' }, { status: 400 })
    }

    let user = await prisma.user.findUnique({ where: { email: `forum_${name}@zencraft.com` } })
    if (!user) {
      user = await prisma.user.create({
        data: { name: name || '匿名用户', email: `forum_${Date.now()}@zencraft.com`, password: 'guest' },
      })
    }

    const post = await prisma.forumPost.create({
      data: { title, content, categoryId: parseInt(categoryId), userId: user.id },
    })
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: '发帖失败' }, { status: 500 })
  }
}
