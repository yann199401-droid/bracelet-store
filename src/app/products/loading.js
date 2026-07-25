import { ProductGridSkeleton } from '@/components/ui/Skeleton'

export default function ProductsLoading() {
  return (
    <div className="cloud-bg min-h-screen">
      <section className="bg-chinese-ink py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-10 w-40 bg-gray-700 animate-pulse rounded" />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-4 chinese-border mb-8">
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}
