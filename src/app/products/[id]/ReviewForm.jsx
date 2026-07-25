'use client'

import { useState } from 'react'
import StarRating from '@/components/ui/StarRating'
import MediaUploader from '@/components/ui/MediaUploader'

export default function ReviewForm({ productId }) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [name, setName] = useState('')
  const [media, setMedia] = useState([])
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('请选择评分')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, content, name, media }),
      })
      if (res.ok) {
        setStatus('success')
        setRating(0)
        setContent('')
        setName('')
        setMedia([])
      } else {
        const data = await res.json()
        setStatus(data.error || 'error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 p-6 text-center">
        <p className="text-green-700 font-medium">感谢您的评价！</p>
        <p className="text-sm text-green-600 mt-1">您的评价和晒图将在审核后显示。</p>
      </div>
    )
  }

  return (
    <div className="bg-chinese-ivory-dark p-6">
      <h3 className="font-serif text-lg text-chinese-ink mb-4">发表评价 + 晒图</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">评分</label>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">昵称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="chinese-input"
            placeholder="您的昵称"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">评价内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
            className="chinese-input resize-none"
            placeholder="分享您对这款产品的使用感受..."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">上传图片或视频（可选）</label>
          <MediaUploader files={media} onChange={setMedia} maxFiles={6} />
        </div>
        <button type="submit" disabled={status === 'sending'} className="chinese-btn-gold">
          {status === 'sending' ? '提交中...' : '提交评价'}
        </button>
        {status === 'error' && <p className="text-red-600 text-sm">提交失败，请稍后重试。</p>}
      </form>
    </div>
  )
}
