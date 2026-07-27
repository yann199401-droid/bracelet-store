'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(orders => {
        if (!Array.isArray(orders)) return
        setStats({
          total: orders.length,
          pending: orders.filter(o => o.status === 'PENDING').length,
          paid: orders.filter(o => o.status === 'PAID').length,
          shipped: orders.filter(o => o.status === 'SHIPPED').length,
          cancelled: orders.filter(o => o.status === 'CANCELLED').length,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">管理概览</h1>

      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="总订单" value={stats.total} color="bg-blue-500" />
          <StatCard label="待付款" value={stats.pending} color="bg-yellow-500" />
          <StatCard label="已付款" value={stats.paid} color="bg-green-500" />
          <StatCard label="已发货" value={stats.shipped} color="bg-purple-500" />
        </div>
      ) : (
        <p className="text-gray-500">加载中...</p>
      )}

      <div className="mt-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 bg-chinese-red text-white px-5 py-2.5 rounded hover:bg-red-800 transition-colors text-sm"
        >
          查看所有订单 →
        </Link>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        <strong>提示：</strong>订单状态说明 — PENDING（待付款）→ PAID（已付款）→ SHIPPED（已发货）
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className={`w-3 h-3 rounded-full ${color} mb-2`} />
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  )
}
