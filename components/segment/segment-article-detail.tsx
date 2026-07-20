"use client"

import { useLayoutEffect } from "react"
import Link from "next/link"
import { Calendar, ChevronLeft, Clock, Tag } from "lucide-react"

interface SegmentArticleDetailItem {
  id: string
  title: string
  category: string
  readTime: string
  publishedDate: string
  excerpt: string
  featureImage: string
  content: string
}

interface SegmentArticleDetailProps {
  article: SegmentArticleDetailItem | undefined
  backHref: string
  backLabel: string
  accent: "emerald" | "gold"
}

export function SegmentArticleDetail({ article, backHref, backLabel, accent }: SegmentArticleDetailProps) {
  const accentText = accent === "emerald" ? "text-emerald" : "text-gold"
  const accentBg = accent === "emerald" ? "bg-emerald/10" : "bg-gold/10"

  useLayoutEffect(() => {
    if (typeof window === "undefined") return
    window.scrollTo(0, 0)
  }, [])

  if (!article) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link href={backHref} className={`inline-flex items-center gap-2 hover:underline mb-6 ${accentText}`}>
            <ChevronLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="mx-auto">
        <Link href={backHref} className={`inline-flex items-center gap-2 hover:underline mb-8 ${accentText}`}>
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${accentBg} ${accentText}`}
            >
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedDate}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} read
            </span>
          </div>

          <h1 className={`text-4xl lg:text-5xl font-bold mb-4 text-balance leading-tight ${accentText}`}>
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
        </div>

        {article.featureImage && (
          <div className="mb-10">
            <img
              src={article.featureImage}
              alt={article.title}
              className="w-full aspect-[24/9] object-cover rounded-2xl shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        )}

        <article className={`prose prose-lg max-w-none ${accent === "emerald" ? "prose-emerald" : ""}`}>
          {article.content.split("\n\n").map((paragraph: string, index: number) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className={`text-2xl font-bold mt-10 mb-4 ${accentText}`}>
                  {paragraph.replace("## ", "")}
                </h2>
              )
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className={`text-xl font-bold mt-8 mb-3 ${accentText}`}>
                  {paragraph.replace("### ", "")}
                </h3>
              )
            }
            if (paragraph.includes("\n- ")) {
              const items = paragraph.split("\n- ").filter((item) => item.trim())
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 my-6">
                  {items.map((item, i) => (
                    <li key={i} className="text-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={index} className="text-foreground leading-relaxed mb-6 text-pretty">
                {paragraph}
              </p>
            )
          })}
        </article>

        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href={backHref}
            className={`inline-flex items-center gap-2 hover:opacity-80 transition-opacity font-semibold ${accentText}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
