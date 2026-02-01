import { Suspense } from 'react'
import { MainLayout } from "@/components/layout/main-layout"
import SearchBooksClient from "./client"

export default function SearchBooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayout>
        <SearchBooksClient />
      </MainLayout>
    </Suspense>
  )
}