'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/I18nContext'

export default function Footer() {
  const { t, locale } = useI18n()
  const en = locale === 'en'
  const shopping = [
    ['/products', t('nav.products')],
    ['/collections/timing', en ? 'Time in Detail collection' : '时间有迹系列'],
    ['/promotions', t('nav.promotions')],
  ]
  const support = [
    ['/archive', en ? 'Product archive' : '产品档案'],
    ['/guide', en ? 'Fit and care' : '手围与保养'],
    ['/about#contact', en ? 'Contact us' : '联系客服'],
  ]

  return (
    <footer className="bg-[#282820] text-stone-100">
      <div className="timing-shell grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <Link href="/" className="font-serif text-xl">{t('nav.brandName')}</Link>
          <p className="mt-3 text-sm text-stone-300">{en ? 'Wear the moments that matter.' : '把重要的时光，留在腕间。'}</p>
        </div>
        {[[en ? 'Shop' : '选购', shopping], [en ? 'Product support' : '商品与售后', support]].map(([title, links]) => (
          <div key={title}>
            <h2 className="text-base">{title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-300">
              {links.map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-stone-700">
        <p className="timing-shell py-4 text-xs text-stone-300">© {new Date().getUTCFullYear()} {t('nav.brandName')}</p>
      </div>
    </footer>
  )
}
