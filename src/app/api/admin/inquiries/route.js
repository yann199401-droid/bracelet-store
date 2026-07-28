import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const isRead = searchParams.get('isRead') // 'true', 'false', or null (all)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 20

  const where = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (isRead === 'true') where.isRead = true
  else if (isRead === 'false') where.isRead = false

  const [inquiries, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.count({ where }),
  ])

  return NextResponse.json({
    inquiries,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
}
