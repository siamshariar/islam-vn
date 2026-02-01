import { Suspense } from 'react'
import { MainLayout } from "@/components/layout/main-layout"
import SearchVideosClient from "./client"

export default function SearchVideosPage() {
  return (
    <Suspense fallback={null}>
      <MainLayout>
        <SearchVideosClient />
      </MainLayout>
    </Suspense>
  )
}