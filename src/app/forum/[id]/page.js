import prisma from '@/lib/prisma'
import ForumCommentForm from './CommentForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ForumPostPage({ params }) {
  const { id } = await params
  const post = await prisma.forumPost.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      category: true,
      comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
    },
  })

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif mb-4">帖子未找到</h1>
        <Link href="/forum" className="chinese-btn-primary">返回论坛</Link>
      </div>
    )
  }

  await prisma.forumPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  return (
    <div className="cloud-bg min-h-screen">
      <div className="bg-white border-b border-chinese-gold/10">
        <div className="max-w-4xl mx-auto px-4 py-3 text-xs text-gray-400">
          <Link href="/" className="hover:text-chinese-gold">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/forum" className="hover:text-chinese-gold">论坛</Link>
          <span className="mx-2">/</span>
          <span className="text-chinese-ink">{post.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="chinese-card p-8 mb-8">
          <div className="mb-4">
            <span className="text-xs text-chinese-gold">{post.category.name}</span>
            <h1 className="text-2xl font-serif text-chinese-ink mt-1">{post.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span>{post.user.name}</span>
              <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
              <span>{post.viewCount} 阅读</span>
            </div>
          </div>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line">{post.content}</div>
        </div>

        <div className="mb-8">
          <h2 className="font-serif text-xl text-chinese-ink mb-4">回复 ({post.comments.length})</h2>
          {post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map((c) => (
                <div key={c.id} className="bg-white p-4 border border-chinese-gold/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-chinese-ink">{c.user.name}</span>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">暂无回复，来发表第一条回复吧！</p>
          )}
        </div>

        <ForumCommentForm postId={post.id} />
      </div>
    </div>
  )
}
