'use client'

import { useState, useRef } from 'react'

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '上传失败')
      }

      onChange([...images, data.url])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, index) => (
          <div key={index} className="relative group w-24 h-24 border rounded overflow-hidden bg-gray-50">
            <img src={url} alt={`图片 ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full text-xs
                flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center
          cursor-pointer hover:border-chinese-gold transition-colors text-gray-400 hover:text-chinese-gold">
          {uploading ? (
            <span className="text-xs">上传中...</span>
          ) : (
            <>
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs">添加图片</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">支持 JPG/PNG/GIF/WebP，单张不超过 10MB</p>
    </div>
  )
}
