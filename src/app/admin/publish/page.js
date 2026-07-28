'use client'

import { useState, useEffect } from 'react'

export default function AdminPublish() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [maintenanceMsg, setMaintenanceMsg] = useState('网站正在更新中，请稍后再来访问。')
  const [result, setResult] = useState(null)

  const loadStatus = () => {
    setLoading(true)
    fetch('/api/admin/publish')
      .then(r => r.json())
      .then(data => {
        setStatus(data)
        if (data.maintenance?.message) setMaintenanceMsg(data.maintenance.message)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(loadStatus, [])

  const doAction = async (action, extra = {}) => {
    setPublishing(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      })
      const data = await res.json()
      setResult({ success: data.success || !data.error, data, action })
      if (data.success) loadStatus()
    } catch {
      setResult({ success: false, data: { error: '网络错误' }, action })
    }
    setPublishing(false)
  }

  if (loading) {
    return <div className="text-gray-500 py-12 text-center">加载中...</div>
  }

  const now = new Date()
  const lastPub = status?.lastPublishedAt ? new Date(status.lastPublishedAt) : null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">一键发布</h1>

      {/* Status card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700">网站状态</h2>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
            status?.maintenance?.enabled
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {status?.maintenance?.enabled ? '维护模式' : '正常运行'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">最近发布</p>
            <p className="text-gray-700 font-medium">
              {lastPub ? lastPub.toLocaleString('zh-CN') : '尚未发布'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Deploy Hook</p>
            <p className="text-gray-700 font-medium">
              {status?.vercelHookConfigured ? '✅ 已配置' : '❌ 未配置'}
            </p>
          </div>
        </div>
      </div>

      {/* Result notification */}
      {result && (
        <div className={`mb-6 p-4 rounded-lg border text-sm ${
          result.success
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <p className="font-medium mb-1">
            {result.action === 'publish' && (result.success ? '✅ 发布成功' : '❌ 发布失败')}
            {result.action === 'deploy' && (result.success ? '✅ 部署已触发' : '❌ 部署失败')}
            {result.action === 'maintenance-on' && '维护模式已开启'}
            {result.action === 'maintenance-off' && '维护模式已关闭'}
            {result.action === 'revalidate' && (result.success ? '✅ 缓存已清除' : '❌ 清除失败')}
          </p>
          {result.data?.results?.length > 0 && (
            <ul className="text-xs mt-1 space-y-0.5 opacity-75">
              {result.data.results.map((r, i) => (
                <li key={i}>
                  {r.revalidated && `已刷新: ${r.revalidated}`}
                  {r.maintenance === 'disabled' && '维护模式已自动关闭'}
                </li>
              ))}
            </ul>
          )}
          {!result.success && result.data?.error && (
            <p className="text-xs mt-1 opacity-75">{result.data.error}</p>
          )}
        </div>
      )}

      {/* One-click publish */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border-t-4 border-t-chinese-red">
        <h2 className="font-bold text-gray-700 mb-2">一键发布</h2>
        <p className="text-sm text-gray-500 mb-4">
          发布将执行以下操作：清除页面缓存、关闭维护模式、更新发布时间戳。
          若配置了 Vercel Deploy Hook，将同时触发重新部署。
        </p>
        <button onClick={() => doAction('publish')} disabled={publishing}
          className="bg-chinese-red text-white px-8 py-3 rounded-lg text-base hover:bg-red-800
            disabled:opacity-50 transition-colors font-medium flex items-center gap-2">
          {publishing ? (
            <>处理中...</>
          ) : (
            <>🚀 一键发布</>
          )}
        </button>
      </div>

      {/* Actions grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Maintenance mode */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-bold text-gray-700 mb-3">维护模式</h3>
          <p className="text-xs text-gray-400 mb-3">开启后前台显示维护页面，管理员可正常访问后台</p>
          {status?.maintenance?.enabled ? (
            <button onClick={() => doAction('maintenance-off')} disabled={publishing}
              className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700
                disabled:opacity-50 transition-colors">
              🔓 关闭维护模式
            </button>
          ) : (
            <>
              <textarea value={maintenanceMsg} onChange={e => setMaintenanceMsg(e.target.value)}
                rows={2} className="w-full border rounded px-3 py-2 text-xs mb-3 focus:outline-none
                  focus:ring-2 focus:ring-chinese-gold/50 focus:border-chinese-gold"
                placeholder="维护提示消息" />
              <button onClick={() => doAction('maintenance-on', { message: maintenanceMsg })}
                disabled={publishing}
                className="w-full bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600
                  disabled:opacity-50 transition-colors">
                🔒 开启维护模式
              </button>
            </>
          )}
        </div>

        {/* Vercel Deploy */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-bold text-gray-700 mb-3">Vercel 部署</h3>
          <p className="text-xs text-gray-400 mb-3">触发 Vercel 重新构建部署整个网站</p>
          {status?.vercelHookConfigured ? (
            <button onClick={() => doAction('deploy')} disabled={publishing}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black
                disabled:opacity-50 transition-colors">
              🔄 触发部署
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-700">
              未配置 Deploy Hook。请在 Vercel 项目设置中创建 Deploy Hook，
              并设为环境变量 <code className="bg-yellow-100 px-1 rounded">VERCEL_DEPLOY_HOOK_URL</code>
            </div>
          )}
        </div>

        {/* Revalidate cache */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-bold text-gray-700 mb-3">清除缓存</h3>
          <p className="text-xs text-gray-400 mb-3">清除 Next.js 页面缓存，立即生效</p>
          <button onClick={() => doAction('revalidate')} disabled={publishing}
            className="w-full bg-indigo-500 text-white px-4 py-2 rounded text-sm hover:bg-indigo-600
              disabled:opacity-50 transition-colors">
            🗑️ 清除缓存
          </button>
        </div>
      </div>
    </div>
  )
}
