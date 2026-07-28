'use client'

import { useState, useEffect, useRef } from 'react'

export default function AdminMedia() {
  const [data, setData] = useState({ files: [], total: 0, totalPages: 0, folders: [] })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [folder, setFolder] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  const loadFiles = () => {
    setLoading(true)
    const params = new URLSearchParams({ page })
    if (folder) params.set('folder', folder)
    if (search) params.set('search', search)

    fetch(`/api/admin/media?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.files) setData(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(loadFiles, [page, folder])

  useEffect(() => {
    setPage(1)
  }, [folder, search])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setMessage('✅ 上传成功')
        loadFiles()
      } else {
        const err = await res.json()
        setMessage(`❌ ${err.error || '上传失败'}`)
      }
    } catch {
      setMessage('❌ 网络错误')
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const toggleSelect = (url) => {
    const next = new Set(selected)
    if (next.has(url)) next.delete(url)
    else next.add(url)
    setSelected(next)
  }

  const handleDelete = async () => {
    if (selected.size === 0) return
    if (!window.confirm(`确定删除选中的 ${selected.size} 个文件吗？`)) return

    setDeleting(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [...selected] }),
      })

      if (res.ok) {
        setMessage(`✅ 已删除 ${selected.size} 个文件`)
        setSelected(new Set())
        loadFiles()
      } else {
        const err = await res.json()
        setMessage(`❌ ${err.error || '删除失败'}`)
      }
    } catch {
      setMessage('❌ 网络错误')
    }
    setDeleting(false)
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setMessage('📋 已复制 URL')
      setTimeout(() => setMessage(''), 2000)
    })
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  const filterDelay = useRef(null)
  const handleSearch = (val) => {
    if (filterDelay.current) clearTimeout(filterDelay.current)
    filterDelay.current = setTimeout(() => setSearch(val), 300)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">图片管理</h1>
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload}
            disabled={uploading} className="hidden" id="media-upload" />
          <label htmlFor="media-upload"
            className="bg-chinese-red text-white px-4 py-2 rounded text-sm hover:bg-red-800
              transition-colors cursor-pointer inline-flex items-center">
            {uploading ? '上传中...' : '+ 上传图片'}
          </label>
          {selected.size > 0 && (
            <button onClick={handleDelete} disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700
                disabled:opacity-50 transition-colors">
              {deleting ? '删除中...' : `删除 ${selected.size} 个`}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-4 p-2 bg-gray-50 border rounded text-sm text-gray-700 text-center">
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <input type="text" placeholder="搜索文件名..."
          onChange={e => handleSearch(e.target.value)}
          className="flex-1 max-w-xs border rounded px-3 py-2 text-sm focus:outline-none
            focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold" />
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setFolder('')}
            className={`px-3 py-1.5 text-xs rounded ${!folder ? 'bg-chinese-red text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
            全部
          </button>
          {data.folders.map(f => (
            <button key={f} onClick={() => setFolder(f === folder ? '' : f)}
              className={`px-3 py-1.5 text-xs rounded ${folder === f ? 'bg-chinese-red text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {f === '/' ? '根目录' : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : data.files.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          {search || folder ? '未找到匹配的图片' : '暂无图片，点击上方按钮上传'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {data.files.map(file => {
              const isSelected = selected.has(file.url)
              const isVideo = file.ext === '.mp4' || file.ext === '.webm'

              return (
                <div key={file.url}
                  onClick={() => toggleSelect(file.url)}
                  className={`relative aspect-square bg-white rounded-lg border-2 overflow-hidden cursor-pointer
                    group transition-all ${isSelected ? 'border-chinese-red ring-2 ring-chinese-red/30' : 'border-gray-200 hover:border-chinese-gold/50'}`}
                >
                  {isVideo ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-2xl">
                      ▶
                    </div>
                  ) : (
                    <img src={file.url} alt={file.name}
                      className="w-full h-full object-cover" loading="lazy" />
                  )}

                  {/* Select indicator */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-chinese-red rounded-full
                      flex items-center justify-center text-white text-xs font-bold">✓</div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col gap-1">
                    <button onClick={(e) => { e.stopPropagation(); copyUrl(file.url) }}
                      className="text-[10px] bg-white/90 text-gray-800 rounded px-1.5 py-0.5 hover:bg-white
                        truncate text-left">
                      📋 复制 URL
                    </button>
                  </div>

                  {/* File info */}
                  <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/50 text-[9px] text-white truncate
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {formatSize(file.size)}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                ← 上一页
              </button>
              <span className="text-sm text-gray-500">
                第 {page} / {data.totalPages} 页（共 {data.total} 个文件）
              </span>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                下一页 →
              </button>
            </div>
          )}

          {/* Selection bar */}
          {selected.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3
              rounded-full shadow-lg flex items-center gap-4 text-sm z-50">
              <span>已选 {selected.size} 个文件</span>
              <button onClick={() => setSelected(new Set())} className="text-gray-400 hover:text-white">
                取消
              </button>
              <button onClick={handleDelete} className="text-red-400 hover:text-red-300 font-medium">
                删除
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
