'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/I18nContext'
import { Suspense } from 'react'

function CancelContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const { t } = useI18n()

  return (
    <div className="cloud-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 border-2 border-chinese-gold/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-chinese-gold font-serif">!</span>
        </div>
        <h1 className="text-3xl font-serif text-chinese-ink mb-4">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">
          Your payment was cancelled. Your order has been saved and you can try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/checkout" className="chinese-btn-primary">
            Try Again
          </Link>
          <Link href="/products" className="chinese-btn-outline">
            {t('order.continue')}
          </Link>
        </div>
        {orderId && (
          <p className="text-xs text-gray-400 mt-6">
            Order reference: #{orderId}
          </p>
        )}
      </div>
    </div>
  )
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="cloud-bg min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  )
}
