import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const decoded = getAuthUser(request)
  if (!decoded) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, email: true, role: true },
  })
  return NextResponse.json(user)
}
