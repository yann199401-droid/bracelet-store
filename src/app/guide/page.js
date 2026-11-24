import Link from 'next/link'
import { getLocale } from '@/lib/i18n-server'

export function generateMetadata() {
  const en = getLocale() === 'en'
  return { title: en ? 'Bracelet fit and care' : '手围与保养指南', alternates: { canonical: '/guide' } }
}

export default function GuidePage() {
  const en = getLocale() === 'en'

  return (
    <div className="timing-page">
      <div className="timing-shell max-w-3xl space-y-5 py-12">
        <h1 className="timing-heading">{en ? 'Wrist sizing and bracelet care' : '手围与保养指南'}</h1>
        <section id="size" className="timing-card scroll-mt-24 p-6">
          <h2 className="text-2xl">{en ? 'Measure your wrist' : '怎么量手围'}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-stone-700">
            <li>{en ? 'Wrap a soft tape around the wrist where you wear a bracelet. Keep the tape snug.' : '用软尺绕手腕平时戴手串的位置一圈，贴合皮肤。'}</li>
            <li>{en ? 'Record your wrist circumference in centimetres.' : '记下厘米数，填写实际手围。'}</li>
            <li>{en ? 'The new collection shows 14–20 cm as standard choices and lets you enter another size. Check the listed fit on products that are available to order.' : '新品系列的常规选项为 14–20 cm，也可以填写其他手围。可下单的现有款以商品页规格为准。'}</li>
          </ol>
        </section>
        <section id="care" className="timing-card scroll-mt-24 p-6">
          <h2 className="text-2xl">{en ? 'Daily care' : '日常保养'}</h2>
          <p className="mt-3 leading-relaxed text-stone-700">{en
            ? 'Wipe with a soft dry cloth after wear. Keep the bracelet away from prolonged moisture, perfume and harsh cleaners. Check the cord for wear before putting it on.'
            : '佩戴后用干燥软布轻拭，尽量避免长时间接触水、香水或强清洁剂。戴之前可以检查一下绳线和连接处是否磨损。'}</p>
        </section>
        <section id="support" className="timing-card scroll-mt-24 p-6">
          <h2 className="text-2xl">{en ? 'Order support' : '购买与售后咨询'}</h2>
          <p className="mt-3 text-stone-700">{en
            ? 'Ask us about fit, packaging, shipping or a recent order. Include your style code or order number when available.'
            : '有尺寸、包装、配送或售后问题，可以联系我们。已有款式编号或订单号时，可以一并提供。'}</p>
          <Link href="/about#contact" className="timing-link mt-4 inline-block">{en ? 'Contact us' : '联系客服'}</Link>
        </section>
      </div>
    </div>
  )
}
