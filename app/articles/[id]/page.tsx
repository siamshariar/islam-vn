"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Clock, Calendar, Tag } from "lucide-react"
import { articles } from "@/lib/articles"
import { newMuslimArticles } from "@/lib/new-muslim-articles"

const SCROLL_RESTORE_FLAG = "articles_scroll_restore_flag"

// Combine all articles for instant lookup
const allArticles = [...articles, ...newMuslimArticles]

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  // Try to get article instantly from cache or local data
  const [article, setArticle] = useState<any>(() => {
    // Check sessionStorage cache first
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(`article_${id}`)
      if (cached) {
        try {
          return JSON.parse(cached)
        } catch (e) {
          // ignore
        }
      }
    }
    
    // Check local data
    const localArticle = allArticles.find(a => a.id === id)
    if (localArticle) return localArticle
    
    return null
  })
  
  const [isLoading, setIsLoading] = useState(!article)
  const [error, setError] = useState(false)
  const [contentVisible, setContentVisible] = useState(!!article)

  // Force scroll to top on mount - instant
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    
    const prevScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    
    // Instant scroll to top - no animation
    document.documentElement.style.scrollBehavior = "auto"
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    return () => {
      window.history.scrollRestoration = prevScrollRestoration
      document.documentElement.style.scrollBehavior = ""
    }
  }, [])

  // Fetch article data if not available locally
  useEffect(() => {
    if (article) {
      setIsLoading(false)
      setContentVisible(true)
      return
    }
    
    if (!id) return
    
    let isCancelled = false
    
    const fetchArticle = async () => {
      setIsLoading(true)
      setError(false)
      
      try {
        // Try local lookup first
        const localArticle = allArticles.find(a => a.id === id)
        if (localArticle && !isCancelled) {
          setArticle(localArticle)
          setIsLoading(false)
          setContentVisible(true)
          // Cache for future
          sessionStorage.setItem(`article_${id}`, JSON.stringify(localArticle))
          return
        }
        
        // Fetch from API
        const res = await fetch(`/api/articles/${id}`)
        if (!res.ok) throw new Error('Article not found')
        const data = await res.json()
        
        if (!isCancelled) {
          setArticle(data)
          setIsLoading(false)
          setContentVisible(true)
          // Cache for future
          sessionStorage.setItem(`article_${id}`, JSON.stringify(data))
        }
      } catch (err) {
        console.error("Error fetching article:", err)
        if (!isCancelled) {
          setError(true)
          setIsLoading(false)
        }
      }
    }
    
    fetchArticle()
    
    return () => {
      isCancelled = true
    }
  }, [id])

  // Handle back navigation
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Set restore flag so articles list knows to restore position
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    
    // Use browser back if available
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/articles')
    }
  }

  // Error state
  if (error || (!article && !isLoading)) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link
            href="/articles"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-emerald hover:underline mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="mx-auto">
        {/* Back button - always visible */}
        <Link
          href="/articles"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-emerald hover:underline mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        {/* Show content immediately if available, otherwise show minimal loading */}
        {article ? (
          <>
            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
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
            </motion.div>

            {/* Feature Image */}
            {article.featureImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="mb-10"
              >
                <img
                  src={article.featureImage}
                  alt={article.title}
                  className="w-full aspect-[24/9] object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </motion.div>
            )}

            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="prose prose-lg prose-emerald max-w-none"
            >
              {article.content.split("\n\n").map((paragraph: string, index: number) => {
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
            </motion.article>

            {/* Bottom navigation */}
            <div className="mt-16 pt-8 border-t border-border">
              <a
                href="/articles"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                View all articles
              </a>
            </div>
          </>
        ) : (
          /* Minimal loading - only shows if data isn't available instantly */
          <div className="animate-pulse">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="h-8 w-24 bg-muted rounded-lg" />
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-5 w-24 bg-muted rounded" />
            </div>
            <div className="h-12 w-3/4 bg-muted rounded mb-4" />
            <div className="h-6 w-full bg-muted rounded mb-2" />
            <div className="h-6 w-2/3 bg-muted rounded mb-8" />
            <div className="aspect-[21/9] bg-muted rounded-2xl mb-10" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}