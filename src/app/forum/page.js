import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getLocale, t } from '@/lib/i18n-server'

export const dynamic = 'force-dynamic'

export default async function ForumPage() {
  const locale = getLocale();
  const tr = (key, p) => t(locale, key, p);
  const categories = await prisma.forumCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      posts: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, _count: { select: { comments: true } } },
      },
      _count: { select: { posts: true } },
    },
  })

  return (
    <div className="cloud-bg min-h-screen">
      <section className="bg-chinese-ink py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">{tr('forum.title')}</h1>
          <p className="text-gray-400">{tr('forum.desc')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">暂无论坛板块</p>
            <Link href="/forum/new" className="chinese-btn-primary">创建第一篇帖子</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat.id} className="chinese-card">
                <div className="bg-chinese-ink-light px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-lg text-chinese-gold">{cat.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">{cat._count.posts} 个帖子</span>
                  </div>
                </div>
                <div className="divide-y divide-chinese-gold/10">
                  {cat.posts.length > 0 ? (
                    cat.posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/forum/${post.id}`}
                        className="flex items-center justify-between px-6 py-3.5 hover:bg-chinese-ivory-dark transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm text-chinese-ink truncate">{post.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {post.user.name} · {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 ml-4">
                          <span>{tr('forum.replies', { count: post._count.comments })}</span>
                          <span>{tr('forum.views', { count: post.viewCount })}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-sm text-gray-400">
                      {tr('forum.empty')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/forum/new" className="chinese-btn-primary">{tr('forum.newPost')}</Link>
        </div>
      </div>
    </div>
  )
}
