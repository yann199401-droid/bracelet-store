import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getLocale } from '@/lib/i18n-server'
import { timingPath } from '@/lib/timing'
import catalog from '../collections/timing/catalog.json'

export function generateMetadata() {
  const en = getLocale() === 'en'
  return { title: en ? 'Product archive' : '产品档案', alternates: { canonical: '/archive' } }
}

export default async function ArchivePage({ searchParams }) {
  const locale = getLocale()
  const en = locale === 'en'
  const input = searchParams?.code
  const code = typeof input === 'string' ? input.trim().slice(0, 80) : ''
  const design = catalog.find(({ id }) => id === code.toLowerCase())
  let product
  let lookupFailed = false

  if (code && !design) {
    try {
      product = await prisma.product.findFirst({
        where: { active: true, sku: { equals: code, mode: 'insensitive' } },
        select: { id: true, name: true, sku: true, diameter: true, lengthCm: true },
      })
    } catch (error) {
      console.error('Product archive lookup failed', error)
      lookupFailed = true
    }
  }

  return (
    <div className="timing-page">
      <div className="timing-shell max-w-4xl py-12">
        <h1 className="timing-heading">{en ? 'Product archive' : '产品档案'}</h1>
        <p className="mb-6 leading-relaxed text-stone-700">{en
          ? 'Look up by style code or SKU. Each record identifies where its current information comes from.'
          : '输入款式编号或 SKU，查看规格、材质信息及其来源。'}</p>
        <form action="/archive" className="mb-8 flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 text-sm">
            {en ? 'Style code or SKU' : '款式编号或 SKU'}
            <input name="code" defaultValue={code} maxLength={80} required
              className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2.5" />
          </label>
          <button className="timing-button">{en ? 'Look up' : '查询'}</button>
        </form>

        {design && (
          <article className="timing-card p-6">
            <h2 className="text-2xl">{design.name[locale]}</h2>
            <p className="mt-2 break-all text-sm text-stone-700">{design.id}</p>
            <h3 className="mt-5 text-lg">{en ? 'Material and specifications' : '材质与规格'}</h3>
            <p className="mt-2 text-stone-700">{design.material[locale]}</p>
            {design.spec && <p className="mt-2 text-sm">{en ? design.spec.replace('、', ' · ').replace(' 颗', ' beads') : design.spec}</p>}
            <p className="mt-4 text-sm text-stone-700">{en
              ? 'Record scope: style. Details are based on the accompanying images. No independent test report or batch record is available here.'
              : '档案范围为款式。当前资料来自配图，暂无可公开的独立检测报告或批次记录。'}</p>
            <Link href={`${timingPath}#${design.id}`} className="timing-link mt-4 inline-block">{en ? 'See the design' : '查看款式'}</Link>
          </article>
        )}

        {product && (
          <article className="timing-card p-6">
            <h2 className="text-2xl">{product.name}</h2>
            <p className="mt-2 text-sm text-stone-700">SKU {product.sku}</p>
            {product.diameter > 0 && <p className="mt-2">{en ? 'Bead diameter' : '珠径'} {product.diameter} mm</p>}
            {product.lengthCm > 0 && <p className="mt-2">{en ? 'Listed wrist size' : '标注手围'} {product.lengthCm} cm</p>}
            <p className="mt-4 text-sm text-stone-700">{en
              ? 'These specifications come from the store listing. No independent test report or batch record is available here.'
              : '规格来自店铺商品资料，暂无可公开的独立检测报告或批次记录。'}</p>
            <Link href={`/products/${product.id}`} className="timing-link mt-4 inline-block">{en ? 'View product' : '查看商品'}</Link>
          </article>
        )}

        {code && !design && !product && (
          <p role="status" className="mb-6 text-stone-700">{lookupFailed
            ? (en ? 'Store SKU lookup is temporarily unavailable.' : '店铺 SKU 查询暂不可用。')
            : (en ? 'No matching record. Check the code or choose a design below.' : '没有找到对应记录。可以检查编号，或从下方选择款式。')}</p>
        )}

        <h2 className="mb-4 mt-10 text-2xl">{en ? 'New collection records' : '新品款式档案'}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {catalog.map((item) => (
            <li key={item.id}>
              <Link href={`/archive?code=${encodeURIComponent(item.id)}`} className="timing-card px-4 py-3 hover:bg-stone-50">
                {item.name[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
