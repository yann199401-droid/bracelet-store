'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SiteGuard({ children }) {
  const [maintenance, setMaintenance] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/maintenance')
      .then(r => r.json())
      .then(data => setMaintenance(data))
      .catch(() => setMaintenance({ enabled: false }))
  }, [])

  // Allow during loading, admin routes always pass
  if (!maintenance) return <>{children}</>

  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/auth')
  if (!maintenance.enabled || isAdminPath) return <>{children}</>

  return (
    <div className="fixed inset-0 z-[9999] bg-chinese-ink flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-6">🧘</div>
        <h1 className="text-3xl font-serif text-chinese-gold mb-4">正在更新中</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          {maintenance.message || '网站正在更新中，请稍后再来访问。'}
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-chinese-gold/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-chinese-gold/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-chinese-gold/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
