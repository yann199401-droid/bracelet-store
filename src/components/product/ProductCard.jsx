import Link from 'next/link'

const materialLabel = { WOOD: '木质', STONE: '石材', MIXED: '混合' }

export default function ProductCard({ product }) {
  const images = JSON.parse(product.images || '[]')
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="chinese-card group-hover:shadow-chinese-lg transition-shadow duration-300">
        <div className="relative aspect-square bg-chinese-ivory-dark overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {product.featured && <span className="absolute top-2 left-2 bg-chinese-red text-white text-[10px] px-2 py-0.5">推荐</span>}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-chinese-gold uppercase">{materialLabel[product.material]}</span>
            <span className="text-[10px] text-gray-400">{product.sku}</span>
          </div>
          <h3 className="font-serif text-base text-chinese-ink mb-1 group-hover:text-chinese-red truncate">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-chinese-red font-medium">${product.price.toFixed(2)}</span>
            {product.stock <= 0 && <span className="text-[10px] text-gray-400">缺货</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
