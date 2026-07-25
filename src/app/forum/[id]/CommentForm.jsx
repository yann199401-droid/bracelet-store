'use client'

import { useState } from 'react'

export default function ForumCommentForm({ postId }) {
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
      <h3 className="font-serif text-lg text-chinese-ink mb-4">发表回复</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">昵称</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="chinese-input" placeholder="您的昵称" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">回复内容</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={3} className="chinese-input resize-none" placeholder="写下您的想法..." />
        </div>
        <button type="submit" disabled={status === 'sending'} className="chinese-btn-gold">
          {status === 'sending' ? '提交中...' : '发表回复'}
        </button>
        {status === 'success' && <p className="text-green-600 text-sm">回复成功！</p>}
        {status === 'error' && <p className="text-red-600 text-sm">提交失败，请稍后重试。</p>}
      </form>
    </div>
  )
}
