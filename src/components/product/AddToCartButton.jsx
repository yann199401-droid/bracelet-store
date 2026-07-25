'use client'

import { useCart } from '@/lib/CartContext'
import { useState } from 'react'

export default function AddToCartButton({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    if (product.stock <= 0) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: JSON.parse(product.images || '[]'),
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      disabled={product.stock <= 0}
      className={`chinese-btn-primary w-full text-center text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
        added ? 'bg-green-600 hover:bg-green-700' : ''
      }`}
    >
      {added ? '✓ 已加入购物车' : product.stock > 0 ? '加入购物车' : '暂时缺货'}
    </button>
  )
}
