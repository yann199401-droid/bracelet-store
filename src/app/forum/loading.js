import { Skeleton } from '@/components/ui/Skeleton'

export default function ForumLoading() {
  return (
    <div className="cloud-bg min-h-screen">
      <section className="bg-chinese-ink py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Skeleton className="h-10 w-40 bg-gray-700" />
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="chinese-card">
            <div className="bg-chinese-ink-light px-6 py-4">
              <Skeleton className="h-5 w-40 bg-gray-600" />
              <Skeleton className="h-3 w-60 bg-gray-600 mt-2" />
            </div>
            <div className="divide-y divide-chinese-gold/10">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="px-6 py-3.5">
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                  <Skeleton className="h-3 w-1/3 bg-gray-200 mt-2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
