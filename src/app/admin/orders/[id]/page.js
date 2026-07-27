'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUS_FLOW = {
  PENDING: { label: '待付款', next: 'PAID', nextLabel: '标记已付款', color: 'bg-yellow-500' },
  PAID: { label: '已付款', next: 'SHIPPED', nextLabel: '标记已发货', color: 'bg-green-500' },
  SHIPPED: { label: '已发货', next: null, nextLabel: null, color: 'bg-purple-500' },
  CANCELLED: { label: '已取消', next: null, nextLabel: null, color: 'bg-gray-500' },
}

export default function AdminOrderDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(o => o.id === parseInt(id))
          if (found) {
            setOrder(found)
            setTrackingNumber(found.trackingNumber || '')
            setCarrier(found.carrier || '')
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    setMessage('')
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
          carrier: carrier || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrder(data)
        setMessage('✅ 更新成功')
      } else {
        setMessage(`❌ ${data.error || '更新失败'}`)
      }
    } catch (e) {
      setMessage('❌ 网络错误')
    }
    setUpdating(false)
  }

  if (loading) {
    return <p className="text-gray-500">加载中...</p>
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">订单不存在</p>
        <Link href="/admin/orders" className="text-chinese-red hover:underline text-sm">← 返回订单列表</Link>
      </div>
    )
  }

  const items = order.items || []
  const statusInfo = STATUS_FLOW[order.status] || {}
  const totalItems = items.reduce((s, i) => s + (i.quantity || 1), 0)

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-gray-500 hover:text-gray-800 text-sm mb-4 inline-block">
        ← 返回订单列表
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          订单 #<span className="font-mono">{order.id}</span>
        </h1>
        <span className={`px-3 py-1 rounded text-sm font-medium text-white ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-lg shadow p-5 mb-4">
        <h2 className="font-bold text-gray-700 mb-3">客户信息</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">姓名：</span>{order.customerName}</div>
          <div><span className="text-gray-400">邮箱：</span>{order.customerEmail}</div>
          <div><span className="text-gray-400">电话：</span>{order.customerPhone || '—'}</div>
          <div><span className="text-gray-400">日期：</span>{new Date(order.createdAt).toLocaleString('zh-CN')}</div>
        </div>
        {order.customerAddr && (
          <div className="mt-2 text-sm">
            <span className="text-gray-400">地址：</span>{order.customerAddr}
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="bg-white rounded-lg shadow p-5 mb-4">
        <h2 className="font-bold text-gray-700 mb-3">商品明细（{totalItems} 件）</h2>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 text-sm">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-400 ml-2">× {item.quantity}</span>
            </div>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {order.discount > 0 && (
          <div className="flex justify-between items-center py-2 text-sm text-green-600">
            <span>优惠</span>
            <span>-${order.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-3 text-base font-bold text-gray-800 border-t mt-2">
          <span>合计</span>
          <span className="text-chinese-red">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-5 mb-4">
        <h2 className="font-bold text-gray-700 mb-3">操作</h2>

        {/* Tracking info */}
        {(order.status === 'PAID' || order.status === 'SHIPPED') && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <label className="block text-sm text-gray-600 mb-1">物流信息</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="物流公司（如 FedEx）"
                className="flex-1 border rounded px-3 py-1.5 text-sm"
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
              />
              <input
                type="text"
                placeholder="物流单号"
                className="flex-1 border rounded px-3 py-1.5 text-sm"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
              />
            </div>
            {(order.trackingNumber || trackingNumber) && (
              <p className="text-xs text-gray-500">
                当前：{order.carrier || carrier || '—'} / {order.trackingNumber || trackingNumber || '—'}
              </p>
            )}
          </div>
        )}

        {/* Status buttons */}
        {statusInfo.next && (
          <button
            onClick={() => updateStatus(statusInfo.next)}
            disabled={updating}
            className="bg-chinese-red text-white px-5 py-2 rounded text-sm hover:bg-red-800 disabled:opacity-50 transition-colors"
          >
            {updating ? '处理中...' : statusInfo.nextLabel}
          </button>
        )}

        {order.status === 'PENDING' && (
          <button
            onClick={() => updateStatus('CANCELLED')}
            disabled={updating}
            className="ml-2 border border-gray-300 text-gray-600 px-5 py-2 rounded text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            取消订单
          </button>
        )}

        {message && (
          <p className="mt-3 text-sm">{message}</p>
        )}
      </div>

      {/* Payment info */}
      {order.stripePaymentIntentId && (
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-bold text-gray-700 mb-3">支付信息</h2>
          <div className="text-sm text-gray-600">
            <p>Payment Intent: <span className="font-mono">{order.stripePaymentIntentId}</span></p>
            <p>Session: <span className="font-mono">{order.stripeSessionId}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}
