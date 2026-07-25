'use client'

import { useState, useMemo } from 'react'
import MediaViewer from '@/components/ui/MediaViewer'

export default function CustomerPhotos({ reviews }) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)

  const allMedia = useMemo(() => {
    const items = []
    reviews.forEach((review) => {
      const media = JSON.parse(review.media || '[]')
      media.forEach((item) => {
        items.push({ ...item, userName: review.user.name })
      })
    })
    return items
  }, [reviews])

  if (allMedia.length === 0) return null

  const openViewer = (index) => {
    setViewerIndex(index)
    setViewerOpen(true)
  }

  return (
    <div className="mt-12">
      <h2 className="font-serif text-2xl text-chinese-ink mb-2">客户晒图</h2>
      <p className="text-sm text-gray-400 mb-6">共 {allMedia.length} 张客户实拍</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {allMedia.map((item, i) => (
          <button
            key={i}
            onClick={() => openViewer(i)}
            className="aspect-square border border-chinese-gold/10 overflow-hidden bg-gray-50
                       hover:border-chinese-gold/50 transition-colors relative group"
          >
            {item.type === 'VIDEO' ? (
              <>
                <video src={item.url} className="w-full h-full object-cover" muted />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30
                               opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </>
            ) : (
              <img src={item.url} alt="客户晒图" className="w-full h-full object-cover" loading="lazy" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity p-1">
              <span className="text-[10px] text-white truncate block">{item.userName}</span>
            </div>
          </button>
        ))}
      </div>
      {viewerOpen && (
        <MediaViewer media={allMedia} index={viewerIndex} onClose={() => setViewerOpen(false)} />
      )}
    </div>
  )
}
