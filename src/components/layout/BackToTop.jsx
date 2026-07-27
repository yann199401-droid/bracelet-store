'use client'

import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-6 bottom-20 z-50 w-10 h-10 bg-chinese-ink border border-chinese-gold/40
                 flex items-center justify-center hover:bg-chinese-gold/10 hover:border-chinese-gold
                 transition-all duration-200 shadow-lg cursor-pointer"
      aria-label="返回顶部"
    >
      <svg className="w-5 h-5 text-chinese-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}
