import { NextResponse } from 'next/server'
import { readdir, stat, unlink, mkdir } from 'fs/promises'
import path from 'path'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

async function scanDir(dirPath, baseFolder = '') {
  const entries = []
  let files

  try {
    files = await readdir(dirPath, { withFileTypes: true })
  } catch {
    return entries
  }

  for (const entry of files) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      const sub = await scanDir(fullPath, path.join(baseFolder, entry.name))
      entries.push(...sub)
    } else if (entry.isFile()) {
      const stats = await stat(fullPath)
      const ext = path.extname(entry.name).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm'].includes(ext)) {
        entries.push({
          name: entry.name,
          url: `/uploads${baseFolder ? '/' + baseFolder : ''}/${entry.name}`,
          folder: baseFolder || '/',
          size: stats.size,
          modifiedAt: stats.mtime.toISOString(),
          ext,
        })
      }
    }
  }

  return entries
}

export async function GET(request) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const folder = searchParams.get('folder') || ''
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 48

  // Ensure upload directories exist
  try { await mkdir(path.join(UPLOADS_DIR, 'reviews'), { recursive: true }) } catch {}
  try { await mkdir(path.join(UPLOADS_DIR, 'products'), { recursive: true }) } catch {}

  let allFiles = await scanDir(UPLOADS_DIR)

  // Filter by folder
  if (folder) {
    allFiles = allFiles.filter(f => f.folder === folder)
  }

  // Filter by search
  if (search) {
    const q = search.toLowerCase()
    allFiles = allFiles.filter(f => f.name.toLowerCase().includes(q))
  }

  // Sort by newest first
  allFiles.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))

  const total = allFiles.length
  const totalPages = Math.ceil(total / pageSize)
  const files = allFiles.slice((page - 1) * pageSize, page * pageSize)

  // Gather unique folders
  const folders = [...new Set(allFiles.map(f => f.folder))].sort()

  return NextResponse.json({ files, total, page, pageSize, totalPages, folders })
}

export async function DELETE(request) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const urls = body.urls || []

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: '请选择要删除的文件' }, { status: 400 })
    }

    const results = []
    for (const url of urls) {
      // Security: ensure URL is within /uploads/
      if (!url.startsWith('/uploads/')) {
        results.push({ url, success: false, error: '路径不合法' })
        continue
      }

      const filePath = path.join(process.cwd(), 'public', url)
      try {
        await unlink(filePath)
        results.push({ url, success: true })
      } catch (err) {
        results.push({ url, success: false, error: err.message })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('删除文件失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
