import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductGrid from '@/components/product/ProductGrid'
import { getLocale } from '@/lib/i18n-server'
import { series, timingPath } from '@/lib/timing'
import catalog from './collections/timing/catalog.json'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
  const en = getLocale() === 'en'
  return {
    title: en ? 'Time in Detail · Beaded Bracelets' : '时间有迹 · 木石手串',
    description: en
      ? 'Explore beaded bracelets for everyday wear, new beginnings and gifts. Compare designs, materials and wrist sizes.'
      : '把重要的时光留在腕间。按日常、出发和赠礼选手串，查看款式、材质与手围。',
    alternates: { canonical: '/' },
  }
}

export default async function HomePage() {
  const locale = getLocale()
  const en = locale === 'en'
  const featured = await prisma.product.findMany({
    where: { featured: true, active: true, stock: { gt: 0 } },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="timing-page">
      <section className="relative overflow-hidden bg-chinese-ink">
        <Image src="/images/banners/hero-bracelet.jpg" alt="" fill priority sizes="100vw"
          className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="lattice-pattern absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <p className="text-sm font-medium text-chinese-gold-light">{en ? 'Time in Detail' : '时间有迹'}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-tight text-white md:text-6xl lg:text-7xl">
            {en ? 'Wear the moments that matter.' : '把重要的时光，留在腕间。'}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-stone-100">
            {en ? 'Wood and stone bead bracelets for everyday rituals, new beginnings and the people you think of.' : '从木石纹理里选一串，陪伴日常，纪念出发，也送给想念的人。'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={timingPath} className="timing-button">{en ? 'Explore the collection' : '探索系列'}</Link>
            <Link href="/products" className="inline-flex items-center rounded-md border border-white/60 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10">
              {en ? 'Shop bracelets' : '选购手串'}
            </Link>
          </div>
        </div>
      </section>

      <section className="timing-shell pb-14">
        <h2 className="timing-heading">{en ? 'Explore by occasion' : '为不同的时刻选一串'}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {series.map((item) => {
            const design = catalog.find(({ id }) => id === item.designs[0])
            return (
              <Link key={item.id} href={`${timingPath}?series=${item.id}`} className="timing-card group">
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <Image src={design.image} alt={design.name[locale]} fill sizes="(max-width: 639px) 100vw, 33vw"
                    className="object-contain p-5 transition-transform motion-safe:group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="timing-kicker">{item.occasion[locale]}</p>
                  <h3 className="mt-1 text-2xl">{item.name[locale]}</h3>
                  <p className="mt-2 text-sm text-stone-700">{item.story[locale]}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-y border-stone-200 bg-white/60">
          <div className="timing-shell py-12">
            <h2 className="timing-heading">{en ? 'Available to shop' : '现货选购'}</h2>
            <ProductGrid products={featured} />
            <Link href="/products" className="timing-link mt-6 inline-block">{en ? 'Browse all products' : '浏览全部商品'}</Link>
          </div>
        </section>
      )}

      <section className="timing-shell grid gap-4 py-12 sm:grid-cols-3">
        <Link href="/archive" className="timing-card p-6">
          <h2 className="text-2xl">{en ? 'Product archive' : '产品档案'}</h2>
          <p className="mt-2 text-sm text-stone-700">{en ? 'Look up a style and see where its material information comes from.' : '按款式编号或 SKU 查阅规格，了解材质信息来自哪里。'}</p>
        </Link>
        <Link href="/guide" className="timing-card p-6">
          <h2 className="text-2xl">{en ? 'Fit and care' : '手围和保养'}</h2>
          <p className="mt-2 text-sm text-stone-700">{en ? 'Measure your wrist, choose a gift, or ask about caring for your bracelet.' : '量手围、选礼物、了解日常保养和联系售后。'}</p>
        </Link>
        <Link href="/blog" className="timing-card p-6">
          <h2 className="text-2xl">{en ? 'Journal' : '时间有迹手记'}</h2>
          <p className="mt-2 text-sm text-stone-700">{en ? 'Read about materials, wearing and giving.' : '看一串的来历，找佩戴灵感与赠礼建议。'}</p>
        </Link>
      </section>
    </div>
  )
}
