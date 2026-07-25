'use client'

import { useState } from 'react'
import MediaViewer from '@/components/ui/MediaViewer'

export default function ReviewMedia({ media }) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)

  const openViewer = (index) => {
    setViewerIndex(index)
    setViewerOpen(true)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {media.map((item, i) => (
          <button
            key={i}
            onClick={() => openViewer(i)}
            className="w-16 h-16 border border-chinese-gold/10 overflow-hidden bg-gray-50
                       hover:border-chinese-gold/50 transition-colors relative group"
          >
            {item.type === 'VIDEO' ? (
              <>
                <video src={item.url} className="w-full h-full object-cover" muted />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </>
            ) : (
              <img src={item.url} alt="评价图片" className="w-full h-full object-cover" loading="lazy" />
            )}
          </button>
        ))}
      </div>
      {viewerOpen && (
        <MediaViewer media={media} index={viewerIndex} onClose={() => setViewerOpen(false)} />
      )}
    </>
  )
}
