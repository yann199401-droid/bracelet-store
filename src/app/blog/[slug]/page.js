import prisma from '@/lib/prisma'
import Link from 'next/link'
import { renderMarkdown } from '@/lib/markdown'
import { getLocale, t } from '@/lib/i18n-server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const locale = getLocale()
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })
  if (!post) return { title: locale === 'en' ? 'Post Not Found' : '文章未找到' }
  return {
    title: `${post.title} — 禅意手作`,
    description: post.excerpt || post.title,
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const locale = getLocale()
  const isEn = locale === 'en'

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif text-gray-600 mb-4">{isEn ? 'Post Not Found' : '文章未找到'}</h1>
        <Link href="/blog" className="text-chinese-red hover:underline text-sm">← {isEn ? 'Back to Blog' : '返回博客'}</Link>
      </div>
    )
  }

  let tags = []
  try { tags = JSON.parse(post.tags) } catch {}

  const contentHtml = renderMarkdown(post.content)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-gray-400 hover:text-chinese-red text-sm mb-6 inline-block transition-colors">
        ← {isEn ? 'Back to Blog' : '返回博客'}
      </Link>

      <article>
        {/* Header */}
        <header className="mb-8">
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title}
              className="w-full aspect-[2/1] object-cover rounded-lg mb-6" />
          )}
          <h1 className="text-3xl md:text-4xl font-serif text-chinese-ink mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span>{post.author}</span>
            <span>·</span>
            <time>{new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'zh-CN')}</time>
          </div>

          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {tags.map((tag, i) => (
                <span key={i} className="text-xs bg-chinese-ivory-dark text-gray-500 px-2.5 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.excerpt && (
            <p className="text-gray-500 italic border-l-2 border-chinese-gold pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div
          className="prose prose-sm max-w-none
            prose-headings:font-serif prose-headings:text-chinese-ink
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-chinese-red prose-a:no-underline hover:prose-a:underline
            prose-strong:text-chinese-ink
            prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
            prose-img:rounded-lg prose-img:my-6
            prose-blockquote:border-l-chinese-gold prose-blockquote:text-gray-500
            prose-hr:my-8
            leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  )
}
