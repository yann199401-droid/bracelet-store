'use client'

import { useState, useEffect } from 'react'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(28)
  const [activeTab, setActiveTab] = useState('ga4')

  const loadData = () => {
    setLoading(true)
    fetch(`/api/admin/analytics?days=${days}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [days])

  const maxUsers = data?.ga4?.overview?.dateSeries
    ? Math.max(...data.ga4.overview.dateSeries.map(d => d.users), 1)
    : 1

  const maxSourceUsers = data?.ga4?.trafficSources
    ? Math.max(...data.ga4.trafficSources.map(s => s.users), 1)
    : 1

  const maxScClicks = data?.searchConsole?.topQueries
    ? Math.max(...data.searchConsole.topQueries.map(q => q.clicks), 1)
    : 1

  const formatDuration = (sec) => {
    if (!sec) return '0s'
    const m = Math.floor(sec / 60)
    const s = Math.round(sec % 60)
    return m > 0 ? `${m}m${s}s` : `${s}s`
  }

  const formatNumber = (n) => {
    if (!n) return '0'
    if (n >= 10000) return (n / 10000).toFixed(1) + '万'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return n.toLocaleString()
  }

  if (loading) {
    return <div className="text-gray-500 py-12 text-center">加载数据中...</div>
  }

  // Not configured
  if (data && !data.configured) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">数据面板</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">Google Analytics 尚未配置</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
            请先在 Google Cloud Console 创建服务账号，启用 Analytics Data API 和 Search Console API，
            并将服务账号添加到 GA4 和 Search Console 中。
          </p>
          <div className="bg-gray-50 border rounded p-4 text-left text-sm space-y-2 max-w-xl mx-auto">
            <p className="font-medium text-gray-700">环境变量配置：</p>
            <code className="block text-xs text-gray-600 bg-white p-2 rounded border">
{`GA4_PROPERTY_ID=properties/123456789
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
SEARCH_CONSOLE_SITE_URL=https://myzenbeads.com`}
            </code>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (data?.error && !data?.ga4 && !data?.searchConsole) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">数据面板</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">数据加载失败</h2>
          <p className="text-red-500 text-sm">{data.error}</p>
          <button onClick={loadData}
            className="mt-4 bg-chinese-red text-white px-4 py-2 rounded text-sm hover:bg-red-800 transition-colors">
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const ga4 = data?.ga4
  const sc = data?.searchConsole

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">数据面板</h1>
        <div className="flex gap-1">
          {[7, 28, 90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${days === d
                ? 'bg-chinese-red text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              近{d}天
            </button>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-4 mb-6 border-b">
        <button onClick={() => setActiveTab('ga4')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ga4'
            ? 'border-chinese-red text-chinese-red'
            : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Google Analytics
        </button>
        <button onClick={() => setActiveTab('sc')}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sc'
            ? 'border-chinese-red text-chinese-red'
            : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Search Console
        </button>
      </div>

      {activeTab === 'ga4' && ga4?.overview && (
        <>
          {/* GA4 Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: '活跃用户', value: formatNumber(ga4.overview.totals.activeUsers), color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: '页面浏览', value: formatNumber(ga4.overview.totals.screenPageViews), color: 'bg-green-50 text-green-700 border-green-200' },
              { label: '会话数', value: formatNumber(ga4.overview.totals.sessions), color: 'bg-purple-50 text-purple-700 border-purple-200' },
              { label: '新用户', value: formatNumber(ga4.overview.totals.newUsers), color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
              { label: '跳出率', value: ga4.overview.totals.bounceRate + '%', color: 'bg-orange-50 text-orange-700 border-orange-200' },
              { label: '平均时长', value: formatDuration(ga4.overview.totals.avgDuration), color: 'bg-teal-50 text-teal-700 border-teal-200' },
            ].map(card => (
              <div key={card.label} className={`rounded-lg border p-3 ${card.color}`}>
                <p className="text-xs opacity-70 mb-1">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Daily trend chart */}
          {ga4.overview.dateSeries.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3">每日活跃用户趋势</h3>
              <div className="flex items-end gap-[2px] h-32 overflow-x-auto">
                {ga4.overview.dateSeries.map((d, i) => (
                  <div key={i} className="flex-1 min-w-[8px] flex flex-col items-center group relative">
                    <div className="w-full bg-chinese-red/20 rounded-t relative"
                      style={{ height: `${(d.users / maxUsers) * 100}%`, minHeight: d.users > 0 ? '4px' : '0' }}>
                      <div className="w-full bg-chinese-red/60 rounded-t"
                        style={{ height: `${Math.min(100, (d.users / maxUsers) * 100)}%` }} />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px]
                      px-2 py-1 rounded whitespace-nowrap z-10">
                      {d.date.slice(5)}: {d.users} 用户
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traffic sources + Top pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Traffic sources */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">流量来源</h3>
              {ga4.trafficSources?.length > 0 ? (
                <div className="space-y-2">
                  {ga4.trafficSources.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-3 text-right">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-700 truncate max-w-[140px]">{s.source || '(direct)'}</span>
                          <span className="text-xs text-gray-400">{formatNumber(s.users)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-chinese-red rounded-full h-1.5 transition-all"
                            style={{ width: `${(s.users / maxSourceUsers) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs py-4 text-center">暂无流量来源数据</p>
              )}
            </div>

            {/* GA4 Top pages */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">热门页面</h3>
              {ga4.topPages?.length > 0 ? (
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {ga4.topPages.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-600 truncate flex-1">{p.path}</span>
                      <span className="text-xs text-gray-400 ml-2 w-16 text-right">{formatNumber(p.pageViews)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs py-4 text-center">暂无页面数据</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'ga4' && !ga4?.overview && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          Google Analytics 数据不可用，请检查配置
        </div>
      )}

      {activeTab === 'sc' && (
        <>
          {/* Search Console metric cards */}
          {sc?.performance?.totals && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: '总点击', value: formatNumber(sc.performance.totals.clicks), color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: '总展示', value: formatNumber(sc.performance.totals.impressions), color: 'bg-green-50 text-green-700 border-green-200' },
                { label: '平均 CTR', value: sc.performance.totals.ctr + '%', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { label: '平均排名', value: sc.performance.totals.position, color: 'bg-orange-50 text-orange-700 border-orange-200' },
              ].map(card => (
                <div key={card.label} className={`rounded-lg border p-3 ${card.color}`}>
                  <p className="text-xs opacity-70 mb-1">{card.label}</p>
                  <p className="text-xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Top queries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">热门搜索词</h3>
              {sc?.topQueries?.length > 0 ? (
                <div className="space-y-2">
                  {sc.topQueries.map((q, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-3 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-gray-700 truncate">{q.query}</span>
                          <span className="text-xs text-gray-400 ml-2">{q.clicks} / {formatNumber(q.impressions)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span>CTR {q.ctr}%</span>
                          <span>·</span>
                          <span>排名 {q.position}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                          <div className="bg-chinese-red rounded-full h-1 transition-all"
                            style={{ width: `${(q.clicks / maxScClicks) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs py-4 text-center">暂无搜索词数据</p>
              )}
            </div>

            {/* Search Console top pages */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">搜索表现最佳页面</h3>
              {sc?.topPages?.length > 0 ? (
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  <div className="flex items-center text-[10px] text-gray-400 pb-1 border-b">
                    <span className="flex-1">页面</span>
                    <span className="w-10 text-right">点击</span>
                    <span className="w-14 text-right">展示</span>
                    <span className="w-10 text-right">CTR</span>
                    <span className="w-10 text-right">排名</span>
                  </div>
                  {sc.topPages.map((p, i) => (
                    <div key={i} className="flex items-center text-xs py-1.5 border-b border-gray-50 last:border-0">
                      <span className="flex-1 truncate text-gray-600">{p.page}</span>
                      <span className="w-10 text-right text-gray-500">{p.clicks}</span>
                      <span className="w-14 text-right text-gray-500">{formatNumber(p.impressions)}</span>
                      <span className="w-10 text-right text-gray-500">{p.ctr}%</span>
                      <span className="w-10 text-right text-gray-500">{p.position}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs py-4 text-center">暂无搜索页面数据</p>
              )}
            </div>
          </div>

          {!sc?.performance?.totals && !sc?.topQueries && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
              Search Console 数据不可用，请检查配置
            </div>
          )}
        </>
      )}
    </div>
  )
}
