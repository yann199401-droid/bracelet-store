import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const baseUrl = 'https://myzenbeads.com'

  let productUrls = []
  let blogUrls = []

  try {
    const [products, blogPosts] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    blogUrls = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch (e) {
    // 构建时数据库不可用，跳过
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/forum`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/auth/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...productUrls,
    ...blogUrls,
  ]
}
