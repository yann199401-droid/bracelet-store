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

export async function GET(request) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 20

  const where = search
    ? { name: { contains: search, mode: 'insensitive' } }
    : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
}

export async function POST(request) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const { name, slug, description, material, price, sku, stock, diameter, lengthCm, images, featured } = body

    if (!name || !sku || price === undefined) {
      return NextResponse.json({ error: '请填写必填字段（名称、SKU、价格）' }, { status: 400 })
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: '价格必须为大于 0 的数字' }, { status: 400 })
    }

    let finalSlug = slug || slugify(name)
    if (!finalSlug) {
      return NextResponse.json({ error: '无法生成 Slug' }, { status: 400 })
    }

    // Ensure unique slug
    const existing = await prisma.product.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now()}`
    }

    // Ensure unique SKU
    const existingSku = await prisma.product.findUnique({ where: { sku } })
    if (existingSku) {
      return NextResponse.json({ error: 'SKU 已存在' }, { status: 409 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description: description || '',
        material: material || 'WOOD',
        price: parsedPrice,
        sku,
        stock: parseInt(stock || '0'),
        diameter: parseFloat(diameter || '0'),
        lengthCm: parseFloat(lengthCm || '0'),
        images: JSON.stringify(images || []),
        featured: !!featured,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('创建产品失败:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
