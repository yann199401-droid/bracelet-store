import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
const MAX_SIZE = 15 * 1024 * 1024 // 15MB

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件格式，请上传 JPG/PNG/GIF/WebP 图片或 MP4/WebM 视频' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '文件过大，请控制在 15MB 以内' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads', 'reviews')
    const filepath = path.join(dir, filename)

    await mkdir(dir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    const url = `/uploads/reviews/${filename}`
    const type = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE'

    return NextResponse.json({ url, type, filename })
  } catch (error) {
    console.error('上传失败:', error)
    return NextResponse.json({ error: '上传失败，请稍后重试' }, { status: 500 })
  }
}
