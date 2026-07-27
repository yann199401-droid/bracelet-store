import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const categories = await prisma.forumCategory.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(categories)
}
