import { MainLayout } from "@/components/layout/main-layout"

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}