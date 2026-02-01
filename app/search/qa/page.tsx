import { Suspense } from 'react'
import { MainLayout } from "@/components/layout/main-layout"
import SearchQAClient from "./client"

export default function SearchQAPage() {
  return (
    <Suspense fallback={null}>
      <MainLayout>
        <SearchQAClient />
      </MainLayout>
    </Suspense>
  )
}