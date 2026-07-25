import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '请填写所有字段' }, { status: 400 })
    }
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '发送失败' }, { status: 500 })
  }
}
