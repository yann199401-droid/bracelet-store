import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getLocale, t } from '@/lib/i18n-server'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const locale = getLocale()
  return {
    title: locale === 'en' ? 'Time in Detail Journal' : '时间有迹手记',
    description: locale === 'en'
      ? 'Read about bead materials, bracelet care, and choosing a gift.'
      : '阅读材质资料、手串养护与赠礼选款指南。',
  }
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page, 10) || 1)
  const pageSize = 9
  const locale = getLocale()

  const en = locale === 'en'
  const topics = [
    { title: en ? 'Where a bead comes from' : '一串的来历', href: '/archive',
      text: en ? 'Read style records and their source notes.' : '查看款式规格和材质资料来源。' },
    { title: en ? 'Care after wearing' : '佩戴与保养', href: '/guide',
      text: en ? 'Measure your wrist and care for beads and cord.' : '量手围，养护珠子与绳线。' },
    { title: en ? 'A gift for a moment' : '给某一刻的礼物', href: '/collections/timing?series=gifts',
      text: en ? 'Browse designs selected for giving.' : '按赠礼和纪念场景选款。' },
  ]
  let posts = []
  let total = 0
  let unavailable = false
  try {
    [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blogPost.count({ where: { published: true } }),
    ])
  } catch (error) {
    console.error('Journal posts could not be loaded', error)
    unavailable = true
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="timing-page">
      <div className="timing-shell py-12">
      <h1 className="timing-heading">{en ? 'Time in Detail Journal' : '时间有迹手记'}</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {topics.map(({ title, href, text }) => (
          <Link key={href} href={href} className="timing-card p-5">
            <h2 className="text-lg">{title}</h2>
            <p className="mt-2 text-sm text-stone-700">{text}</p>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {unavailable ? (en ? 'Articles are temporarily unavailable.' : '文章暂不可用。') : (en ? 'No articles yet.' : '暂无文章。')}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => {
              let tags = []
              try {
                const parsed = JSON.parse(post.tags)
                if (Array.isArray(parsed)) tags = parsed.filter((tag) => typeof tag === 'string')
              } catch {}
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
    </div>
  )
}
