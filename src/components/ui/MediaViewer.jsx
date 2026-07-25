'use client'

import { useState, useEffect, useCallback } from 'react'

export default function MediaViewer({ media, index, onClose }) {
  const [current, setCurrent] = useState(index)

  const goNext = useCallback(() => {
    setCurrent((i) => (i + 1) % media.length)
  }, [media.length])

  const goPrev = useCallback(() => {
    setCurrent((i) => (i - 1 + media.length) % media.length)
  }, [media.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, goNext, goPrev])

  const item = media[current]

  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 text-white/80 hover:text-white z-10"
        aria-label="关闭"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="max-w-4xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
        {item?.type === 'VIDEO' ? (
          <video src={item.url} controls className="max-h-[85vh] max-w-full" autoPlay />
        ) : (
          <img src={item.url} alt="晒图" className="max-h-[85vh] max-w-full object-contain" />
        )}
      </div>

      {media.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 text-white/60 hover:text-white"
            aria-label="上一张"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-white/60 hover:text-white"
            aria-label="下一张"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {current + 1} / {media.length}
          </div>
        </>
      )}
    </div>
  )
}
