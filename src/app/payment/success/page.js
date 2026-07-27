'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { useI18n } from '@/lib/I18nContext'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { t } = useI18n()
  const [countdown, setCountdown] = useState(5)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      clearCart()
    }
    const timer = setInterval(() => {
      setCountdown((c) => c - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [sessionId, clearCart])

  return (
    <div className="cloud-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6 rounded-full">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-chinese-ink mb-4">{t('order.success')}</h1>
        <p className="text-gray-500 mb-8">{t('order.thanks')}</p>
        <div className="space-y-4">
          <Link href="/products" className="chinese-btn-primary inline-block">
            {t('order.continue')}
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            {countdown > 0
              ? `Redirecting to home in ${countdown}...`
              : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="cloud-bg min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
