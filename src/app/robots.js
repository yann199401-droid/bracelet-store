export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: 'http://localhost:3457/sitemap.xml',
  }
}
