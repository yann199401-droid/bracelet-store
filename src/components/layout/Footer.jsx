import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-chinese-ink text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border-2 border-chinese-gold flex items-center justify-center">
                <span className="text-chinese-gold font-serif text-xl font-bold">禅</span>
              </div>
              <div>
                <h3 className="text-chinese-gold font-serif text-lg">禅意手作</h3>
                <p className="text-chinese-slate text-[10px] tracking-widest uppercase">Zen Craft Bracelets</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              精选天然木材与石材，手工打造每一串手串。传承东方美学，匠心独具。
            </p>
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-chinese-gold/30 flex items-center justify-center
                           hover:bg-chinese-gold/10 hover:border-chinese-gold transition-all duration-200 group"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-chinese-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-chinese-gold/30 flex items-center justify-center
                           hover:bg-chinese-gold/10 hover:border-chinese-gold transition-all duration-200 group"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 text-chinese-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-chinese-gold/30 flex items-center justify-center
                           hover:bg-chinese-gold/10 hover:border-chinese-gold transition-all duration-200 group"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-chinese-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-chinese-gold font-serif text-lg mb-4">快速链接</h4>
            <ul className="space-y-2.5">
              {[
                { label: '首页', href: '/' },
                { label: '所有产品', href: '/products' },
                { label: '促销活动', href: '/promotions' },
                { label: '关于我们', href: '/about' },
                { label: '论坛', href: '/forum' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-chinese-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-chinese-gold font-serif text-lg mb-4">产品分类</h4>
            <ul className="space-y-2.5">
              {[
                { label: '木质手串', href: '/products?material=WOOD' },
                { label: '石材手串', href: '/products?material=STONE' },
                { label: '混合材质', href: '/products?material=MIXED' },
                { label: '新品上架', href: '/products?sort=newest' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-chinese-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-chinese-gold font-serif text-lg mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-chinese-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>yann199401@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-chinese-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>18532168338</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-chinese-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>中国 · 苏州</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="mt-12 pt-8 border-t border-chinese-gold/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping */}
            <div>
              <h4 className="text-xs text-gray-500 tracking-wider mb-4">合作物流</h4>
              <div className="flex items-center gap-4">
                {/* FedEx */}
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded">
                  <svg className="w-8 h-6" viewBox="0 0 80 32" fill="none">
                    <rect width="80" height="32" rx="4" fill="#fff" opacity="0.15"/>
                    <text x="12" y="20" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="#D4A84B">FedEx</text>
                  </svg>
                  <span className="text-[10px] text-gray-500">Express</span>
                </div>
                {/* DHL */}
                <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded">
                  <svg className="w-8 h-6" viewBox="0 0 80 32" fill="none">
                    <rect width="80" height="32" rx="4" fill="#fff" opacity="0.15"/>
                    <text x="16" y="20" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="13" fill="#D4A84B">DHL</text>
                  </svg>
                  <span className="text-[10px] text-gray-500">Express</span>
                </div>
                <span className="text-[10px] text-gray-500">全球配送 · 满 $50 免邮</span>
              </div>
            </div>
            {/* Payment */}
            <div>
              <h4 className="text-xs text-gray-500 tracking-wider mb-4">支付方式</h4>
              <div className="flex flex-wrap items-center gap-3">
                {/* Visa */}
                <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center">
                  <svg className="w-8 h-5" viewBox="0 0 48 28" fill="none">
                    <text x="6" y="18" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="11" fill="#D4A84B">VISA</text>
                  </svg>
                </div>
                {/* MasterCard */}
                <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center">
                  <svg className="w-8 h-5" viewBox="0 0 48 28" fill="none">
                    <circle cx="16" cy="14" r="8" fill="#D4A84B" opacity="0.6"/>
                    <circle cx="26" cy="14" r="8" fill="#D4A84B" opacity="0.4"/>
                  </svg>
                </div>
                {/* Amex */}
                <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center">
                  <svg className="w-8 h-5" viewBox="0 0 48 28" fill="none">
                    <text x="2" y="16" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="8" fill="#D4A84B">AMEX</text>
                  </svg>
                </div>
                {/* PayPal */}
                <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center">
                  <svg className="w-8 h-5" viewBox="0 0 48 28" fill="none">
                    <text x="3" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="9" fill="#D4A84B">PayPal</text>
                  </svg>
                </div>
                {/* Apple Pay */}
                <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center">
                  <svg className="w-8 h-5" viewBox="0 0 48 28" fill="none">
                    <text x="1" y="16" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="8" fill="#D4A84B">Apple</text>
                  </svg>
                </div>
                {/* Google Pay */}
                <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center">
                  <svg className="w-8 h-5" viewBox="0 0 48 28" fill="none">
                    <text x="1" y="16" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="8" fill="#D4A84B">G Pay</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-chinese-gold/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2024 禅意手作 Zen Craft Bracelets. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-chinese-gold transition-colors">隐私政策</Link>
            <Link href="#" className="hover:text-chinese-gold transition-colors">服务条款</Link>
            <Link href="#" className="hover:text-chinese-gold transition-colors">退换政策</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
