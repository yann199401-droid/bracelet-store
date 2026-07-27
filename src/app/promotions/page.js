'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/lib/ToastContext'
import { useI18n } from '@/lib/I18nContext'

export default function PromotionsPage() {
  const { t } = useI18n()
  const { user, loading } = useAuth()
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      fetch('/api/referral/stats')
        .then((r) => r.json())
        .then((data) => { setStats(data); setStatsLoading(false) })
        .catch(() => setStatsLoading(false))
    } else if (!loading && !user) {
      setStatsLoading(false)
    }
  }, [user, loading])

  const copyLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink)
      toast.success(t('promotions.copied'))
    }
  }

  return (
    <div className="cloud-bg min-h-screen">
      {/* Hero */}
      <section className="bg-chinese-ink py-16 relative overflow-hidden">
        <div className="lattice-pattern absolute inset-0 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-block border border-chinese-gold/50 px-4 py-1 mb-6">
            <span className="text-chinese-gold text-xs tracking-[0.3em]">PROMOTION</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            {t('promotions.title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t('promotions.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Campaign Rules */}
        <div className="chinese-card p-8 mb-8">
          <h2 className="font-serif text-2xl text-chinese-ink mb-6">{t('promotions.rules')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: t('promotions.step1Title'), desc: t('promotions.step1') },
              { step: '2', title: t('promotions.step2Title'), desc: t('promotions.step2') },
              { step: '3', title: t('promotions.step3Title'), desc: t('promotions.step3') },
            ].map((item) => (
              <div key={item.step} className="text-center p-4">
                <div className="w-14 h-14 border-2 border-chinese-gold flex items-center justify-center mx-auto mb-3">
                  <span className="text-chinese-gold font-serif text-xl">{item.step}</span>
                </div>
                <h3 className="font-serif text-base text-chinese-ink mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-chinese-ivory-dark/50 border border-chinese-gold/20">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-chinese-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">{t('promotions.couponRules')}</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>{t('promotions.couponRule1')}</li>
                  <li>{t('promotions.couponRule2')}</li>
                  <li>{t('promotions.couponRule3')}</li>
                  <li>{t('promotions.couponRule4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        {loading ? (
          <div className="chinese-card p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-48 bg-gray-200 mx-auto rounded" />
              <div className="h-4 w-64 bg-gray-200 mx-auto rounded" />
            </div>
          </div>
        ) : user ? (
          <div className="chinese-card p-8">
            <h2 className="font-serif text-xl text-chinese-ink mb-6">{t('promotions.myReferrals')}</h2>

            {statsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ) : stats ? (
              <>
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('promotions.progress')}</span>
                    <span className="text-sm text-chinese-gold font-medium">{t('promotions.of', { current: stats.referralCount, total: stats.target })}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3">
                    <div
                      className="h-full bg-chinese-gold transition-all duration-500"
                      style={{ width: `${Math.min(stats.progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Coupon Status */}
                {stats.coupon ? (
                  <div className="p-4 bg-green-50 border border-green-200 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-green-800 text-sm">{t('promotions.couponTitle')}</span>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      {t('promotions.couponCode', { code: stats.coupon.code })}
                    </p>
                    <p className="text-xs text-green-600">
                      {t('promotions.couponDiscount', { amount: '35', min: stats.coupon.minAmount })} · {stats.coupon.expiresAt ? t('promotions.couponExpires', { date: new Date(stats.coupon.expiresAt).toLocaleDateString('zh-CN') }) : t('promotions.couponPermanent')}
                    </p>
                  </div>
                ) : stats.referralCount >= 3 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 mb-6">
                    <p className="text-sm text-yellow-800">
                      {t('promotions.pending')}
                    </p>
                  </div>
                ) : null}

                {/* Referral Link */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2">{t('promotions.referralLink')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={stats.referralLink}
                      className="chinese-input flex-1 text-xs bg-gray-50"
                    />
                    <button onClick={copyLink} className="chinese-btn-primary whitespace-nowrap">
                      {t('promotions.copyLink')}
                    </button>
                  </div>
                </div>

                {/* Referral List */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{t('promotions.friends')} ({stats.referralCount})</h3>
                  {stats.referrals.length > 0 ? (
                    <div className="space-y-2">
                      {stats.referrals.map((r) => (
                        <div key={r.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{r.referee.name}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(r.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">{t('promotions.noFriends')}</p>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <div className="chinese-card p-8 text-center">
            <p className="text-gray-500 mb-4">{t('promotions.loginRequired')}</p>
            <Link href="/auth/login" className="chinese-btn-primary">{t('promotions.login')}</Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <Link href="/products" className="text-chinese-gold hover:text-chinese-gold-light text-sm transition-colors">
            {t('promotions.browseAll')} →
          </Link>
        </div>
      </div>
    </div>
  )
}
