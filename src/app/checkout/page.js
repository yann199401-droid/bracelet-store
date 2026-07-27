'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/lib/ToastContext'
import { useI18n } from '@/lib/I18nContext'

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
  const { user } = useAuth()
  const toast = useToast()
  const { t, locale } = useI18n()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddr: '',
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState('')
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
        toast.success(`Coupon applied! -$${data.coupon.discount}`)
      } else {
        setCouponStatus('invalid')
        setCouponError(data.error || 'Invalid coupon code')
        setCouponDiscount(0)
      }
    } catch {
      setCouponStatus('invalid')
      setCouponError('Validation failed, please try again')
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
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ id, name, price, quantity, images }) => ({ id, name, price, quantity, images })),
          total: finalTotal,
          discount: couponDiscount,
          couponCode: couponStatus === 'valid' ? couponCode.trim() : undefined,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          customerAddr: form.customerAddr,
          locale,
        }),
      })

      const data = await res.json()
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Failed to start payment')
        setSubmitting(false)
      }
    } catch {
      toast.error('Network error, please try again')
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
          <h1 className="text-2xl font-serif text-chinese-ink mb-2">{t('checkout.empty')}</h1>
          <p className="text-gray-400 mb-8">{locale === 'en' ? 'Please add products to your cart first' : '请先添加产品到购物车'}</p>
          <Link href="/products" className="chinese-btn-primary">{t('products.browseAll')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cloud-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif text-chinese-ink mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
            <div className="bg-white p-6 border border-chinese-gold/20">
              <h2 className="font-serif text-lg text-chinese-ink mb-4">{t('checkout.shippingInfo')}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('checkout.name')} *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="chinese-input"
                    placeholder={t('checkout.name')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('checkout.email')} *</label>
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
                  <label className="block text-xs text-gray-500 mb-1">{t('checkout.phone')}</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="chinese-input"
                    placeholder={locale === 'en' ? 'Optional' : '可选'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('checkout.address')}</label>
                  <textarea
                    value={form.customerAddr}
                    onChange={(e) => setForm({ ...form, customerAddr: e.target.value })}
                    className="chinese-input"
                    rows={3}
                    placeholder={locale === 'en' ? 'Country / City / Full Address' : '国家 / 城市 / 详细地址'}
                  />
                </div>
              </div>
            </div>

            <div className="bg-chinese-ivory border border-chinese-gold/20 p-4">
              <p className="text-xs text-gray-500 mb-1">
                <svg className="w-4 h-4 inline text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {locale === 'en' ? 'Secured by Stripe. Your payment info is encrypted.' : '由 Stripe 安全加密处理支付'}
              </p>
              <p className="text-xs text-gray-400">
                {locale === 'en' ? 'We accept: Visa, MasterCard, Amex, Apple Pay, Google Pay' : '支持：Visa, MasterCard, Amex, Apple Pay, Google Pay'}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="chinese-btn-primary w-full text-center text-base py-3 disabled:opacity-50"
            >
              {submitting
                ? (locale === 'en' ? 'Redirecting to payment...' : '跳转支付中...')
                : (locale === 'en' ? `Pay $${finalTotal.toFixed(2)}` : `确认支付 $${finalTotal.toFixed(2)}`)}
            </button>
          </form>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 border border-chinese-gold/20 sticky top-24 space-y-4">
              <h2 className="font-serif text-lg text-chinese-ink">{t('checkout.orderSummary')}</h2>

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
                <label className="block text-xs text-gray-500 mb-2">{t('checkout.coupon')}</label>
                {couponStatus === 'valid' ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2">
                    <div>
                      <span className="text-sm text-green-700 font-medium">-${couponDiscount.toFixed(2)}</span>
                      <span className="text-xs text-green-600 ml-2">{couponCode}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-700">{t('checkout.remove')}</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), validateCoupon())}
                      placeholder={locale === 'en' ? 'Enter coupon code' : '输入优惠码'}
                      className="chinese-input flex-1 text-sm"
                      disabled={!user}
                    />
                    <button
                      type="button"
                      onClick={validateCoupon}
                      disabled={couponStatus === 'checking' || !user}
                      className="px-3 py-1.5 text-xs border border-chinese-gold text-chinese-gold hover:bg-chinese-gold/5 disabled:opacity-50"
                    >
                      {couponStatus === 'checking' ? '...' : t('checkout.apply')}
                    </button>
                  </div>
                )}
                {couponStatus === 'invalid' && (
                  <p className="text-xs text-red-500 mt-1">{couponError}</p>
                )}
                {!user && (
                  <p className="text-xs text-gray-400 mt-1">{t('checkout.loginRequired')}</p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-chinese-gold/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('checkout.subtotal')}</span>
                  <span className="text-sm text-chinese-ink">${totalPrice.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">{t('checkout.discount')}</span>
                    <span className="text-sm text-green-600">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">{t('checkout.shipping')}</span>
                  <span className="text-sm text-green-600">{t('checkout.free')}</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-base font-serif text-chinese-ink">{t('checkout.total')}</span>
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
