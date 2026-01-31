import { MainLayout } from "@/components/layout/main-layout"
import SearchBooksClient from "./client"

export default function SearchBooksPage() {
  return (
    <MainLayout>
      <SearchBooksClient />
    </MainLayout>
  )
}