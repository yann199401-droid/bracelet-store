import { Skeleton } from '@/components/ui/Skeleton'

export default function CheckoutLoading() {
  return (
    <div className="cloud-bg min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
