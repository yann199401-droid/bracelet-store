import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getOverview, getTrafficSources, getTopPages as getGaTopPages } from '@/lib/ga4'
import { getSearchPerformance, getTopQueries, getTopPages as getScTopPages } from '@/lib/search-console'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const auth = requireAdmin(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '28')

  const isConfigured = !!(process.env.GA4_PROPERTY_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)

  if (!isConfigured) {
    return NextResponse.json({
      configured: false,
      error: 'Google Analytics 尚未配置',
      ga4: null,
      searchConsole: null,
    })
  }

  try {
    const [ga4Overview, ga4Sources, ga4Pages, scPerformance, scQueries, scPages] = await Promise.all([
      getOverview(days),
      getTrafficSources(days),
      getGaTopPages(days),
      getSearchPerformance(days),
      getTopQueries(days),
      getScTopPages(days),
    ])

    return NextResponse.json({
      configured: true,
      days,
      ga4: {
        overview: ga4Overview,
        trafficSources: ga4Sources,
        topPages: ga4Pages,
      },
      searchConsole: {
        performance: scPerformance,
        topQueries: scQueries,
        topPages: scPages,
      },
    })
  } catch (err) {
    console.error('Analytics API error:', err.message)
    return NextResponse.json({
      configured: true,
      error: err.message,
      ga4: null,
      searchConsole: null,
    }, { status: 500 })
  }
}
