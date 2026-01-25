import { MainLayout } from "@/components/layout/main-layout"

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}