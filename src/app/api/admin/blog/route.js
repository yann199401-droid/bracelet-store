import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 20

  const where = search
    ? { title: { contains: search, mode: 'insensitive' } }
    : {}

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ])

  return NextResponse.json({ posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
}

export async function POST(request) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, author, tags, published } = body

    if (!title || !content) {
      return NextResponse.json({ error: '请填写标题和内容' }, { status: 400 })
    }

    let finalSlug = slug || slugify(title)
    if (!finalSlug) return NextResponse.json({ error: '无法生成 Slug' }, { status: 400 })

    // Ensure unique slug
    const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } })
    if (existing) finalSlug = `${finalSlug}-${Date.now()}`

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        content,
        excerpt: excerpt || '',
        coverImage: coverImage || '',
        author: author || 'Admin',
        tags: JSON.stringify(tags || []),
        published: !!published,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('创建文章失败:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
