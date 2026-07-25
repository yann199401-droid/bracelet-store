'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/lib/ToastContext'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, loading, logout } = useAuth()
  const toast = useToast()
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/products', label: '所有产品' },
    { href: '/promotions', label: '促销活动' },
    { href: '/about', label: '关于我们' },
    { href: '/forum', label: '论坛' },
  ]

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="bg-chinese-ink sticky top-0 z-50 shadow-chinese">
      {/* Top Bar */}
      <div className="bg-chinese-red text-white text-center py-1 text-xs tracking-wider">
        满 $50 全球免邮 · Free Shipping Worldwide on Orders Over $50
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border-2 border-chinese-gold flex items-center justify-center
                         group-hover:bg-chinese-gold/10 transition-colors">
              <span className="text-chinese-gold font-serif text-xl font-bold">禅</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-chinese-gold font-serif text-lg leading-tight">禅意手作</h1>
              <p className="text-chinese-slate-light text-[10px] tracking-widest uppercase">Zen Craft Bracelets</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm tracking-wider transition-colors duration-200 relative
                  ${isActive(item.href)
                    ? 'text-chinese-gold'
                    : 'text-gray-300 hover:text-chinese-gold-light'
                  }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-chinese-gold" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-300 hover:text-chinese-gold transition-colors"
              aria-label="搜索"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-chinese-gold transition-colors"
              aria-label="购物车"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-chinese-red text-white text-[10px]
                               font-medium flex items-center justify-center rounded-full min-w-[18px] h-[18px]">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Auth */}
            {!loading && (
              user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 text-gray-300 hover:text-chinese-gold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs text-chinese-gold max-w-[80px] truncate">{user.name}</span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-chinese-gold/20 shadow-lg z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); toast.success('已退出登录') }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-chinese-ivory transition-colors"
                        >
                          退出登录
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:block p-2 text-gray-300 hover:text-chinese-gold transition-colors"
                  aria-label="登录"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-chinese-gold transition-colors"
              aria-label="菜单"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fadeIn">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索产品..."
                className="chinese-input flex-1 bg-chinese-ink-light border-chinese-gold/30 text-white
                          placeholder:text-gray-500"
              />
              <button type="submit" className="chinese-btn-primary whitespace-nowrap">搜索</button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-chinese-gold/20 bg-chinese-ink-light">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-sm tracking-wider rounded transition-colors
                  ${isActive(item.href)
                    ? 'text-chinese-gold bg-chinese-gold/10'
                    : 'text-gray-300 hover:bg-chinese-gold/5 hover:text-chinese-gold-light'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="block px-4 py-3 text-sm tracking-wider text-chinese-gold">
                  {user.name}
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); toast.success('已退出登录') }}
                  className="block w-full text-left px-4 py-3 text-sm tracking-wider text-gray-300 hover:bg-chinese-gold/5
                             hover:text-chinese-gold-light rounded transition-colors"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm tracking-wider text-gray-300 hover:bg-chinese-gold/5
                           hover:text-chinese-gold-light rounded transition-colors"
              >
                登录 / 注册
              </Link>
            )}
          </nav>
        </div>
      )}
      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
