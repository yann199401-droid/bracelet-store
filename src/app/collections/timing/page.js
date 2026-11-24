import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/lib/i18n-server'
import catalog from './catalog.json'
import WristSize from './WristSize'
import { series } from '@/lib/timing'

const path = '/collections/timing'

export function generateMetadata() {
  const english = getLocale() === 'en'
  return {
    title: english ? 'Time in Detail · Bracelet Collection' : '时间有迹 · 首批新品',
    description: english
      ? 'Explore ten new bead designs and compare materials, details, and wrist sizes.'
      : '浏览禅意手作首批十款新品，查看珠串图片、材质说明与可定制手围。',
    alternates: { canonical: path },
  }
}

export default function TimingCollectionPage({ searchParams }) {
  const locale = getLocale()
  const english = locale === 'en'
  const selected = series.find(({ id }) => id === searchParams?.series)
  const items = selected ? catalog.filter(({ id }) => selected.designs.includes(id)) : catalog

  return (
    <div className="timing-page">
      <header className="border-b border-stone-200 bg-[#eee5d7]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <Link href="/products" className="text-sm text-stone-700 underline underline-offset-4">
            {english ? 'All products' : '所有商品'}
          </Link>
          <h1 className="mt-5 text-4xl sm:text-5xl">{english ? 'Time in Detail' : '时间有迹'}</h1>
          <p className="mt-4 text-lg">{english ? 'Keep a moment close.' : '把重要的时光，留在腕间。'}</p>
          <p className="mt-2 text-sm text-stone-700">
            {english ? 'Preview ten new designs. Prices will be announced before ordering opens.' : '首批十款新品已开放浏览，售价公布后开放购买。'}
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <nav aria-label={english ? 'Filter by occasion' : '按系列选款'} className="mb-6 flex flex-wrap gap-2">
          <Link href={path} aria-current={!selected ? 'page' : undefined}
            className={`timing-button ${selected ? 'timing-button-secondary' : ''}`}>
            {english ? 'All designs' : '全部款式'}
          </Link>
          {series.map((item) => (
            <Link key={item.id} href={`${path}?series=${item.id}`}
              aria-current={selected?.id === item.id ? 'page' : undefined}
              className={`timing-button ${selected?.id === item.id ? '' : 'timing-button-secondary'}`}>
              {item.name[locale]}
            </Link>
          ))}
        </nav>
        {selected && <p className="mb-6 text-stone-700">{selected.story[locale]}</p>}
        <section aria-label={english ? 'New designs' : '新品款式'}
          className="grid grid-cols-1 gap-5 min-[390px]:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} id={item.id} className="scroll-mt-24 overflow-hidden rounded-xl border border-stone-200 bg-white">
              <a href={item.image} aria-label={english ? `View ${item.name.en} image` : `查看${item.name.zh}大图`}>
                <div className="relative aspect-square">
                  <Image src={item.image} alt={item.name[locale]} fill
                    sizes="(max-width: 389px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-contain" />
                </div>
              </a>
              <div className="space-y-3 p-4">
                <h2 className="text-lg">{item.name[locale]}</h2>
                <p className="text-sm leading-relaxed text-stone-700">{item.material[locale]}</p>
                {item.spec && (
                  <p className="text-sm text-stone-700">
                    {english ? item.spec.replace('、', ' · ').replace(' 颗', ' beads') : item.spec}
                  </p>
                )}
                <p className="text-sm text-stone-700">{english ? `Stock: ${item.stock} pcs` : `库存 ${item.stock} 件`}</p>
                <WristSize english={english} />
                <Link href={`/archive?code=${encodeURIComponent(item.id)}`} className="timing-link inline-block text-sm">
                  {english ? 'View style record' : '查阅款式档案'}
                </Link>
              </div>
            </article>
          ))}
        </section>
        <section className="mt-10 border-t border-stone-200 pt-6 text-sm leading-relaxed text-stone-700">
          <h2 className="mb-2 text-xl text-stone-900">{english ? 'How to measure' : '怎么量手围'}</h2>
          <p>{english
            ? 'Wrap a soft tape around your wrist where you normally wear a bracelet. Keep it snug and record the circumference in centimetres.'
            : '用软尺贴合手腕平时戴手串的位置绕一圈，读取厘米数。软尺贴合皮肤即可。'}</p>
        </section>
      </div>
    </div>
  )
}
