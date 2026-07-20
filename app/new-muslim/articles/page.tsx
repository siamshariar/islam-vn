"use client"

import { SegmentArticleList } from "@/components/segment/segment-article-list"
import { newMuslimArticles } from "@/lib/new-muslim-articles"

export default function NewMuslimArticlesPage() {
  return (
    <SegmentArticleList
      articles={newMuslimArticles}
      title="Helpful Articles for New Muslims"
      backHref="/new-muslim"
      backLabel="Back to New Muslim"
      accent="emerald"
      detailBasePath="/new-muslim/articles"
    />
  )
}
