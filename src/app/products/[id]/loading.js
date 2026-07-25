import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductDetailLoading() {
  return (
    <div className="cloud-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="flex gap-2">
              <Skeleton className="w-16 h-16" />
              <Skeleton className="w-16 h-16" />
              <Skeleton className="w-16 h-16" />
            </div>
          </div>
          {/* Info skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-12 w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
