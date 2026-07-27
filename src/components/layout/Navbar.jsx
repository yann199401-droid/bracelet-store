'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/lib/ToastContext'
import { useI18n } from '@/lib/I18nContext'
import { useSidebar } from '@/lib/SidebarContext'
import CartDrawer from '@/components/cart/CartDrawer'

const navIcon = (href) => {
  const icons = {
    '/': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    '/products': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    '/promotions': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    '/about': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    '/forum': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  }
  return icons[href] || null
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, loading, logout } = useAuth()
  const toast = useToast()
  const pathname = usePathname()
  const { t, locale, toggleLocale } = useI18n()
  const { isOpen, toggle, setOpen } = useSidebar()

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/promotions', label: t('nav.promotions') },
    { href: '/about', label: t('nav.about') },
    { href: '/forum', label: t('nav.forum') },
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

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    toast.success(t('auth.logoutSuccess'))
  }

  return (
    <>
      {/* ─── Top Bar (fixed) ─── */}
      <header
        className={`fixed top-0 z-50 bg-chinese-ink shadow-chinese transition-all duration-300 ease-out
          left-0
          ${isOpen ? 'lg:left-56' : 'lg:left-16'}
          right-0`}
      >
        {/* Free shipping banner */}
        <div className="bg-chinese-red text-white text-center py-1 text-xs tracking-wider">
          {t('nav.freeShipping')}
        </div>

        {/* Main top bar */}
        <div className="flex items-center justify-between h-12 lg:h-14 px-3">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-1.5 text-gray-300 hover:text-chinese-gold transition-colors cursor-pointer"
              aria-label="切换导航"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 border-2 border-chinese-gold flex items-center justify-center group-hover:bg-chinese-gold/10 transition-colors">
                <span className="text-chinese-gold font-serif text-xs font-bold">禅</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-chinese-gold font-serif text-sm leading-tight">{t('nav.brandName')}</h1>
                <p className="text-chinese-slate-light text-[8px] tracking-widest uppercase">{t('nav.brandSub')}</p>
              </div>
            </Link>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            {/* Language Switcher */}
            <button
              onClick={toggleLocale}
              className="px-2 py-1 text-[11px] text-chinese-gold border border-chinese-gold/40 rounded
                         hover:bg-chinese-gold/10 transition-colors font-medium cursor-pointer"
              aria-label="Switch language"
            >
              {locale === 'zh' ? 'EN' : '中'}
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-gray-300 hover:text-chinese-gold transition-colors cursor-pointer"
              aria-label={t('nav.search')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1.5 text-gray-300 hover:text-chinese-gold transition-colors cursor-pointer"
              aria-label={t('checkout.title')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-chinese-red text-white text-[9px]
                               font-medium flex items-center justify-center rounded-full min-w-[16px] h-4">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Auth */}
            {!loading &&
              (user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 p-1.5 text-gray-300 hover:text-chinese-gold transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[11px] text-chinese-gold max-w-[60px] truncate">{user.name}</span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-chinese-gold/20 shadow-lg z-20">
                        <div className="px-3 py-1.5 border-b border-gray-100">
                          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-chinese-ivory transition-colors cursor-pointer"
                        >
                          {t('nav.logout')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:block p-1.5 text-gray-300 hover:text-chinese-gold transition-colors"
                  aria-label={t('auth.login')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              ))}
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="px-3 pb-3 animate-fadeIn">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="chinese-input flex-1 bg-chinese-ink-light border-chinese-gold/30 text-white
                          placeholder:text-gray-500 text-sm"
              />
              <button type="submit" className="chinese-btn-primary whitespace-nowrap text-sm px-3 cursor-pointer">
                {t('nav.searchBtn')}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ─── Sidebar (fixed left) ─── */}
      <>
        {/* Mobile overlay backdrop */}
        {isOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`fixed left-0 top-0 h-full z-40 bg-chinese-ink border-r border-chinese-gold/10
            flex flex-col
            transition-all duration-300 ease-out
            ${isOpen ? 'w-56' : 'w-16'}
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Logo area */}
          <div className={`h-[72px] lg:h-20 flex items-center justify-center border-b border-chinese-gold/10 flex-shrink-0
            ${isOpen ? 'px-4' : 'px-0'}`}
          >
            {isOpen ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 border-2 border-chinese-gold flex items-center justify-center flex-shrink-0">
                  <span className="text-chinese-gold font-serif text-xs font-bold">禅</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-chinese-gold font-serif text-sm leading-tight">{t('nav.brandName')}</p>
                  <p className="text-chinese-slate text-[8px] tracking-widest uppercase">{t('nav.brandSub')}</p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 border-2 border-chinese-gold flex items-center justify-center">
                <span className="text-chinese-gold font-serif text-xs font-bold">禅</span>
              </div>
            )}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-md transition-all duration-200
                        ${active
                          ? 'bg-chinese-gold/10 text-chinese-gold'
                          : 'text-gray-400 hover:text-chinese-gold-light hover:bg-white/5'
                        }
                        ${isOpen ? 'px-3 py-2.5' : 'justify-center py-2.5'}`}
                      title={!isOpen ? item.label : undefined}
                    >
                      <span className="flex-shrink-0">{navIcon(item.href)}</span>
                      {isOpen && (
                        <span className="text-sm tracking-wider whitespace-nowrap">{item.label}</span>
                      )}
                      {isOpen && active && (
                        <span className="ml-auto w-1 h-4 rounded-full bg-chinese-gold" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Bottom decoration */}
          <div className="flex-shrink-0 py-3 flex justify-center border-t border-chinese-gold/10">
            {isOpen ? (
              <p className="text-chinese-slate/40 text-[9px] tracking-[0.25em] font-serif">禅意手作</p>
            ) : (
              <span
                className="text-chinese-gold/25 text-xs font-serif select-none"
                style={{ writingMode: 'vertical-rl' }}
              >
                禅
              </span>
            )}
          </div>
        </aside>
      </>

      {/* Mobile inline nav (hidden on desktop) */}
      {isOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-chinese-ink border-t border-chinese-gold/10 px-2 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors
                  ${isActive(item.href) ? 'text-chinese-gold' : 'text-gray-400 hover:text-chinese-gold-light'}`}
              >
                <span className="w-4 h-4">{navIcon(item.href)}</span>
                <span className="text-[9px] tracking-wider">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
