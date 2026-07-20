"use client"

import { useParams } from "next/navigation"
import { SegmentArticleDetail } from "@/components/segment/segment-article-detail"
import { nonMuslimArticles } from "@/lib/non-muslim-articles"

export default function NonMuslimArticleDetailPage() {
  const params = useParams()
  const id = params.id as string
  const article = nonMuslimArticles.find((a) => a.id === id)

  return (
    <SegmentArticleDetail article={article} backHref="/non-muslim/articles" backLabel="Back to Articles" accent="gold" />
  )
}
