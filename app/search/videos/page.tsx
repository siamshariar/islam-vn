import { MainLayout } from "@/components/layout/main-layout"
import SearchVideosClient from "./client"

export default function SearchVideosPage() {
  return (
    <MainLayout>
      <SearchVideosClient />
    </MainLayout>
  )
}