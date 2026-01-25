"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Clock, Calendar, Tag } from "lucide-react"
import { articles } from "@/lib/articles"

export default function ArticleDetailPage() {
  const params = useParams()
  const id = params.id as string
  const article = articles.find((a) => a.id === id)
  if (!article) return <div>Article not found</div>

  return (
    <div
      className="px-4 lg:px-8 py-8"
    >
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <div
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald/10 text-emerald rounded-lg text-sm font-medium">
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

            <h1 className="text-4xl lg:text-5xl font-bold text-emerald mb-4 text-balance leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
          </div>

          {/* Feature Image */}
          {article.featureImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10"
            >
              <img
                src={article.featureImage || "/placeholder.svg"}
                alt={article.title}
                className="w-full aspect-[21/9] object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          )}

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg prose-emerald max-w-none"
          >
            {article.content.split("\n\n").map((paragraph, index) => {
              // Check if it's a heading
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-emerald mt-10 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-bold text-emerald mt-8 mb-3">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              }
              // Check if it's a list
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
              // Regular paragraph
              return (
                <p key={index} className="text-foreground leading-relaxed mb-6 text-pretty">
                  {paragraph}
                </p>
              )
            })}
          </motion.article>

          {/* Related Articles Section (Optional) */}
          <div
            className="mt-16 pt-8 border-t border-border"
          >
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              View all articles
            </Link>
          </div>
        </div>
      </div>
    )
}
