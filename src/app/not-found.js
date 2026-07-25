import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="cloud-bg min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-24 h-24 border-2 border-chinese-gold/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-chinese-gold text-5xl font-serif">404</span>
        </div>
        <h1 className="text-2xl font-serif text-chinese-ink mb-2">此页未找到</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          您寻找的页面可能已被移除、名称变更，或暂时不可用。
        </p>
        <div className="w-16 h-0.5 bg-chinese-gold/50 mx-auto mb-8" />
        <Link href="/" className="chinese-btn-primary">
          返回首页
        </Link>
      </div>
    </div>
  )
}
