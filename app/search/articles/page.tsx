import { Suspense } from 'react'
import { MainLayout } from "@/components/layout/main-layout"
import SearchArticlesClient from "./client"

export default function SearchArticlesPage() {
  return (
    <Suspense fallback={null}>
      <MainLayout>
        <SearchArticlesClient />
      </MainLayout>
    </Suspense>
  )
}