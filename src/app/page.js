import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductGrid from '@/components/product/ProductGrid'
import StarRating from '@/components/ui/StarRating'
import { getLocale, t } from '@/lib/i18n-server'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const locale = getLocale()
  return {
    title: locale === 'en' ? 'Zen Craft Bracelets — Natural Wood & Stone Bracelets' : '禅意手作 — 天然木石手串，手工禅意饰品',
    description: locale === 'en'
      ? 'Handcrafted bracelets from natural wood and rare stone. Timeless Eastern aesthetics, artisan spirit in every bead.'
      : '精选印度小叶紫檀、海南黄花梨、和田玉等天然材质，手工打磨每一颗珠粒。匠心独具，传承东方美学。',
  }
}

export default async function HomePage() {
  const locale = getLocale()
  const tr = (key, params) => t(locale, key, params)

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, active: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  const recentProducts = await prisma.product.findMany({
    where: { active: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  const topReviews = await prisma.productReview.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { product: true, user: true },
  })

  const categories = [
    { key: 'WOOD', label: tr('home.woodBracelets'), desc: tr('home.woodDesc'), icon: '木', color: 'bg-amber-800' },
    { key: 'STONE', label: tr('home.stoneBracelets'), desc: tr('home.stoneDesc'), icon: '石', color: 'bg-slate-600' },
    { key: 'MIXED', label: tr('home.mixedBracelets'), desc: tr('home.mixedDesc'), icon: '合', color: 'bg-chinese-red' },
  ]

  return (
    <div className="cloud-bg">
      {/* Hero Banner */}
      <section className="relative bg-chinese-ink overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/banners/hero-bracelet.jpg"
            alt={tr('home.heroTitle')}
            loading="lazy"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-chinese-ink/70 via-chinese-ink/40 to-chinese-ink/10" />
        </div>
        <div className="lattice-pattern absolute inset-0 opacity-20" />
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <div className="inline-block border border-chinese-gold/50 px-4 py-1 mb-6">
              <span className="text-chinese-gold text-xs tracking-[0.3em] uppercase">{tr('nav.brandSub')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-6">
              {locale === 'en' ? (
                <>{tr('home.heroTitle')}</>
              ) : (
                <>
                  指尖<span className="text-chinese-gold">禅意</span>
                  <br />自然于心
                </>
              )}
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              {locale === 'en' ? tr('home.heroDesc') : '精选天然木材与珍稀石材，手工打磨每一颗珠粒。让大自然的温度，陪伴你的每一天。'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="chinese-btn-primary text-base px-8 py-3">
                {tr('home.exploreBtn')}
              </Link>
              <Link href="/about" className="chinese-btn-outline text-base px-8 py-3 border-white/30 text-white hover:bg-white/10">
                {tr('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="chinese-section-title">{tr('home.categories')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/products?material=${cat.key}`}
              className="chinese-card group hover:shadow-chinese-lg transition-all duration-300"
            >
              <div className="p-8 text-center">
                <div className={`w-16 h-16 ${cat.color} flex items-center justify-center mx-auto mb-4
                                group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-2xl font-serif">{cat.icon}</span>
                </div>
                <h3 className="font-serif text-xl text-chinese-ink mb-2">{cat.label}</h3>
                <p className="text-sm text-gray-500">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="chinese-section-title">{tr('home.featured')}</h2>
          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <p className="text-center text-gray-400">{tr('products.empty')}</p>
          )}
          <div className="text-center mt-12">
            <Link href="/products" className="chinese-btn-outline">{tr('home.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="chinese-section-title">{tr('home.newArrivals')}</h2>
          {recentProducts.length > 0 ? (
            <ProductGrid products={recentProducts} />
          ) : (
            <p className="text-center text-gray-400">{tr('products.empty')}</p>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-chinese-ink py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="chinese-section-title !text-white !after:bg-chinese-gold">{tr('home.testimonials')}</h2>
          {topReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topReviews.map((review) => (
                <div key={review.id} className="bg-chinese-ink-light p-6 border border-chinese-gold/10">
                  <StarRating rating={review.rating} />
                  <p className="text-gray-300 text-sm mt-3 mb-4 leading-relaxed">&ldquo;{review.content}&rdquo;</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chinese-gold">{review.user.name}</span>
                    <span className="text-gray-500">{review.product.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{tr('product.noReviews')}</p>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-chinese-ink mb-4">{tr('home.newsletter')}</h2>
          <p className="text-gray-500 mb-8">{tr('home.newsletterDesc')}</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={tr('home.newsletterPlaceholder')}
              className="chinese-input flex-1"
            />
            <button className="chinese-btn-primary">{tr('home.newsletterBtn')}</button>
          </div>
        </div>
      </section>
    </div>
  )
}
