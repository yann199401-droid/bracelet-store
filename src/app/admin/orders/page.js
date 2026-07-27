'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATUS_LABELS = {
  PENDING: '待付款',
  PAID: '已付款',
  SHIPPED: '已发货',
  CANCELLED: '已取消',
}

const STATUS_COLORS = {
  PENDING: 'text-yellow-600 bg-yellow-50',
  PAID: 'text-green-600 bg-green-50',
  SHIPPED: 'text-purple-600 bg-purple-50',
  CANCELLED: 'text-gray-500 bg-gray-100',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    setLoading(true)
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
        <button
          onClick={loadOrders}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ↻ 刷新
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          暂无订单
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="px-4 py-3 font-medium text-gray-600">订单号</th>
                <th className="px-4 py-3 font-medium text-gray-600">客户</th>
                <th className="px-4 py-3 font-medium text-gray-600">金额</th>
                <th className="px-4 py-3 font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 font-medium text-gray-600">日期</th>
                <th className="px-4 py-3 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">#{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                    {order.discount > 0 && (
                      <span className="text-xs text-green-500 ml-1">(-${order.discount})</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[order.status] || ''}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-chinese-red hover:text-red-700 text-xs font-medium"
                    >
                      详情 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
