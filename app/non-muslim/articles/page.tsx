"use client"

import { SegmentArticleList } from "@/components/segment/segment-article-list"
import { nonMuslimArticles } from "@/lib/non-muslim-articles"

export default function NonMuslimArticlesPage() {
  return (
    <SegmentArticleList
      articles={nonMuslimArticles}
      title="Articles to Learn More About Islam"
      backHref="/non-muslim"
      backLabel="Back to Discover Islam"
      accent="gold"
      detailBasePath="/non-muslim/articles"
    />
  )
}
