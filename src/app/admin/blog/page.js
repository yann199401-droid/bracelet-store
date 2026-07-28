'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminBlog() {
  const router = useRouter()
  const [data, setData] = useState({ posts: [], total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(null)

  const loadPosts = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, search })
    fetch(`/api/admin/blog?${params}`)
      .then(r => r.json())
      .then(data => { if (data.posts) setData(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(loadPosts, [page, search])

  const handleDelete = (post) => {
    if (!window.confirm(`确定删除「${post.title}」吗？`)) return
    setDeleting(post.id)
    fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
      .then(res => { if (res.ok) loadPosts() })
      .catch(() => alert('删除失败'))
      .finally(() => setDeleting(null))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">博客管理</h1>
        <Link href="/admin/blog/new" className="bg-chinese-red text-white px-4 py-2 rounded text-sm hover:bg-red-800 transition-colors">
          + 写文章
        </Link>
      </div>

      <input type="text" placeholder="搜索文章标题..."
        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
        className="w-full max-w-sm border rounded px-3 py-2 text-sm mb-4 focus:outline-none
          focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold" />

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : data.posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          {search ? '未找到匹配的文章' : '暂无文章，点击上方按钮写第一篇'}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">标题</th>
                  <th className="px-4 py-3 font-medium text-gray-600">作者</th>
                  <th className="px-4 py-3 font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 font-medium text-gray-600">标签</th>
                  <th className="px-4 py-3 font-medium text-gray-600">日期</th>
                  <th className="px-4 py-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.posts.map(post => {
                  const tags = (() => { try { return JSON.parse(post.tags) } catch { return [] } })()
                  return (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                      <td className="px-4 py-3 text-gray-500">{post.author}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          post.published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {post.published ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                          {tags.length > 3 && <span className="text-xs text-gray-400">+{tags.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium">编辑</button>
                          <button onClick={() => handleDelete(post)} disabled={deleting === post.id}
                            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50">
                            {deleting === post.id ? '...' : '删除'}
                          </button>
                          {post.published && (
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                              className="text-chinese-gold hover:underline text-xs">查看</a>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">← 上一页</button>
              <span className="text-sm text-gray-500">第 {page} / {data.totalPages} 页（共 {data.total} 篇）</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">下一页 →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
