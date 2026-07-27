'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useI18n } from '@/lib/I18nContext'

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const ref = searchParams.get('ref')
  const { t } = useI18n()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('两次密码输入不一致')
      return
    }
    if (form.password.length < 6) {
      setError('密码至少需要6位')
      return
    }
    setLoading(true)
    const { ok, error } = await register(form.name, form.email, form.password, ref || undefined)
    if (ok) {
      router.push('/auth/login')
    } else {
      setError(error || t('auth.registerError'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center cloud-bg py-20">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="chinese-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-chinese-ink mb-2">{t('auth.register')}</h1>
            <p className="text-sm text-gray-500">{t('auth.join')}</p>
            {ref && (
              <p className="text-xs text-chinese-gold mt-2">通过好友推荐链接注册</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('auth.name')}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="chinese-input"
                placeholder="您的昵称"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('auth.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="chinese-input"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('auth.password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="chinese-input"
                placeholder="至少6位密码"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('auth.confirmPassword')}</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                className="chinese-input"
                placeholder="再次输入密码"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="chinese-btn-primary w-full">
              {loading ? '注册中...' : t('auth.register')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            {t('auth.hasAccount')}{' '}
            <Link href="/auth/login" className="text-chinese-red hover:text-chinese-red-light">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
