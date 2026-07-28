'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminInquiries() {
  const router = useRouter()
  const [data, setData] = useState({ inquiries: [], total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [readFilter, setReadFilter] = useState('') // '' = all, 'false' = unread, 'true' = read

  const loadInquiries = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, search })
    if (readFilter) params.set('isRead', readFilter)

    fetch(`/api/admin/inquiries?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.inquiries) setData(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(loadInquiries, [page, search, readFilter])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">询盘管理</h1>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="搜索名称、邮箱或主题..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 max-w-sm border rounded px-3 py-2 text-sm focus:outline-none
            focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold"
        />
        <div className="flex gap-1">
          {[
            { value: '', label: '全部' },
            { value: 'false', label: '未读' },
            { value: 'true', label: '已读' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { setReadFilter(opt.value); setPage(1) }}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                readFilter === opt.value
                  ? 'bg-chinese-red text-white'
                  : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
              {opt.value === 'false' && data.total !== undefined && readFilter === '' && (
                <span className="ml-1 text-xs opacity-70">
                  ({data.inquiries.filter(i => !i.isRead).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : data.inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          {search || readFilter ? '未找到匹配的询盘' : '暂无询盘'}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="px-4 py-3 font-medium text-gray-600 w-12">状态</th>
                  <th className="px-4 py-3 font-medium text-gray-600">客户</th>
                  <th className="px-4 py-3 font-medium text-gray-600">主题</th>
                  <th className="px-4 py-3 font-medium text-gray-600">日期</th>
                  <th className="px-4 py-3 font-medium text-gray-600">回复</th>
                  <th className="px-4 py-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.inquiries.map(inquiry => (
                  <tr key={inquiry.id} className={`border-b hover:bg-gray-50 ${!inquiry.isRead ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      {inquiry.isRead ? (
                        <span className="text-gray-300 text-xs">✓ 已读</span>
                      ) : (
                        <span className="inline-block w-2 h-2 bg-chinese-red rounded-full" title="未读" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-xs text-gray-400">{inquiry.email}</p>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      <span className={!inquiry.isRead ? 'font-medium' : ''}>
                        {inquiry.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-4 py-3">
                      {inquiry.reply ? (
                        <span className="text-green-600 text-xs">已回复</span>
                      ) : (
                        <span className="text-gray-300 text-xs">未回复</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => router.push(`/admin/inquiries/${inquiry.id}`)}
                        className="text-chinese-red hover:text-red-700 text-xs font-medium"
                      >
                        查看 →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                ← 上一页
              </button>
              <span className="text-sm text-gray-500">
                第 {page} / {data.totalPages} 页（共 {data.total} 条）
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                下一页 →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
