'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { useI18n } from '@/lib/I18nContext'
import { FREE_SHIPPING_MINIMUM_CENTS, REFERRAL_COMMISSION_PERCENT } from '@/lib/promotions'

export default function PromotionsPage() {
  const { user, loading } = useAuth()
  const { locale } = useI18n()
  const en = locale === 'en'
  const [stats, setStats] = useState(null)
  const [failed, setFailed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setStats(null)
    setFailed(false)
    setCopied(false)
    if (!user?.id) return

    const controller = new AbortController()
    fetch('/api/referral/stats', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Referral stats unavailable')
        return response.json()
      })
      .then(setStats)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
    return () => controller.abort()
  }, [user?.id])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(stats.referralLink)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const minimum = FREE_SHIPPING_MINIMUM_CENTS / 100
  return (
    <div className="timing-page">
      <div className="timing-shell max-w-4xl space-y-5 py-12">
        <h1 className="timing-heading">{en ? 'Shipping and referrals' : '包邮与邀请奖励'}</h1>
        <section className="timing-card p-6">
          <h2 className="text-2xl">{en ? `Free shipping on US$${minimum}+` : `满 US$${minimum} 包邮`}</h2>
          <p className="mt-2 text-sm text-stone-700">{en
            ? 'Applies to the merchandise total after discounts in supported destinations. Below US$200, request a quote for the actual shipping cost.'
            : '按优惠后的商品金额计算，适用于支持的配送地区。不满 US$200，请先联系客服确认实际运费。'}</p>
        </section>
        <section className="timing-card p-6">
          <h2 className="text-2xl">{en ? `Earn ${REFERRAL_COMMISSION_PERCENT}% for a referral` : `邀请新客返佣 ${REFERRAL_COMMISSION_PERCENT}%`}</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">{en
            ? 'Invite a friend to register through your link and place their first paid order while signed in. Commission applies to merchandise after discounts, excluding shipping and tax. Refunds and eligibility are reviewed before settlement.'
            : '好友通过专属链接注册，并登录完成首笔付款订单后，按优惠后的商品金额计算返佣，运费和税费不计入。退款及资格在结算前核对。'}</p>

          {stats && user ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm">
                {en ? 'Registered referrals' : '已注册好友'} {stats.referralCount}
                <span className="mx-3 text-stone-500">·</span>
                {en ? 'Commission pending review' : '待核对佣金'} US${(stats.commissionCents / 100).toFixed(2)}
              </p>
              <div className="flex flex-wrap items-end gap-2">
                <label className="min-w-0 flex-1 text-sm">
                  {en ? 'Your referral link' : '专属邀请链接'}
                  <input readOnly value={stats.referralLink} onFocus={(event) => event.target.select()}
                    className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2.5" />
                </label>
                <button type="button" onClick={copyLink} className="timing-button">
                  {copied ? (en ? 'Copied' : '已复制') : (en ? 'Copy link' : '复制链接')}
                </button>
              </div>
              <Link href="/about#contact" className="timing-link inline-block text-sm">{en ? 'Ask about settlement' : '联系处理佣金结算'}</Link>
            </div>
          ) : loading || (user && !failed) ? (
            <p role="status" className="mt-4 text-sm text-stone-700">{en ? 'Loading…' : '加载中…'}</p>
          ) : user ? (
            <p role="status" className="mt-4 text-sm text-stone-700">{en ? 'Referral information is temporarily unavailable.' : '邀请信息暂不可用。'}</p>
          ) : (
            <Link href="/auth/login?next=promotions" className="timing-button mt-5">{en ? 'Sign in for your referral link' : '登录获取邀请链接'}</Link>
          )}
        </section>
      </div>
    </div>
  )
}
