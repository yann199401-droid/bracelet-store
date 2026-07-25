import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  const products = await prisma.product.findMany({
    where: search ? { name: { contains: search } } : {},
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}
