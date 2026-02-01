import { Suspense } from 'react'
import { MainLayout } from "@/components/layout/main-layout"
import SearchQAClient from "./client"

export default function SearchQAPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayout>
        <SearchQAClient />
      </MainLayout>
    </Suspense>
  )
}