'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProducts() {
  const router = useRouter()
  const [data, setData] = useState({ products: [], total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(null)

  const loadProducts = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, search })
    fetch(`/api/admin/products?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.products) setData(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [page, search])

  const handleDelete = async (product) => {
    if (!window.confirm(`确定删除「${product.name}」吗？该操作不可撤销。`)) return

    setDeleting(product.id)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadProducts()
      } else {
        const err = await res.json()
        alert(err.error || '删除失败')
      }
    } catch {
      alert('网络错误')
    }
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">产品管理</h1>
        <Link
          href="/admin/products/new"
          className="bg-chinese-red text-white px-4 py-2 rounded text-sm hover:bg-red-800 transition-colors"
        >
          + 新增产品
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索产品名称..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full max-w-sm border rounded px-3 py-2 text-sm focus:outline-none
            focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : data.products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          {search ? '未找到匹配的产品' : '暂无产品，点击上方按钮新增'}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="px-4 py-3 font-medium text-gray-600 w-16">图片</th>
                  <th className="px-4 py-3 font-medium text-gray-600">名称</th>
                  <th className="px-4 py-3 font-medium text-gray-600">SKU</th>
                  <th className="px-4 py-3 font-medium text-gray-600">价格</th>
                  <th className="px-4 py-3 font-medium text-gray-600">库存</th>
                  <th className="px-4 py-3 font-medium text-gray-600">材质</th>
                  <th className="px-4 py-3 font-medium text-gray-600">推荐</th>
                  <th className="px-4 py-3 font-medium text-gray-600">日期</th>
                  <th className="px-4 py-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map(product => {
                  const images = (() => {
                    try {
                      return JSON.parse(product.images || '[]')
                    } catch { return [] }
                  })()

                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {images[0] ? (
                          <img src={images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">
                            无图
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">{product.sku}</td>
                      <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={product.stock <= 0 ? 'text-red-500' : 'text-gray-700'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{product.material}</td>
                      <td className="px-4 py-3">
                        {product.featured ? (
                          <span className="text-chinese-gold text-xs">★ 推荐</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={deleting === product.id}
                            className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                          >
                            {deleting === product.id ? '删除中...' : '删除'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← 上一页
              </button>
              <span className="text-sm text-gray-500">
                第 {page} / {data.totalPages} 页（共 {data.total} 件）
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页 →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
