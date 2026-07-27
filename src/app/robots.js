export const dynamic = 'force-dynamic'

export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3457'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
