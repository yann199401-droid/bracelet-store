import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SplashScreen from '@/components/layout/SplashScreen'
import { CartProvider } from '@/lib/CartContext'
import { AuthProvider } from '@/lib/AuthContext'
import { ToastProvider } from '@/lib/ToastContext'

export const metadata = {
  title: {
    default: '禅意手作 | Zen Craft Bracelets — 天然木石手串',
    template: '%s | 禅意手作 Zen Craft Bracelets',
  },
  description: '精选天然木材与珍稀石材，手工打造每一串手串。传承东方美学，匠心独具。面向东南亚及全球客户。',
  keywords: ['手串', '木质手串', '石材手串', '禅意手作', 'Zen Craft Bracelets', '紫檀', '黄花梨', '和田玉', '玛瑙', '文玩', '天然木石手串'],
  authors: [{ name: '禅意手作 | Zen Craft Bracelets' }],
  metadataBase: new URL('http://localhost:3457'),
  openGraph: {
    title: '禅意手作 | Zen Craft Bracelets — 天然木石手串',
    description: '精选天然木材与珍稀石材，手工打磨每一颗珠粒。让大自然的温度，陪伴你的每一天。',
    url: '/',
    siteName: '禅意手作',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/images/banners/hero-bracelet.jpg', width: 1920, height: 1280 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '禅意手作 | Zen Craft Bracelets — 天然木石手串',
    description: '精选天然木材与珍稀石材，手工打磨每一颗珠粒。',
    images: ['/images/banners/hero-bracelet.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <SplashScreen />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 animate-fadeIn">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
