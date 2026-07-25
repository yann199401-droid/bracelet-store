'use client'

import { useState } from 'react'

export default function ProductImages({ images }) {
  const parsedImages = typeof images === 'string' ? JSON.parse(images || '[]') : images
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (parsedImages.length === 0) {
    return (
      <div className="aspect-square bg-chinese-ivory-dark flex items-center justify-center">
        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-chinese-ivory-dark overflow-hidden border border-chinese-gold/20">
        <img
          src={parsedImages[selectedIndex]}
          alt="产品图片"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {parsedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {parsedImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-16 h-16 flex-shrink-0 border-2 transition-colors overflow-hidden
                ${index === selectedIndex ? 'border-chinese-gold' : 'border-transparent hover:border-chinese-gold/50'}`}
            >
              <img
                src={img}
                alt={`产品图 ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
