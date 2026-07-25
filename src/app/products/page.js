import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductGrid from '@/components/product/ProductGrid'
import Pagination from '@/components/ui/Pagination'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  const material = params.material || ''
  const search = params.search || ''

  let title = '所有产品 — 禅意手作 | Zen Craft Bracelets'
  let description = '浏览全部天然木石手串产品，包括小叶紫檀、黄花梨、和田玉、玛瑙、翡翠等材质，手工打磨，品质保证。'

  if (material === 'WOOD') {
    title = '木质手串 — 紫檀 · 黄花梨 · 沉香 | 禅意手作'
    description = '精选小叶紫檀、海南黄花梨、老山檀香、金丝楠等珍稀木材手串，手工打磨，油性充足，纹理精美。'
  } else if (material === 'STONE') {
    title = '石材手串 — 和田玉 · 玛瑙 · 翡翠 | 禅意手作'
    description = '精选和田玉、南红玛瑙、冰种翡翠、青金石等珍稀石材手串，温润细腻，色泽饱满。'
  } else if (material === 'MIXED') {
    title = '混合材质手串 — 木石搭配创意设计 | 禅意手作'
    description = '木石混搭手串，紫檀配玛瑙、沉香配翡翠等创意设计，独具匠心，时尚大方。'
  }

  if (search) {
    title = `搜索"${search}" — ${title}`
    description = `搜索"${search}"的天然木石手串产品结果。${description}`
  }

  return { title, description }
}

const ITEMS_PER_PAGE = 12

const materials = [
  { value: '', label: '全部材质' },
  { value: 'WOOD', label: '木质' },
  { value: 'STONE', label: '石材' },
  { value: 'MIXED', label: '混合' },
]

const sortOptions = [
  { value: 'newest', label: '最新上架' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
]

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams
  const page = parseInt(params.page) || 1
  const material = params.material || ''
  const sort = params.sort || 'newest'
  const search = params.search || ''

  const where = {}
  if (material) where.material = material
  if (search) where.name = { contains: search }

  const orderBy = sort === 'price-asc' ? { price: 'asc' }
    : sort === 'price-desc' ? { price: 'desc' }
    : { createdAt: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="cloud-bg min-h-screen">
      {/* Header */}
      <section className="bg-chinese-ink py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">所有产品</h1>
          {search && (
            <p className="text-gray-400">搜索 &ldquo;{search}&rdquo; 的结果 ({total} 件)</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white p-4 chinese-border mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Material Filter */}
            <div>
              <label className="block text-xs text-gray-500 mb-1 tracking-wider">材质</label>
              <div className="flex flex-wrap gap-2">
                {materials.map((m) => (
                  <Link
                    key={m.value}
                    href={`/products?${new URLSearchParams({ ...(m.value ? { material: m.value } : {}), sort }).toString()}`}
                    className={`px-3 py-1.5 text-xs transition-colors ${
                      material === m.value
                        ? 'bg-chinese-red text-white'
                        : 'border border-chinese-gold/30 text-gray-600 hover:border-chinese-gold'
                    }`}
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs text-gray-500 mb-1 tracking-wider">排序</label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((s) => (
                  <Link
                    key={s.value}
                    href={`/products?${new URLSearchParams({ ...(material ? { material } : {}), sort: s.value }).toString()}`}
                    className={`px-3 py-1.5 text-xs transition-colors ${
                      sort === s.value
                        ? 'bg-chinese-gold text-chinese-ink'
                        : 'border border-chinese-gold/30 text-gray-600 hover:border-chinese-gold'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Info */}
            <div className="flex items-end justify-end">
              <span className="text-xs text-gray-400">共 {total} 件产品</span>
            </div>
          </div>
        </div>

        {/* Products */}
        {total > 0 ? (
          <>
            <ProductGrid products={products} />
            <Pagination currentPage={page} totalPages={totalPages} basePath="/products" />
          </>
        ) : (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-16 h-16 border-2 border-chinese-gold/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-serif text-chinese-ink mb-2">
              {search ? `未找到与"${search}"相关的产品` : '暂无产品'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {search ? '试试其他关键词，或浏览所有产品' : '敬请期待更多手串上架'}
            </p>
            {search && (
              <Link href="/products" className="chinese-btn-primary">浏览全部产品</Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
