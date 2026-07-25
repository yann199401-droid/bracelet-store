'use client'

import { useState, useRef } from 'react'

export default function MediaUploader({ files, onChange, maxFiles = 6 }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleSelect = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files || [])
    if (files.length + selected.length > maxFiles) {
      alert(`最多上传 ${maxFiles} 个文件`)
      return
    }

    setUploading(true)
    for (const file of selected) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.url) {
          onChange([...files, { url: data.url, type: data.type }])
        } else {
          alert(data.error || '上传失败')
        }
      } catch {
        alert('上传失败')
      }
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {files.map((f, i) => (
          <div key={i} className="relative group w-20 h-20 border border-chinese-gold/20 overflow-hidden bg-white">
            {f.type === 'VIDEO' ? (
              <video src={f.url} className="w-full h-full object-cover" muted />
            ) : (
              <img src={f.url} alt="上传图片" className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => removeFile(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 text-white text-xs
                         flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            {f.type === 'VIDEO' && (
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1">视频</span>
            )}
          </div>
        ))}
        {files.length < maxFiles && (
          <button
            type="button"
            onClick={handleSelect}
            disabled={uploading}
            className="w-20 h-20 border-2 border-dashed border-chinese-gold/30 flex items-center justify-center
                       hover:border-chinese-gold/60 hover:bg-chinese-gold/5 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-xs text-gray-400">上传中...</span>
            ) : (
              <div className="text-center">
                <svg className="w-6 h-6 text-chinese-gold/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] text-gray-400">上传</span>
              </div>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="text-[10px] text-gray-400">支持 JPG/PNG/GIF/WebP 图片和 MP4/WebM 视频，单张不超过 15MB</p>
    </div>
  )
}
