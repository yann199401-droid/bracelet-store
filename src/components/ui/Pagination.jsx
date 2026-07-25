'use client'

import Link from 'next/link'

export default function Pagination({ currentPage, totalPages, basePath }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center border border-chinese-gold/30 text-chinese-ink
                     hover:border-chinese-gold hover:text-chinese-gold transition-all text-sm"
        >
          ‹
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`w-10 h-10 flex items-center justify-center text-sm transition-all
            ${page === currentPage
              ? 'bg-chinese-red text-white border border-chinese-red'
              : 'border border-chinese-gold/30 text-chinese-ink hover:border-chinese-gold hover:text-chinese-gold'
            }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center border border-chinese-gold/30 text-chinese-ink
                     hover:border-chinese-gold hover:text-chinese-gold transition-all text-sm"
        >
          ›
        </Link>
      )}
    </div>
  )
}
