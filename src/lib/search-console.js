import { google } from 'googleapis'

function getAuth() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  if (!credentials.client_email || !credentials.private_key) return null

  return new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/webmasters.readonly']
  )
}

const siteUrl = () => process.env.SEARCH_CONSOLE_SITE_URL

export async function getSearchPerformance(days = 28) {
  const auth = getAuth()
  if (!auth) return null

  const url = siteUrl()
  if (!url) return null

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - days)

  const fmt = (d) => d.toISOString().split('T')[0]

  try {
    const webmasters = google.webmasters({ version: 'v3', auth })

    const response = await webmasters.searchanalytics.query({
      siteUrl: url,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(today),
        dimensions: [],
      },
    })

    const rows = response.data.rows || []
    const total = rows.reduce(
      (acc, row) => ({
        clicks: acc.clicks + (row.clicks || 0),
        impressions: acc.impressions + (row.impressions || 0),
        position: acc.position + (row.position || 0),
      }),
      { clicks: 0, impressions: 0, position: 0 }
    )

    return {
      totals: {
        clicks: Math.round(total.clicks),
        impressions: Math.round(total.impressions),
        ctr: rows.length > 0
          ? parseFloat((total.clicks / (total.impressions || 1) * 100).toFixed(1))
          : 0,
        position: rows.length > 0
          ? parseFloat((total.position / rows.length).toFixed(1))
          : 0,
      },
    }
  } catch (err) {
    console.error('Search Console API error:', err.message)
    return null
  }
}

export async function getTopQueries(days = 28, limit = 15) {
  const auth = getAuth()
  if (!auth) return null

  const url = siteUrl()
  if (!url) return null

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - days)

  const fmt = (d) => d.toISOString().split('T')[0]

  try {
    const webmasters = google.webmasters({ version: 'v3', auth })

    const response = await webmasters.searchanalytics.query({
      siteUrl: url,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(today),
        dimensions: ['query'],
        rowLimit: limit,
      },
    })

    return (response.data.rows || []).map(row => ({
      query: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: parseFloat(((row.clicks || 0) / ((row.impressions || 1)) * 100).toFixed(1)),
      position: parseFloat((row.position || 0).toFixed(1)),
    }))
  } catch (err) {
    console.error('Search Console API error:', err.message)
    return null
  }
}

export async function getTopPages(days = 28, limit = 15) {
  const auth = getAuth()
  if (!auth) return null

  const url = siteUrl()
  if (!url) return null

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - days)

  const fmt = (d) => d.toISOString().split('T')[0]

  try {
    const webmasters = google.webmasters({ version: 'v3', auth })

    const response = await webmasters.searchanalytics.query({
      siteUrl: url,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(today),
        dimensions: ['page'],
        rowLimit: limit,
      },
    })

    return (response.data.rows || []).map(row => ({
      page: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: parseFloat(((row.clicks || 0) / ((row.impressions || 1)) * 100).toFixed(1)),
      position: parseFloat((row.position || 0).toFixed(1)),
    }))
  } catch (err) {
    console.error('Search Console API error:', err.message)
    return null
  }
}
