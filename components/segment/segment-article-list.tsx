"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"

interface SegmentArticle {
  id: string
  title: string
  readTime: string
  excerpt: string
  category: string
}

interface SegmentArticleListProps {
  articles: SegmentArticle[]
  title: string
  backHref: string
  backLabel: string
  accent: "emerald" | "gold"
  detailBasePath: string
}

export function SegmentArticleList({
  articles,
  title,
  backHref,
  backLabel,
  accent,
  detailBasePath,
}: SegmentArticleListProps) {
  return (
    <div className="px-4 lg:px-8 py-8">
      <Link
        href={backHref}
        className={`inline-flex items-center gap-2 mb-8 text-sm font-medium hover:underline ${
          accent === "emerald" ? "text-emerald" : "text-gold"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <h1 className={`text-3xl font-bold mb-8 ${accent === "emerald" ? "text-emerald" : "text-gold"}`}>{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <CardWrapper key={article.id}>
            <Link href={`${detailBasePath}/${article.id}`} className="block p-5 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    accent === "emerald" ? "bg-emerald/10" : "bg-gold/10"
                  }`}
                >
                  <FileText className={`w-6 h-6 ${accent === "emerald" ? "text-emerald" : "text-gold"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime} read</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          </CardWrapper>
        ))}
      </div>
    </div>
  )
}
