import { MainLayout } from "@/components/layout/main-layout"

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}