import { MainLayout } from "@/components/layout/main-layout"

export default function QALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}