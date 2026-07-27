'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/I18nContext'

export default function NewPostPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', content: '', categoryId: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/forum/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCategories(data)
          setForm((f) => ({ ...f, categoryId: String(data[0].id) }))
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content || !form.categoryId) {
      setError('请填写所有必填字段')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/forum/${data.id}`)
      } else {
        setError(data.error || '发帖失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    }
    setLoading(false)
  }

  return (
    <div className="cloud-bg min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="chinese-card p-8">
          <h1 className="text-2xl font-serif text-chinese-ink mb-6">{t('forumNew.title')}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('forumNew.category')}</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                className="chinese-input"
              >
                <option value="">选择板块</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('forumNew.name')}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="chinese-input"
                placeholder={t('forumNew.namePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('forumNew.subject')}</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="chinese-input"
                placeholder={t('forumNew.subjectPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('forumNew.content')}</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={8}
                className="chinese-input resize-none"
                placeholder={t('forumNew.contentPlaceholder')}
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="chinese-btn-primary">
              {loading ? t('forumNew.submitting') : t('forumNew.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
