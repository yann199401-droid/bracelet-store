import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">暂无产品</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
