import prisma from '@/lib/prisma'
import { timingPath } from '@/lib/timing'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const baseUrl = 'https://myzenbeads.com'
  const paths = ['/', '/products', '/about', '/blog', '/forum', timingPath, '/archive', '/guide']
  const [products, posts] = await Promise.allSettled([
    prisma.product.findMany({ where: { active: true }, select: { id: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])

  return [
    ...paths.map((path) => ({ url: new URL(path, baseUrl).href })),
    ...(products.status === 'fulfilled' ? products.value.map(({ id, updatedAt }) => ({
      url: `${baseUrl}/products/${id}`, lastModified: updatedAt,
    })) : []),
    ...(posts.status === 'fulfilled' ? posts.value.map(({ slug, updatedAt }) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(slug)}`, lastModified: updatedAt,
    })) : []),
  ]
}
