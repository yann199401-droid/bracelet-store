import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function OrderPage({ params }) {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id: parseInt(id) } })

  if (!order) {
    return (
      <div className="cloud-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif text-chinese-ink mb-4">订单未找到</h1>
          <Link href="/products" className="chinese-btn-primary">继续购物</Link>
        </div>
      </div>
    )
  }

  const items = JSON.parse(order.items || '[]')

  return (
    <div className="cloud-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-serif text-chinese-ink mb-2">下单成功！</h1>
        <p className="text-gray-500 mb-8">感谢您的购买，我们会尽快处理您的订单。</p>

        {/* Order Info */}
        <div className="bg-white border border-chinese-gold/20 p-6 text-left mb-8">
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-400">订单编号</p>
            <p className="text-sm text-chinese-ink font-medium">#{order.id}</p>
          </div>
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-400">订单状态</p>
            <p className="text-sm text-chinese-ink font-medium">
              {order.status === 'PENDING' ? '待处理' : order.status}
            </p>
          </div>

          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-400 mb-2">商品明细</p>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-chinese-ink">{item.name} x{item.quantity}</span>
                <span className="text-chinese-red">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">优惠减免</span>
              <span className="text-sm text-green-600">-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-base font-serif text-chinese-ink">合计</span>
            <span className="text-xl text-chinese-red font-serif font-bold">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white border border-chinese-gold/20 p-6 text-left mb-8">
          <h2 className="font-serif text-lg text-chinese-ink mb-3">收货信息</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">姓名：</span>{order.customerName}</p>
            <p><span className="text-gray-400">邮箱：</span>{order.customerEmail}</p>
            {order.customerPhone && <p><span className="text-gray-400">电话：</span>{order.customerPhone}</p>}
            {order.customerAddr && <p><span className="text-gray-400">地址：</span>{order.customerAddr}</p>}
          </div>
        </div>

        <Link href="/products" className="chinese-btn-primary">继续购物</Link>
      </div>
    </div>
  )
}
