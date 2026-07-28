import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getLocale, t } from '@/lib/i18n-server'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const locale = getLocale()
  return {
    title: locale === 'en' ? 'Blog — Zen Craft Bracelets' : '博客 — 禅意手作 | Zen Craft Bracelets',
    description: locale === 'en'
      ? 'Read about bracelet care, gemstone meanings, wood types, and Zen lifestyle tips.'
      : '了解手串保养、宝石寓意、木料知识和禅意生活。',
  }
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams
  const page = parseInt(params.page) || 1
  const pageSize = 9
  const locale = getLocale()

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-chinese-ink mb-2">
        {locale === 'en' ? 'Blog' : '博客'}
      </h1>
      <p className="text-gray-500 mb-8">
        {locale === 'en'
          ? 'Bracelet care, gemstone meanings, and Zen lifestyle.'
          : '手串保养、宝石寓意、禅意生活'}
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {locale === 'en' ? 'No posts yet. Coming soon.' : '暂无文章，敬请期待。'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => {
              let tags = []
              try { tags = JSON.parse(post.tags) } catch {}
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden
                    hover:shadow-md transition-shadow">
                  {post.coverImage ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={post.coverImage} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-chinese-red/10 to-chinese-gold/10
                      flex items-center justify-center text-chinese-gold text-4xl font-serif">禅</div>
                  )}
                  <div className="p-5">
                    <h2 className="font-bold text-chinese-ink group-hover:text-chinese-red transition-colors mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN')}</span>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-chinese-ivory-dark text-gray-500 px-2 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/blog?page=${p}`}
                  className={`px-3 py-1.5 text-sm rounded ${
                    p === page
                      ? 'bg-chinese-red text-white'
                      : 'bg-white border text-gray-600 hover:bg-gray-50'
                  }`}>{p}</Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
