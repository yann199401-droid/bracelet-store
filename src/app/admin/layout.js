'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.role === 'ADMIN') {
          setUser(data)
        } else {
          router.push('/auth/login')
        }
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-chinese-ink flex items-center justify-center">
        <div className="text-chinese-gold text-lg">加载中...</div>
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { href: '/admin', label: '概览', icon: '📊' },
    { href: '/admin/orders', label: '订单管理', icon: '📦' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-chinese-ink text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-chinese-gold font-serif text-lg">管理后台</h1>
          <p className="text-gray-400 text-xs mt-1">禅意手作</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors
                ${pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'bg-chinese-red/20 text-chinese-gold'
                  : 'text-gray-300 hover:bg-gray-800'}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <p>{user.name}</p>
          <Link href="/" className="text-chinese-gold hover:underline">← 返回前台</Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
