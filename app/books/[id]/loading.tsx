import { Skeleton } from '@/components/ui/skeleton'
import { MainLayout } from '@/components/layout/main-layout'

export default function Loading() {
  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid lg:grid-cols-[350px_1fr] gap-8 lg:gap-12">
          <div className="sticky top-8">
            <Skeleton className="w-full aspect-[3/4] rounded-xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
