import { Skeleton } from '@/components/ui/skeleton'
import { MainLayout } from '@/components/layout/main-layout'

export default function Loading() {
  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </MainLayout>
  )
}
