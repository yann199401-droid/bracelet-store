import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { requireAdmin } from '@/lib/admin-auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件格式，请上传 JPG/PNG/GIF/WebP 图片' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '文件过大，请控制在 10MB 以内' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads', 'products')
    const filepath = path.join(dir, filename)

    await mkdir(dir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    const url = `/uploads/products/${filename}`

    return NextResponse.json({ url, filename })
  } catch (error) {
    console.error('上传失败:', error)
    return NextResponse.json({ error: '上传失败，请稍后重试' }, { status: 500 })
  }
}
