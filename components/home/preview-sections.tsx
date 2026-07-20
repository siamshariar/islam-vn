"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Play, BookOpen, ChevronRight, Loader2, HelpCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { CardSlider } from "@/components/ui/card-slider"
import { Button } from "@/components/ui/button"
import VideoModalHome from "@/components/modal/VideoModalHome"
import { motion, AnimatePresence } from "framer-motion"
import { books } from "@/lib/books"
import { nonMuslimBooks } from "@/lib/non-muslim-books"
import { newMuslimBooks } from "@/lib/new-muslim-books"
import { articles } from "@/lib/articles"
import { newMuslimArticles } from "@/lib/new-muslim-articles"
import { qaItems } from "@/lib/qa"
import { YouTubeVideo } from "@/lib/youtube-api"

// Combine and deduplicate all books
const allBooks = (() => {
  const seen = new Set<string>()
  const seenTitle = new Set<string>()
  return [...books, ...nonMuslimBooks, ...newMuslimBooks].filter(book => {
    if (seen.has(book.id)) return false
    const titleKey = book.title.toLowerCase().trim()
    if (seenTitle.has(titleKey)) return false
    seen.add(book.id)
    seenTitle.add(titleKey)
    return true
  })
})()

// Combine and deduplicate all articles
const allArticles = (() => {
  const seen = new Set<string>()
  const seenTitle = new Set<string>()
  return [...articles, ...newMuslimArticles].filter(article => {
    if (seen.has(article.id)) return false
    const titleKey = article.title.toLowerCase().trim()
    if (seenTitle.has(titleKey)) return false
    seen.add(article.id)
    seenTitle.add(titleKey)
    return true
  })
})()

// Get articles - first from "Evidence Islam is Truth" category, then others
const HOME_ARTICLES_COUNT = 8

const getLatestArticles = () => {
  const selectedArticles: typeof allArticles = []

  const evidenceArticles = allArticles.filter(a => a.category === "Evidence Islam is Truth")

  for (const article of evidenceArticles) {
    if (selectedArticles.length >= HOME_ARTICLES_COUNT) break
    selectedArticles.push(article)
  }

  if (selectedArticles.length < HOME_ARTICLES_COUNT) {
    const selectedIds = new Set(selectedArticles.map(a => a.id))
    const seenCategories = new Set<string>()
    seenCategories.add("Evidence Islam is Truth")

    for (const article of allArticles) {
      if (selectedArticles.length >= HOME_ARTICLES_COUNT) break
      if (!selectedIds.has(article.id) && !seenCategories.has(article.category)) {
        seenCategories.add(article.category)
        selectedArticles.push(article)
        selectedIds.add(article.id)
      }
    }
  }

  if (selectedArticles.length < HOME_ARTICLES_COUNT) {
    const selectedIds = new Set(selectedArticles.map(a => a.id))
    for (const article of allArticles) {
      if (selectedArticles.length >= HOME_ARTICLES_COUNT) break
      if (!selectedIds.has(article.id)) {
        selectedArticles.push(article)
        selectedIds.add(article.id)
      }
    }
  }

  return selectedArticles.slice(0, HOME_ARTICLES_COUNT)
}

// Deduplicate Q&A items
const uniqueQA = (() => {
  const seen = new Set<string>()
  const seenQuestion = new Set<string>()
  return qaItems.filter(item => {
    if (seen.has(item.id)) return false
    const qKey = item.question.toLowerCase().trim()
    if (seenQuestion.has(qKey)) return false
    seen.add(item.id)
    seenQuestion.add(qKey)
    return true
  })
})()

// Get 4 Q&A items from different categories
const getLatestQA = () => {
  const seenCategories = new Set<string>()
  const selectedQA: typeof uniqueQA = []
  
  for (const item of uniqueQA) {
    if (selectedQA.length >= 4) break
    if (!seenCategories.has(item.category)) {
      seenCategories.add(item.category)
      selectedQA.push(item)
    }
  }
  
  if (selectedQA.length < 4) {
    const selectedIds = new Set(selectedQA.map(a => a.id))
    for (const item of uniqueQA) {
      if (selectedQA.length >= 4) break
      if (!selectedIds.has(item.id)) {
        selectedQA.push(item)
        selectedIds.add(item.id)
      }
    }
  }
  
  return selectedQA.slice(0, 4)
}

