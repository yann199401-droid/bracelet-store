'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/lib/ToastContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { ok, error } = await login(form.email, form.password)
    if (ok) {
      toast.success('登录成功，欢迎回来！')
      router.push('/')
    } else {
      setError(error || '登录失败')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center cloud-bg py-20">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="chinese-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-chinese-ink mb-2">登录</h1>
            <p className="text-sm text-gray-500">欢迎回到禅意手作</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">邮箱</label>
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
              <label className="block text-sm text-gray-600 mb-1">密码</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="chinese-input"
                placeholder="输入密码"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="chinese-btn-primary w-full">
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            还没有账号？{' '}
            <Link href="/auth/register" className="text-chinese-red hover:text-chinese-red-light">立即注册</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
