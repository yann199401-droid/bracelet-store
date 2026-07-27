'use client'

import { Suspense } from 'react'
import RegisterForm from './RegisterForm'
import { useI18n } from '@/lib/I18nContext'

export default function RegisterPage() {
  const { t } = useI18n()
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center cloud-bg py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-chinese-gold flex items-center justify-center mx-auto mb-4">
            <span className="text-chinese-gold font-serif text-xl">禅</span>
          </div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
