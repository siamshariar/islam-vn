import { Suspense } from 'react'
import { MainLayout } from "@/components/layout/main-layout"
import SearchMasjidClient from "./client"

export default function SearchMasjidPage() {
  return (
    <Suspense fallback={null}>
      <MainLayout>
        <SearchMasjidClient />
      </MainLayout>
    </Suspense>
  )
}