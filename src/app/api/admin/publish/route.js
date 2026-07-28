import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { setMaintenanceMode, getPublishStatus, setSetting } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

// GET /api/admin/publish — get current publish/maintenance status
export async function GET(request) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = await getPublishStatus()
  return NextResponse.json({
    ...status,
    vercelHookConfigured: !!process.env.VERCEL_DEPLOY_HOOK_URL,
  })
}

// POST /api/admin/publish — execute publish actions
export async function POST(request) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { action } = body
    const results = []

    switch (action) {
      case 'publish': {
        // Revalidate key paths
        const paths = body.paths || ['/', '/products', '/blog']
        for (const p of paths) {
          revalidatePath(p, 'page')
          results.push({ revalidated: p })
        }
        // Also revalidate by tags
        revalidatePath('/', 'layout')

        // Update last published timestamp
        await setSetting('lastPublishedAt', new Date().toISOString())

        // Disable maintenance if it was on
        await setMaintenanceMode(false)

        results.push({ maintenance: 'disabled' })
        results.push({ publishedAt: new Date().toISOString() })

        return NextResponse.json({ success: true, results })
      }

      case 'maintenance-on': {
        const message = body.message || '网站正在更新中，请稍后再来访问。'
        await setMaintenanceMode(true, message)
        return NextResponse.json({ success: true, maintenance: true, message })
      }

      case 'maintenance-off': {
        await setMaintenanceMode(false)
        return NextResponse.json({ success: true, maintenance: false })
      }

      case 'deploy': {
        const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
        if (!hookUrl) {
          return NextResponse.json({ success: false, error: '未配置 Vercel Deploy Hook URL' }, { status: 400 })
        }

        const deployRes = await fetch(hookUrl, { method: 'POST' })
        if (!deployRes.ok) {
          const text = await deployRes.text()
          return NextResponse.json({ success: false, error: `Vercel 部署失败: ${text}` }, { status: 502 })
        }

        return NextResponse.json({ success: true, deployed: true })
      }

      case 'revalidate': {
        const paths = body.paths || ['/', '/products', '/blog', '/sitemap.xml']
        for (const p of paths) {
          revalidatePath(p, 'page')
          results.push({ revalidated: p })
        }
        revalidatePath('/', 'layout')
        return NextResponse.json({ success: true, results })
      }

      default:
        return NextResponse.json({ error: `未知操作: ${action}` }, { status: 400 })
    }
  } catch (err) {
    console.error('Publish API error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
