import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button skeleton */}
        <Skeleton className="h-6 w-32 mb-8" />

        {/* Article header skeleton */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Article content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
