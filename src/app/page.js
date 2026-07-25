import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductGrid from '@/components/product/ProductGrid'
import StarRating from '@/components/ui/StarRating'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: '禅意手作 — 天然木石手串，手工禅意饰品',
    description: '精选印度小叶紫檀、海南黄花梨、和田玉等天然材质，手工打磨每一颗珠粒。匠心独具，传承东方美学。',
  }
}

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  const recentProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  const topReviews = await prisma.productReview.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { product: true, user: true },
  })

  const categories = [
    { key: 'WOOD', label: '木质手串', desc: '紫檀 · 黄花梨 · 沉香', icon: '木', color: 'bg-amber-800' },
    { key: 'STONE', label: '石材手串', desc: '和田玉 · 玛瑙 · 翡翠', icon: '石', color: 'bg-slate-600' },
    { key: 'MIXED', label: '混合材质', desc: '木石搭配 · 创意设计', icon: '合', color: 'bg-chinese-red' },
  ]

  return (
    <div className="cloud-bg">
      {/* Hero Banner */}
      <section className="relative bg-chinese-ink overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/banners/hero-bracelet.jpg"
            alt="禅意手作天然木石手串 Banner — 手工打磨木质手串展示"
            loading="lazy"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-chinese-ink/70 via-chinese-ink/40 to-chinese-ink/10" />
        </div>
        <div className="lattice-pattern absolute inset-0 opacity-20" />
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <div className="inline-block border border-chinese-gold/50 px-4 py-1 mb-6">
              <span className="text-chinese-gold text-xs tracking-[0.3em] uppercase">Zen Craft Bracelets</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight mb-6">
              指尖<span className="text-chinese-gold">禅意</span>
              <br />自然于心
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              精选天然木材与珍稀石材，手工打磨每一颗珠粒。让大自然的温度，陪伴你的每一天。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="chinese-btn-primary text-base px-8 py-3">
                探索产品
              </Link>
              <Link href="/about" className="chinese-btn-outline text-base px-8 py-3 border-white/30 text-white hover:bg-white/10">
                了解更多
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-10">
          <div className="w-full h-full" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212,168,75,0.3) 0%, transparent 70%)'
          }} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="chinese-section-title">材质分类</h2>
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
          <h2 className="chinese-section-title">推荐产品</h2>
          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <p className="text-center text-gray-400">暂无推荐产品</p>
          )}
          <div className="text-center mt-12">
            <Link href="/products" className="chinese-btn-outline">查看全部产品</Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="chinese-section-title">新品上架</h2>
          {recentProducts.length > 0 ? (
            <ProductGrid products={recentProducts} />
          ) : (
            <p className="text-center text-gray-400">暂无新品</p>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-chinese-ink py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="chinese-section-title !text-white !after:bg-chinese-gold">用户好评</h2>
          {topReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topReviews.map((review) => (
                <div key={review.id} className="bg-chinese-ink-light p-6 border border-chinese-gold/10">
                  <StarRating rating={review.rating} />
                  <p className="text-gray-300 text-sm mt-3 mb-4 leading-relaxed">&ldquo;{review.content}&rdquo;</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-chinese-gold">{review.user.name}</span>
                    <span className="text-gray-500">
                      {review.product.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">暂无评价</p>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-chinese-ink mb-4">订阅我们的资讯</h2>
          <p className="text-gray-500 mb-8">第一时间获取新品上架和专属优惠信息</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="您的邮箱地址"
              className="chinese-input flex-1"
            />
            <button className="chinese-btn-primary">订阅</button>
          </div>
        </div>
      </section>
    </div>
  )
}
