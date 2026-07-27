import prisma from '@/lib/prisma'
import ProductImages from '@/components/product/ProductImages'
import AddToCartButton from '@/components/product/AddToCartButton'
import StarRating from '@/components/ui/StarRating'
import ReviewForm from './ReviewForm'
import CustomerPhotos from './CustomerPhotos'
import ReviewMedia from '@/components/product/ReviewMedia'
import Link from 'next/link'
import { getLocale, t } from '@/lib/i18n-server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { id } = await params
  const locale = getLocale()
  const tr = (key, p) => t(locale, key, p)
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } })
  if (!product) return { title: tr('product.notFound') + ' — 禅意手作' }

  const firstLine = product.description.split('\n')[0]
  const images = JSON.parse(product.images || '[]')

  return {
    title: `${product.name} — 禅意手作`,
    description: firstLine.substring(0, 160),
    openGraph: {
      title: `${product.name} — 禅意手作`,
      description: firstLine.substring(0, 160),
      images: images.length > 0 ? images : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params
  const locale = getLocale()
  const tr = (key, p) => t(locale, key, p)
  const materialLabel = { WOOD: tr('product.materialWood'), STONE: tr('product.materialStone'), MIXED: tr('product.materialMixed') }
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif text-chinese-ink mb-4">{tr('product.notFound')}</h1>
        <Link href="/products" className="chinese-btn-primary">{tr('product.backToProducts')}</Link>
      </div>
    )
  }

  const avgRating = product.reviews.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0

  const images = JSON.parse(product.images || '[]')

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description.split('\n')[0],
    image: images,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tr('product.breadcrumbHome'), item: '/' },
      { '@type': 'ListItem', position: 2, name: tr('product.breadcrumbProducts'), item: '/products' },
      { '@type': 'ListItem', position: 3, name: product.name },
    ],
  }

  return (
    <div className="cloud-bg min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-chinese-gold/10">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-400">
          <Link href="/" className="hover:text-chinese-gold">{tr('product.breadcrumbHome')}</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-chinese-gold">{tr('product.breadcrumbProducts')}</Link>
          <span className="mx-2">/</span>
          <span className="text-chinese-ink">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <ProductImages images={images} />

          {/* Info */}
          <div>
            <div className="mb-6">
              <span className="text-xs text-chinese-gold tracking-wider uppercase">
                {materialLabel[product.material]}
              </span>
              <h1 className="text-3xl font-serif text-chinese-ink mt-1 mb-2">{product.name}</h1>
              <p className="text-xs text-gray-400">{tr('product.sku')}: {product.sku}</p>
            </div>

            <div className="text-3xl text-chinese-red font-medium mb-6">
              ${product.price.toFixed(2)}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={Math.round(parseFloat(avgRating))} />
              <span className="text-sm text-gray-500">
                {tr('product.rating', { rating: avgRating, count: product.reviews.length })}
              </span>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white border border-chinese-gold/10">
              <div>
                <span className="text-xs text-gray-400 block">{tr('product.material')}</span>
                <span className="text-sm text-chinese-ink">{materialLabel[product.material]}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">{tr('product.diameter')}</span>
                <span className="text-sm text-chinese-ink">{product.diameter}mm</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">{tr('product.length')}</span>
                <span className="text-sm text-chinese-ink">{product.lengthCm}cm</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">{tr('product.stock')}</span>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? tr('product.inStock', { count: product.stock }) : tr('product.outOfStock')}
                </span>
              </div>
            </div>

            {/* Buy Button */}
            <AddToCartButton product={product} />
          </div>
        </div>

        {/* Description */}
        <div className="mt-16">
          <h2 className="font-serif text-2xl text-chinese-ink mb-4">{tr('product.description')}</h2>
          <div className="w-12 h-0.5 bg-chinese-gold mb-6" />
          <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>

        <div className="chinese-divider" />

        {/* Customer Photos */}
        <CustomerPhotos reviews={product.reviews} />

        <div className="chinese-divider" />

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="font-serif text-2xl text-chinese-ink mb-6">
            {tr('product.reviews', { count: product.reviews.length })}
          </h2>

          {/* Review List */}
          {product.reviews.length > 0 ? (
            <div className="space-y-4 mb-10">
              {product.reviews.map((review) => {
                const reviewMedia = JSON.parse(review.media || '[]')
                return (
                  <div key={review.id} className="bg-white p-4 border border-chinese-gold/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-chinese-ink">{review.user.name}</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{review.content}</p>
                    {reviewMedia.length > 0 && <ReviewMedia media={reviewMedia} />}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-10">{tr('product.noReviews')}</p>
          )}

          {/* Review Form */}
          <ReviewForm productId={product.id} />
        </div>
      </div>
    </div>
  )
}
