import { MainLayout } from "@/components/layout/main-layout"
import { HeroSection } from "@/components/home/hero-section"
import { KnowledgeSection } from "@/components/home/knowledge-section"
import { SegmentSection } from "@/components/home/segment-section"
import { PreviewSections } from "@/components/home/preview-sections"

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <KnowledgeSection />
      <SegmentSection />
      <PreviewSections />
    </MainLayout>
  )
}
