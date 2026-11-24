'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminReferralsPage() {
  const [records, setRecords] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/admin/referrals', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load referral commissions')
        return response.json()
      })
      .then(setRecords)
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [])

  return (
    <section>
      <h1 className="mb-4 text-2xl text-stone-900">邀请佣金</h1>
      <p className="mb-4 text-sm text-stone-700">核对订单、退款及邀请资格后再安排结算。</p>
      {!records ? (
        <p role="status">{error ? '暂时无法加载记录。' : '加载中…'}</p>
      ) : records.length === 0 ? (
        <p>暂无佣金记录。</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white">
          <table className="w-full text-left text-sm text-stone-900">
            <thead>
              <tr className="border-b">
                {['推荐人 ID', '订单', '待核对佣金', '付款时间'].map((label) => (
                  <th key={label} scope="col" className="p-3">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.orderId} className="border-b">
                  <td className="p-3">{record.referrerId}</td>
                  <td className="p-3"><Link href={`/admin/orders/${record.orderId}`} className="timing-link">#{record.orderId}</Link></td>
                  <td className="p-3">US${(record.amountCents / 100).toFixed(2)}</td>
                  <td className="p-3">{new Date(record.paidAt).toLocaleString('zh-CN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
