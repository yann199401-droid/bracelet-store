'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/I18nContext'

export default function ErrorSection({ error, reset }) {
  const { t, locale } = useI18n()

  return (
    <div className="cloud-bg min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 border-2 border-chinese-red/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-chinese-red text-3xl font-serif">!</span>
        </div>
        <h2 className="text-xl font-serif text-chinese-ink mb-2">{t('error.title')}</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md">
          {error?.message || (locale === 'en' ? 'An error occurred while loading the page. Please try again.' : '页面加载时发生错误，请稍后重试。')}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="chinese-btn-primary">
            {t('error.retry')}
          </button>
          <Link href="/" className="text-sm text-chinese-gold hover:text-chinese-gold-light transition-colors">
            {t('error.home')}
          </Link>
        </div>
      </div>
    </div>
  )
}
