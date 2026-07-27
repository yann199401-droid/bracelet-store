import Link from 'next/link'
import { getLocale, t } from '@/lib/i18n-server'

export default function NotFound() {
  const locale = getLocale()
  return (
    <div className="cloud-bg min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-24 h-24 border-2 border-chinese-gold/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-chinese-gold text-5xl font-serif">{t(locale, 'notFound.title')}</span>
        </div>
        <h1 className="text-2xl font-serif text-chinese-ink mb-2">{t(locale, 'notFound.message')}</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          {t(locale, 'notFound.desc')}
        </p>
        <div className="w-16 h-0.5 bg-chinese-gold/50 mx-auto mb-8" />
        <Link href="/" className="chinese-btn-primary">
          {t(locale, 'notFound.home')}
        </Link>
      </div>
    </div>
  )
}