const formatCategory = (category: string) => {
  return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function BookCover({ title, author, color, thumbnail }: { title: string; author: string; color: string; thumbnail?: string | null }) {
  const isActualThumbnail = thumbnail && thumbnail !== "https://islamhouse.com/logo_IslamHouse.jpg";
  return (
    <div className={`aspect-[3/4] bg-gradient-to-br ${color} p-5 flex flex-col justify-between rounded-t-2xl relative overflow-hidden`}>
      {isActualThumbnail && (
        <div className="absolute inset-0">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover rounded-t-2xl" />
          <div className="absolute inset-0 bg-black/20 rounded-t-2xl" />
        </div>
      )}
      {!isActualThumbnail && (
        <>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
        </>
      )}
      <div className="relative z-10">
        {!isActualThumbnail && <div className="w-10 h-1.5 bg-white/40 rounded-full mb-4" />}
        {!isActualThumbnail && <BookOpen className="w-8 h-8 text-white/60 mb-3" />}
      </div>
      <div className="relative z-10">
        <h3 className={`font-bold text-base leading-tight mb-2 line-clamp-3 ${isActualThumbnail ? 'text-white drop-shadow-lg' : 'text-white'}`}>{title}</h3>
        <p className={`text-sm line-clamp-1 ${isActualThumbnail ? 'text-white drop-shadow-lg' : 'text-white/80'}`}>{author}</p>
      </div>
    </div>
  )
}

export function PreviewSections() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [expandedQAId, setExpandedQAId] = useState<string | null>(null)

  const featuredArticles = getLatestArticles()
  const featuredQA = getLatestQA()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const videoId = urlParams.get('video')
    if (videoId && videos.length > 0) {
      const video = videos.find(v => v.id === videoId)
      if (video) setSelectedVideo(video)
    }
  }, [videos])

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/videos?maxResults=8&page=1', {
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos)
        } else {
          setVideos([])
        }
      } catch (err) {
        console.warn('Failed to load videos:', err)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [])

  return (
    <div className="py-8">

      {/* ============================================ */}
      {/* 1. VIDEOS SECTION */}
      {/* ============================================ */}
      <section className="relative overflow-hidden py-12 px-4 lg:px-8 rounded-3xl mx-4 lg:mx-8 mb-8 bg-gradient-to-br from-emerald/5 to-emerald/10">
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <Sparkles className="w-20 h-20 text-emerald" />
        </div>
        <SectionHeader title="Videos" />
        {loading ? (
          <CardSlider className="gap-4" scrollAmount={296}>
            {[...Array(8)].map((_, index) => (
              <CardWrapper key={index} className="flex-shrink-0 w-[260px] sm:w-[280px]">
                <div className="aspect-video bg-muted animate-pulse rounded-lg flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald" />
                </div>
                <div className="p-4">
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </CardWrapper>
            ))}
          </CardSlider>
        ) : videos.length > 0 ? (
          <CardSlider className="gap-4" scrollAmount={296} viewAllHref="/videos" viewAllText="View All Videos">
            {videos.map((video, index) => (
              <CardWrapper key={video.id} className="flex-shrink-0 w-[260px] sm:w-[280px]">
                <button type="button" onClick={() => {
                  setSelectedVideo(video)
                  const newUrl = new URL(window.location.href)
                  newUrl.searchParams.set('video', video.id)
                  window.history.pushState({}, '', newUrl.toString())
                }} className="w-full text-left cursor-pointer">
                  <div className="relative aspect-video">
                    <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-emerald fill-emerald ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-xs text-white">{video.duration}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{video.viewCount} views</span>
                      <span>{video.channelTitle}</span>
                    </div>
                  </div>
                </button>
              </CardWrapper>
            ))}
          </CardSlider>
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-2xl">
            <Play className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No videos available at the moment</p>
            <Link href="/videos" className="text-emerald text-sm font-medium hover:underline mt-2 inline-block">Browse video library</Link>
          </div>
        )}
      </section>

      {/* ============================================ */}
      {/* 2. ARTICLES SECTION */}
      {/* ============================================ */}
      <section className="relative overflow-hidden py-12 px-4 lg:px-8 rounded-3xl mx-4 lg:mx-8 mb-8 bg-gradient-to-br from-gold/5 to-orange/10">
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <Sparkles className="w-20 h-20 text-gold" />
        </div>
        <SectionHeader title="Latest Articles" />
        <CardSlider className="gap-4" scrollAmount={296} viewAllHref="/articles" viewAllText="View All Articles">
          {featuredArticles.map((article: any, index: number) => (
            <CardWrapper key={article.id} className="flex-shrink-0 w-[260px] sm:w-[280px]">
              <Link href={`/articles/${article.id}`} className="block h-full group">
                {article.featureImage && (
                  <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                    <img src={article.featureImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-emerald/10 text-emerald rounded-full text-xs font-medium">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald transition-colors">{article.title}</h3>
                  <p className="text-gray-600 text-xs line-clamp-3 mb-3">{article.excerpt}</p>
                  <div className="flex items-center text-emerald font-medium text-xs group-hover:gap-1 transition-all">
                    Read more <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            </CardWrapper>
          ))}
        </CardSlider>
      </section>

      {/* ============================================ */}
      {/* 3. BOOKS SECTION */}
      {/* ============================================ */}
      <section className="relative overflow-hidden py-12 px-4 lg:px-8 rounded-3xl mx-4 lg:mx-8 mb-8 bg-gradient-to-br from-emerald/5 via-gold/5 to-orange/5">
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <Sparkles className="w-20 h-20 text-orange" />
        </div>
        <SectionHeader title="Books" />
        <CardSlider className="gap-4" scrollAmount={200} viewAllHref="/books" viewAllText="View All Books">
          {allBooks.slice(0, 8).map((book, index) => (
            <CardWrapper key={book.id} className="flex-shrink-0 w-[160px] sm:w-[190px]">
              <Link href={`/books/${book.id}`}>
                <BookCover title={book.title} author={book.author} color={book.color} thumbnail={book.thumbnail} />
              </Link>
              <div className="p-3">
                <span className="text-xs text-muted-foreground">{book.pages} pages</span>
              </div>
            </CardWrapper>
          ))}
        </CardSlider>
      </section>

      {/* ============================================ */}
      {/* 4. Q&A SECTION - Fixed: cards stay in position when expanded */}
      {/* ============================================ */}
      <section className="relative overflow-hidden py-12 px-4 lg:px-8 rounded-3xl mx-4 lg:mx-8 mb-8 bg-gradient-to-br from-emerald/5 to-gold/10">
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <Sparkles className="w-20 h-20 text-emerald" />
        </div>
        <SectionHeader title="Questions & Answers" />
        {/* Using CSS columns for better layout when items expand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {featuredQA.map((item, index) => (
            <CardWrapper key={item.id} delay={index * 0.1}>
              <button 
                onClick={() => setExpandedQAId(expandedQAId === item.id ? null : item.id)} 
                className="w-full text-left p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HelpCircle className="w-5 h-5 text-emerald" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full font-medium">
                        {formatCategory(item.category)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 pr-6">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 -mt-0.5">
                    {expandedQAId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedQAId === item.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 ml-14">
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {item.answer.length > 250 ? item.answer.slice(0, 250) + "..." : item.answer}
                        </p>
                        <Link 
                          href={`/qa`} 
                          className="inline-flex items-center gap-1 mt-3 text-emerald text-sm font-medium hover:underline"
                        >
                          View all Q&A
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </CardWrapper>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="rounded-xl border-emerald text-emerald hover:bg-emerald/10">
            <Link href="/qa">View All Q&A</Link>
          </Button>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && videos.find(v => v.id === selectedVideo.id) && (
        <VideoModalHome
          isOpen={true}
          onClose={() => {
            setSelectedVideo(null)
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('video')
            window.history.pushState({}, '', newUrl.toString())
          }}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
          playlistId="PLnfYS3rBXoKSDiGuqF_DUgsfUIDfItqyw"
        />
      )}
    </div>
  )
}