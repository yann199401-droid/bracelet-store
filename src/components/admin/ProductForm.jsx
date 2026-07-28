'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

const MATERIAL_OPTIONS = [
  { value: 'WOOD', label: '木质' },
  { value: 'STONE', label: '石材' },
  { value: 'MIXED', label: '木石混合' },
  { value: 'CRYSTAL', label: '水晶' },
  { value: 'JADE', label: '玉石' },
  { value: 'OTHER', label: '其他' },
]

export default function ProductForm({ initialData }) {
  const isEdit = !!initialData
  const router = useRouter()

  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    material: initialData?.material || 'WOOD',
    price: initialData?.price?.toString() || '',
    sku: initialData?.sku || '',
    stock: initialData?.stock?.toString() || '0',
    diameter: initialData?.diameter?.toString() || '',
    lengthCm: initialData?.lengthCm?.toString() || '',
    featured: initialData?.featured || false,
  })

  const [images, setImages] = useState(() => {
    if (!initialData?.images) return []
    const parsed = typeof initialData.images === 'string'
      ? JSON.parse(initialData.images)
      : initialData.images
    return Array.isArray(parsed) ? parsed : []
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const url = isEdit
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products'

      const method = isEdit ? 'PUT' : 'POST'

      const body = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        diameter: form.diameter ? parseFloat(form.diameter) : 0,
        lengthCm: form.lengthCm ? parseFloat(form.lengthCm) : 0,
        images,
      }

      if (!isEdit) {
        // Auto-generate slug from name on creation if not explicitly set
        if (!body.slug) {
          delete body.slug
        }
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '保存失败')
      }

      setSuccess(isEdit ? '✅ 产品已更新' : '✅ 产品已创建')

      if (!isEdit) {
        // Redirect to edit page after creation
        setTimeout(() => {
          router.push(`/admin/products/${data.id}/edit`)
        }, 1000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const fieldClass = 'mb-4'

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">基本信息</h2>

        <div className={fieldClass}>
          <label className={labelClass}>产品名称 *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => {
              handleChange(e)
              // Auto-generate slug only for new products
              if (!isEdit && !form.slugManuallyEdited) {
                const slug = e.target.value
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                setForm(prev => ({ ...prev, name: e.target.value, slug }))
              }
            }}
            required
            className={inputClass}
            placeholder="如：小叶紫檀手串"
          />
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Slug（URL标识）</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={(e) => {
              setForm(prev => ({ ...prev, slug: e.target.value, slugManuallyEdited: true }))
            }}
            className={inputClass}
            placeholder="自动从名称生成"
          />
          <p className="text-xs text-gray-400 mt-1">用于 URL 地址，仅支持英文、数字和连字符</p>
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>描述</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            placeholder="产品详细描述..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>材质</label>
            <select name="material" value={form.material} onChange={handleChange} className={inputClass}>
              {MATERIAL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>SKU（库存单位）*</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="如：ZT-001"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">价格与库存</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>价格（USD）*</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className={inputClass}
              placeholder="0.00"
            />
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>库存数量</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">规格参数</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className={fieldClass}>
            <label className={labelClass}>珠径（mm）</label>
            <input
              type="number"
              name="diameter"
              value={form.diameter}
              onChange={handleChange}
              min="0"
              step="0.1"
              className={inputClass}
              placeholder="如：8"
            />
          </div>

          <div className={fieldClass}>
            <label className={labelClass}>长度（cm）</label>
            <input
              type="number"
              name="lengthCm"
              value={form.lengthCm}
              onChange={handleChange}
              min="0"
              step="0.5"
              className={inputClass}
              placeholder="如：18"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700">产品图片</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-chinese-red"
            />
            <span className="text-sm text-gray-600">设为推荐产品</span>
          </label>
        </div>

        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-chinese-red text-white px-6 py-2.5 rounded text-sm hover:bg-red-800
            disabled:opacity-50 transition-colors font-medium"
        >
          {saving ? '保存中...' : isEdit ? '更新产品' : '创建产品'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded text-sm
            hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
