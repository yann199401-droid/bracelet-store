'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminInquiryDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [inquiry, setInquiry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reply, setReply] = useState('')
  const [message, setMessage] = useState('')

  const load = () => {
    setLoading(true)
    fetch(`/api/admin/inquiries/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('询盘不存在')
        return r.json()
      })
      .then(data => {
        setInquiry(data)
        setReply(data.reply || '')
        // Auto-mark as read on view
        if (!data.isRead) {
          fetch(`/api/admin/inquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRead: true }),
          }).catch(() => {})
        }
      })
      .catch(() => setInquiry(null))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const handleReply = async () => {
    if (!reply.trim()) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: reply.trim() }),
      })
      if (res.ok) {
        const updated = await res.json()
        setInquiry(updated)
        setReply(updated.reply || '')
        setMessage('✅ 回复已发送')
      } else {
        const err = await res.json()
        setMessage(`❌ ${err.error || '发送失败'}`)
      }
    } catch {
      setMessage('❌ 网络错误')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('确定删除此询盘吗？')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/inquiries')
      } else {
        setMessage('❌ 删除失败')
      }
    } catch {
      setMessage('❌ 网络错误')
    }
    setDeleting(false)
  }

  if (loading) {
    return <p className="text-gray-500">加载中...</p>
  }

  if (!inquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">询盘不存在</p>
        <Link href="/admin/inquiries" className="text-chinese-red hover:underline text-sm">
          ← 返回询盘列表
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inquiries" className="text-gray-500 hover:text-gray-800 text-sm mb-4 inline-block">
        ← 返回询盘列表
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">询盘详情</h1>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            inquiry.isRead ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'
          }`}>
            {inquiry.isRead ? '已读' : '未读'}
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
          >
            {deleting ? '删除中...' : '删除'}
          </button>
        </div>
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-lg shadow p-5 mb-4">
        <h2 className="font-bold text-gray-700 mb-3">客户信息</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">姓名：</span>{inquiry.name}</div>
          <div><span className="text-gray-400">邮箱：</span>{inquiry.email}</div>
          <div><span className="text-gray-400">日期：</span>{new Date(inquiry.createdAt).toLocaleString('zh-CN')}</div>
        </div>
      </div>

      {/* Original message */}
      <div className="bg-white rounded-lg shadow p-5 mb-4">
        <h2 className="font-bold text-gray-700 mb-3">询盘内容</h2>
        <div className="mb-2">
          <span className="text-xs text-gray-400">主题：</span>
          <span className="text-sm font-medium">{inquiry.subject}</span>
        </div>
        <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {inquiry.message}
        </div>
      </div>

      {/* Reply */}
      <div className="bg-white rounded-lg shadow p-5 mb-4">
        <h2 className="font-bold text-gray-700 mb-3">
          {inquiry.reply ? '回复记录' : '回复客户'}
        </h2>

        {inquiry.repliedAt && (
          <p className="text-xs text-gray-400 mb-3">
            上次回复时间：{new Date(inquiry.repliedAt).toLocaleString('zh-CN')}
          </p>
        )}

        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={5}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none
            focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold"
          placeholder="输入回复内容...回复将通过邮件发送给客户"
        />

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleReply}
            disabled={saving || !reply.trim()}
            className="bg-chinese-red text-white px-5 py-2 rounded text-sm
              hover:bg-red-800 disabled:opacity-50 transition-colors"
          >
            {saving ? '发送中...' : inquiry.reply ? '更新回复' : '发送回复'}
          </button>
          {message && (
            <span className="text-sm">{message}</span>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-2">
          ⚠️ 回复将通过邮件（{inquiry.email}）发送给客户
        </p>
      </div>
    </div>
  )
}
