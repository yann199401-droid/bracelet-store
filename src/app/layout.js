import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContentShell from '@/components/layout/ContentShell'
import BackToTop from '@/components/layout/BackToTop'
import ContactWidget from '@/components/layout/ContactWidget'
import SiteGuard from '@/components/layout/SiteGuard'
import { CartProvider } from '@/lib/CartContext'
import { AuthProvider } from '@/lib/AuthContext'
import { ToastProvider } from '@/lib/ToastContext'
import { I18nProvider } from '@/lib/I18nContext'
import { SidebarProvider } from '@/lib/SidebarContext'
import { getLocale } from '@/lib/i18n-server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myzenbeads.com'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '禅意手作 | Zen Craft Bracelets — 天然木石手串',
    template: '%s | 禅意手作 Zen Craft Bracelets',
  },
  description: '浏览禅意手作的木石手串，按日常、出发与赠礼选择款式，查阅材质、规格和手围。',
  keywords: ['手串', '木质手串', '石材手串', '禅意手作', 'Zen Craft Bracelets', '紫檀', '黄花梨', '和田玉', '玛瑙', '文玩', '天然木石手串'],
  authors: [{ name: '禅意手作 | Zen Craft Bracelets' }],
  openGraph: {
    title: '禅意手作 | Zen Craft Bracelets — 天然木石手串',
    description: '把重要的时光，留在腕间。浏览时间有迹系列和款式档案。',
    url: '/',
    siteName: '禅意手作',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/images/banners/hero-bracelet.jpg', width: 1920, height: 1280 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '禅意手作 | Zen Craft Bracelets — 天然木石手串',
    description: '把重要的时光，留在腕间。',
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
  const locale = getLocale()

  return (
    <html lang={locale === 'en' ? 'en' : 'zh-CN'}>
      <body className="min-h-screen bg-chinese-ink text-gray-200">
        <I18nProvider initialLocale={locale}>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <SidebarProvider>
                  <SiteGuard>
                    <Navbar />
                    <ContentShell>
                      <main className="flex-1 animate-fadeIn">
                        {children}
                      </main>
                      <Footer />
                    </ContentShell>
                  </SiteGuard>
                  <BackToTop />
                  <ContactWidget />
                </SidebarProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
