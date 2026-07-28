import { BetaAnalyticsDataClient } from '@google-analytics/data'

function getClient() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  if (!credentials.client_email || !credentials.private_key) {
    return null
  }

  return new BetaAnalyticsDataClient({
    credentials,
  })
}

const propertyId = () => process.env.GA4_PROPERTY_ID

export async function getOverview(days = 28) {
  const client = getClient()
  if (!client) return null

  const property = propertyId()
  if (!property) return null

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - days)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const fmt = (d) => d.toISOString().split('T')[0]

  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate: fmt(startDate), endDate: fmt(today) }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
      { name: 'newUsers' },
    ],
    dimensions: [{ name: 'date' }],
    orderBy: [{ dimension: { dimensionName: 'date' }, desc: false }],
    limit: days + 1,
  })

  const rows = response.rows || []
  const totals = { activeUsers: 0, screenPageViews: 0, sessions: 0, newUsers: 0 }
  const dateSeries = []

  for (const row of rows) {
    const date = row.dimensionValues[0].value
    const users = parseInt(row.metricValues[0].value) || 0
    const pageViews = parseInt(row.metricValues[1].value) || 0
    const sessions = parseInt(row.metricValues[2].value) || 0
    const bounceRate = parseFloat(row.metricValues[3].value) || 0
    const avgDuration = parseFloat(row.metricValues[4].value) || 0
    const newUsers = parseInt(row.metricValues[5].value) || 0

    totals.activeUsers += users
    totals.screenPageViews += pageViews
    totals.sessions += sessions
    totals.newUsers += newUsers

    dateSeries.push({ date, users, pageViews, sessions, bounceRate, avgDuration })
  }

  return {
    totals: {
      activeUsers: totals.activeUsers,
      screenPageViews: totals.screenPageViews,
      sessions: totals.sessions,
      newUsers: totals.newUsers,
      avgDuration: dateSeries.length > 0
        ? Math.round(dateSeries.reduce((s, d) => s + d.avgDuration, 0) / dateSeries.length)
        : 0,
      bounceRate: dateSeries.length > 0
        ? parseFloat((dateSeries.reduce((s, d) => s + d.bounceRate, 0) / dateSeries.length).toFixed(1))
        : 0,
    },
    dateSeries,
  }
}

export async function getTrafficSources(days = 28) {
  const client = getClient()
  if (!client) return null

  const property = propertyId()
  if (!property) return null

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - days)

  const fmt = (d) => d.toISOString().split('T')[0]

  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate: fmt(startDate), endDate: fmt(today) }],
    metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
    dimensions: [{ name: 'sessionSource' }],
    orderBy: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 10,
  })

  return (response.rows || []).map(row => ({
    source: row.dimensionValues[0].value,
    users: parseInt(row.metricValues[0].value) || 0,
    pageViews: parseInt(row.metricValues[1].value) || 0,
  }))
}

export async function getTopPages(days = 28) {
  const client = getClient()
  if (!client) return null

  const property = propertyId()
  if (!property) return null

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - days)

  const fmt = (d) => d.toISOString().split('T')[0]

  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate: fmt(startDate), endDate: fmt(today) }],
    metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
    dimensions: [{ name: 'pagePath' }],
    orderBy: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 15,
  })

  return (response.rows || []).map(row => ({
    path: row.dimensionValues[0].value,
    pageViews: parseInt(row.metricValues[0].value) || 0,
    users: parseInt(row.metricValues[1].value) || 0,
  }))
}
