'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import BlogForm from '@/components/admin/BlogForm'

export default function EditBlogPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('文章不存在')
        return r.json()
      })
      .then(setPost)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray-500">加载中...</p>

  if (error) return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">{error}</p>
      <Link href="/admin/blog" className="text-chinese-red hover:underline text-sm">← 返回文章列表</Link>
    </div>
  )

  return (
    <div>
      <Link href="/admin/blog" className="text-gray-500 hover:text-gray-800 text-sm mb-4 inline-block">← 返回文章列表</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">编辑文章</h1>
      <BlogForm initialData={post} />
    </div>
  )
}
