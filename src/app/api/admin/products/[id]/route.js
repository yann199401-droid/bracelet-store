import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('获取产品失败:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    const existing = await prisma.product.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    const body = await request.json()
    const { name, slug, description, material, price, sku, stock, diameter, lengthCm, images, featured } = body

    const data = {}

    if (name !== undefined) data.name = name
    if (slug !== undefined) {
      // Check slug uniqueness (excluding self)
      const slugConflict = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      })
      if (slugConflict) {
        return NextResponse.json({ error: 'Slug 已被使用' }, { status: 409 })
      }
      data.slug = slug
    }
    if (description !== undefined) data.description = description
    if (material !== undefined) data.material = material
    if (price !== undefined) {
      const parsedPrice = parseFloat(price)
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return NextResponse.json({ error: '价格必须为大于 0 的数字' }, { status: 400 })
      }
      data.price = parsedPrice
    }
    if (sku !== undefined) {
      const skuConflict = await prisma.product.findFirst({
        where: { sku, id: { not: id } },
      })
      if (skuConflict) {
        return NextResponse.json({ error: 'SKU 已被使用' }, { status: 409 })
      }
      data.sku = sku
    }
    if (stock !== undefined) data.stock = parseInt(stock)
    if (diameter !== undefined) data.diameter = parseFloat(diameter)
    if (lengthCm !== undefined) data.lengthCm = parseFloat(lengthCm)
    if (images !== undefined) data.images = JSON.stringify(images)
    if (featured !== undefined) data.featured = !!featured

    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('更新产品失败:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    const existing = await prisma.product.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    // Soft delete — set active to false
    await prisma.product.update({
      where: { id },
      data: { active: false },
    })

    return NextResponse.json({ success: true, message: '产品已删除' })
  } catch (error) {
    console.error('删除产品失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
