'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/I18nContext'

export default function ForumCommentForm({ postId }) {
  const { t } = useI18n()
  const [content, setContent] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/forum/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content, name }),
      })
      if (res.ok) {
        setStatus('success')
        setContent('')
        setName('')
        window.location.reload()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-chinese-ivory-dark p-6">
      <h3 className="font-serif text-lg text-chinese-ink mb-4">{t('forum.reply')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('forumNew.name')}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="chinese-input" placeholder={t('forumNew.namePlaceholder')} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('forum.replyContent')}</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={3} className="chinese-input resize-none" placeholder={t('forum.replyPlaceholder')} />
        </div>
        <button type="submit" disabled={status === 'sending'} className="chinese-btn-gold">
          {status === 'sending' ? t('forumNew.submitting') : t('forum.submitReply')}
        </button>
        {status === 'success' && <p className="text-green-600 text-sm">{t('forum.success')}</p>}
        {status === 'error' && <p className="text-red-600 text-sm">{t('forum.submitError')}</p>}
      </form>
    </div>
  )
}
