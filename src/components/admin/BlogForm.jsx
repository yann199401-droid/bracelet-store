'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BlogForm({ initialData }) {
  const isEdit = !!initialData
  const router = useRouter()

  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    coverImage: initialData?.coverImage || '',
    author: initialData?.author || 'Admin',
    tags: (() => {
      if (!initialData?.tags) return ''
      try { return JSON.parse(initialData.tags).join(', ') } catch { return '' }
    })(),
    published: initialData?.published || false,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      const body = {
        ...form,
        slug: form.slug || undefined,
        tags,
      }

      const url = isEdit ? `/api/admin/blog/${initialData.id}` : '/api/admin/blog'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '保存失败')

      setSuccess(isEdit ? '✅ 文章已保存' : '✅ 文章已创建')

      if (!isEdit) {
        setTimeout(() => router.push(`/admin/blog/${data.id}/edit`), 1000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const fieldClass = 'mb-4'

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">{success}</div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">基本信息</h2>

        <div className={fieldClass}>
          <label className={labelClass}>标题 *</label>
          <input type="text" name="title" value={form.title} onChange={(e) => {
            handleChange(e)
            if (!isEdit && !form.slugManuallyEdited) {
              const slug = e.target.value.toLowerCase()
                .replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
                .replace(/^-+|-+$/g, '').replace(/-+/g, '-')
              setForm(prev => ({ ...prev, title: e.target.value, slug }))
            }
          }} required className={inputClass} placeholder="文章标题" />
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Slug</label>
          <input type="text" name="slug" value={form.slug} onChange={(e) => {
            setForm(prev => ({ ...prev, slug: e.target.value, slugManuallyEdited: true }))
          }} className={inputClass} placeholder="自动从标题生成" />
          <p className="text-xs text-gray-400 mt-1">用于 URL 地址，仅支持英文和连字符</p>
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>摘要</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
            className={inputClass} placeholder="文章简短摘要（可选，显示在列表页）" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>作者</label>
            <input type="text" name="author" value={form.author} onChange={handleChange}
              className={inputClass} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>标签（逗号分隔）</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange}
              className={inputClass} placeholder="如：木串, 保养, 知识" />
          </div>
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>封面图片 URL</label>
          <input type="text" name="coverImage" value={form.coverImage} onChange={handleChange}
            className={inputClass} placeholder="/uploads/products/xxx.jpg 或外部链接" />
          {form.coverImage && (
            <img src={form.coverImage} alt="封面预览" className="mt-2 h-32 object-cover rounded border" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700">文章内容（Markdown）</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="published" checked={form.published}
              onChange={handleChange} className="w-4 h-4 accent-chinese-red" />
            <span className="text-sm text-gray-600">发布</span>
          </label>
        </div>

        <textarea name="content" value={form.content} onChange={handleChange} rows={20}
          className="w-full border rounded px-4 py-3 text-sm font-mono focus:outline-none
            focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold leading-relaxed"
          placeholder="使用 Markdown 格式书写文章...

## 二级标题
**粗体** *斜体*
- 列表项
- 列表项

```代码块```"
        />

        <p className="text-xs text-gray-400 mt-2">
          支持 Markdown 语法：标题、粗体、列表、链接、图片、代码块等
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="bg-chinese-red text-white px-6 py-2.5 rounded text-sm hover:bg-red-800
            disabled:opacity-50 transition-colors font-medium">
          {saving ? '保存中...' : isEdit ? '更新文章' : '创建文章'}
        </button>
        <button type="button" onClick={() => router.push('/admin/blog')}
          className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded text-sm hover:bg-gray-50 transition-colors">
          取消
        </button>
        {initialData?.published && (
          <a href={`/blog/${initialData.slug}`} target="_blank" rel="noopener noreferrer"
            className="text-chinese-red hover:underline text-sm ml-auto">
            查看前台 →
          </a>
        )}
      </div>
    </form>
  )
}
