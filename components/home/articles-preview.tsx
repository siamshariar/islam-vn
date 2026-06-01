"use client"

import Link from "next/link"
import { Clock, ChevronRight, FileText } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { articles } from "@/lib/articles"
import { newMuslimArticles } from "@/lib/new-muslim-articles"

// Combine and deduplicate articles
const allArticles = (() => {
  const seen = new Set<string>()
  return [...articles, ...newMuslimArticles].filter(article => {
    if (seen.has(article.id)) return false
    seen.add(article.id)
    return true
  })
})()

// Get latest 4 articles
const latestArticles = allArticles.slice(0, 4)

export function ArticlesPreview() {
  return (
    <section className="px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald mb-2">Latest Articles</h2>
          <p className="text-muted-foreground">Read and learn from our collection of Islamic articles</p>
        </div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 font-medium transition-colors"
        >
          View All Articles
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestArticles.map((article) => (
          <CardWrapper key={article.id}>
            <Link href={`/articles/${article.id}`} className="block h-full group">
              {article.featureImage && (
                <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                  <img
                    src={article.featureImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-emerald/10 text-emerald rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-3 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-emerald font-medium text-xs group-hover:gap-1 transition-all">
                  Read more
                  <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </Link>
          </CardWrapper>
        ))}
      </div>
    </section>
  )
}