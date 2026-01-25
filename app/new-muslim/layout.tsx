import { MainLayout } from "@/components/layout/main-layout"

export default function NewMuslimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}