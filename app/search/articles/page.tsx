import { MainLayout } from "@/components/layout/main-layout"
import SearchArticlesClient from "./client"

export default function SearchArticlesPage() {
  return (
    <MainLayout>
      <SearchArticlesClient />
    </MainLayout>
  )
}