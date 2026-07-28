import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    return NextResponse.json(post)
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: '文章不存在' }, { status: 404 })

    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, author, tags, published } = body

    const data = {}
    if (title !== undefined) data.title = title
    if (content !== undefined) data.content = content
    if (excerpt !== undefined) data.excerpt = excerpt
    if (coverImage !== undefined) data.coverImage = coverImage
    if (author !== undefined) data.author = author
    if (tags !== undefined) data.tags = JSON.stringify(tags)
    if (published !== undefined) data.published = !!published
    if (slug !== undefined) {
      const slugConflict = await prisma.blogPost.findFirst({
        where: { slug, id: { not: id } },
      })
      if (slugConflict) return NextResponse.json({ error: 'Slug 已被使用' }, { status: 409 })
      data.slug = slug
    }

    const post = await prisma.blogPost.update({ where: { id }, data })
    return NextResponse.json(post)
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: '文章不存在' }, { status: 404 })

    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
