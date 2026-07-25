'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/lib/ToastContext'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddr: '',
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState('') // '' | 'valid' | 'invalid' | 'checking'
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  const finalTotal = Math.max(totalPrice - couponDiscount, 0)

  const validateCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponStatus('checking')
    setCouponError('')
    try {
      const res = await fetch(`/api/coupon/validate?code=${encodeURIComponent(couponCode.trim())}&total=${totalPrice}`)
      const data = await res.json()
      if (data.valid) {
        setCouponStatus('valid')
        setCouponDiscount(data.coupon.discount)
        toast.success(`优惠券已应用，减免 $${data.coupon.discount}！`)
      } else {
        setCouponStatus('invalid')
        setCouponError(data.error || '优惠码无效')
        setCouponDiscount(0)
      }
    } catch {
      setCouponStatus('invalid')
      setCouponError('验证失败，请稍后重试')
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponStatus('')
    setCouponDiscount(0)
    setCouponError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
          total: finalTotal,
          discount: couponDiscount,
          couponCode: couponStatus === 'valid' ? couponCode.trim() : undefined,
          ...form,
        }),
      })

      const data = await res.json()
      if (data.success) {
        clearCart()
        router.push(`/order/${data.orderId}`)
      } else {
        toast.error(data.error || '提交失败')
      }
    } catch {
      toast.error('网络错误，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="cloud-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-serif text-chinese-ink mb-2">购物车是空的</h1>
          <p className="text-gray-400 mb-8">请先添加产品到购物车</p>
          <Link href="/products" className="chinese-btn-primary">浏览产品</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cloud-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif text-chinese-ink mb-8">结算</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
            <div className="bg-white p-6 border border-chinese-gold/20">
              <h2 className="font-serif text-lg text-chinese-ink mb-4">收货信息</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">姓名 *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="chinese-input"
                    placeholder="您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">邮箱 *</label>
                  <input
                    type="email"
                    required
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    className="chinese-input"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">电话</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="chinese-input"
                    placeholder="可选"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">收货地址</label>
                  <textarea
                    value={form.customerAddr}
                    onChange={(e) => setForm({ ...form, customerAddr: e.target.value })}
                    className="chinese-input"
                    rows={3}
                    placeholder="国家 / 城市 / 详细地址"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="chinese-btn-primary w-full text-center text-base py-3 disabled:opacity-50"
            >
              {submitting ? '提交中...' : `确认下单 — $${finalTotal.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 border border-chinese-gold/20 sticky top-24 space-y-4">
              <h2 className="font-serif text-lg text-chinese-ink">订单摘要</h2>

              {/* Items */}
              <div className="space-y-3 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between pt-3 first:pt-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-chinese-ink truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <span className="text-sm text-chinese-red font-medium ml-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-chinese-gold/20 pt-4">
                <label className="block text-xs text-gray-500 mb-2">优惠码</label>
                {couponStatus === 'valid' ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2">
                    <div>
                      <span className="text-sm text-green-700 font-medium">-${couponDiscount.toFixed(2)}</span>
                      <span className="text-xs text-green-600 ml-2">{couponCode}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-700">移除</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), validateCoupon())}
                      placeholder="输入优惠码"
                      className="chinese-input flex-1 text-sm"
                      disabled={!user}
                    />
                    <button
                      type="button"
                      onClick={validateCoupon}
                      disabled={couponStatus === 'checking' || !user}
                      className="px-3 py-1.5 text-xs border border-chinese-gold text-chinese-gold hover:bg-chinese-gold/5 disabled:opacity-50"
                    >
                      {couponStatus === 'checking' ? '...' : '验证'}
                    </button>
                  </div>
                )}
                {couponStatus === 'invalid' && (
                  <p className="text-xs text-red-500 mt-1">{couponError}</p>
                )}
                {!user && (
                  <p className="text-xs text-gray-400 mt-1">需登录后使用优惠码</p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-chinese-gold/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">小计</span>
                  <span className="text-sm text-chinese-ink">${totalPrice.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">优惠</span>
                    <span className="text-sm text-green-600">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">运费</span>
                  <span className="text-sm text-green-600">免邮</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-base font-serif text-chinese-ink">合计</span>
                  <span className={`text-xl font-serif font-bold ${couponDiscount > 0 ? 'text-green-600' : 'text-chinese-red'}`}>
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
