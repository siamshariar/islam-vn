"use client"

import { useParams } from "next/navigation"
import { SegmentArticleDetail } from "@/components/segment/segment-article-detail"
import { newMuslimArticles } from "@/lib/new-muslim-articles"

export default function NewMuslimArticleDetailPage() {
  const params = useParams()
  const id = params.id as string
  const article = newMuslimArticles.find((a) => a.id === id)

  return (
    <SegmentArticleDetail
      article={article}
      backHref="/new-muslim/articles"
      backLabel="Back to Articles"
      accent="emerald"
    />
  )
}
