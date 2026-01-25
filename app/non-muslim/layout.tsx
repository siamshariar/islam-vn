import { MainLayout } from "@/components/layout/main-layout"

export default function NonMuslimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}