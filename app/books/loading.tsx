import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="px-4 lg:px-8 py-8">
      {/* Back button skeleton */}
      <Skeleton className="h-6 w-32 mb-6" />

      <div className="grid lg:grid-cols-[350px_1fr] gap-8 lg:gap-12">
        {/* Book cover skeleton */}
        <div>
          <Skeleton className="w-full aspect-[3/4] rounded-xl" />
        </div>

        {/* Book details skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
