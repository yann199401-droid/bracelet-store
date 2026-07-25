'use client'

import Link from 'next/link'

export default function ErrorSection({ error, reset }) {
  return (
    <div className="cloud-bg min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 border-2 border-chinese-red/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-chinese-red text-3xl font-serif">!</span>
        </div>
        <h2 className="text-xl font-serif text-chinese-ink mb-2">出了点问题</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md">
          {error?.message || '页面加载时发生错误，请稍后重试。'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="chinese-btn-primary">
            重试
          </button>
          <Link href="/" className="text-sm text-chinese-gold hover:text-chinese-gold-light transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
