"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Play, FileText, BookOpen, Heart, Star, ChevronRight, HelpCircle } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { motion } from "framer-motion"
import { newMuslimArticles } from "@/lib/new-muslim-articles"
import { newMuslimBooks } from "@/lib/new-muslim-books"
import { newMuslimQA } from "@/lib/new-muslim-qa"
import { BookCover } from "../books/client"
import VideoModalHome from "@/components/modal/VideoModalHome"

const resources = {
  videos: [
    {
      id: "243ypvkL8R8",
      title: "Your First Steps as a New Muslim",
      thumbnail: `https://img.youtube.com/vi/243ypvkL8R8/mqdefault.jpg`,
      description: "Essential guidance for those who have just embraced Islam"
    },
    {
      id: "P29LMOHhpjE",
      title: "Learning to Pray - Complete Guide",
      thumbnail: `https://img.youtube.com/vi/P29LMOHhpjE/mqdefault.jpg`,
      description: "Step-by-step tutorial on how to perform Islamic prayers"
    },
    {
      id: "2ZEmsdEOpbk",
      title: "Understanding Islamic Basics",
      thumbnail: `https://img.youtube.com/vi/2ZEmsdEOpbk/mqdefault.jpg`,
      description: "Fundamental concepts every new Muslim should know"
    },
    {
      id: "YHwLYn2WJ0E",
      title: "Daily Islamic Practices",
      thumbnail: `https://img.youtube.com/vi/YHwLYn2WJ0E/mqdefault.jpg`,
      description: "Building healthy Islamic habits in your daily routine"
    },
  ],
  articles: newMuslimArticles.slice(0, 4).map(article => ({
    id: article.id,
    title: article.title,
    readTime: article.readTime,
    excerpt: article.excerpt,
    category: article.category
  })),
  books: newMuslimBooks.slice(0, 4).map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    thumbnail: book.thumbnail,
    color: book.color
  }))
}

const faqs = newMuslimQA.slice(0, 6).map(qa => ({
  q: qa.question,
  a: qa.answer
}))

export default function NewMuslimPage() {
  const [selectedVideo, setSelectedVideo] = useState<{id: string, title: string, description: string} | null>(null)
  const prevUrlRef = useRef<string | null>(null)

  const openVideo = (video: {id: string, title: string, description: string}) => {
    // store previous URL
    try {
      prevUrlRef.current = window.location.pathname + window.location.search
    } catch (e) {
      prevUrlRef.current = null
    }

    // push new modal URL
    try {
      window.history.pushState({ modal: true, videoId: video.id }, '', `/new-muslim/video?v=${video.id}`)
    } catch (e) {
      // ignore
    }

    // lock body scroll
    try { document.body.style.overflow = 'hidden' } catch (e) {}

    // ensure back button closes modal
    try { window.onpopstate = () => { handleClose() } } catch (e) {}

    setSelectedVideo(video)
  }

  const handleClose = () => {
    // restore body scroll
    try { document.body.style.overflow = 'auto' } catch (e) {}

    // restore previous URL
    const prev = prevUrlRef.current
    try {
      if (prev) window.history.replaceState({}, '', prev)
      else window.history.replaceState({}, '', '/new-muslim')
    } catch (e) {
      // ignore
    }

    setSelectedVideo(null)
    try { window.onpopstate = null } catch (e) {}
  }

  return (
    <>
      <div className="px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="text-center mb-12 py-12 px-6 bg-gradient-to-br from-emerald/10 to-emerald/5 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-emerald" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-emerald mb-4">Welcome to Your New Journey</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Congratulations on embracing Islam! We're here to support you every step of the way. Explore our curated
            resources designed specifically for new Muslims.
          </p>
        </motion.div>

        {/* Quick FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-emerald mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6" /> Quick Answers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faqs.map((faq, index) => (
              <CardWrapper key={index} delay={index * 0.1}>
                <div className="p-5">
                  <h3 className="font-bold text-emerald mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              </CardWrapper>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Star, title: "Learn the Basics", desc: "Start with the fundamentals of faith" },
            { icon: BookOpen, title: "Study the Quran", desc: "Begin reading Allah's guidance" },
            { icon: Heart, title: "Join Community", desc: "Connect with fellow Muslims" },
          ].map((item, index) => (
            <CardWrapper key={index} delay={index * 0.1}>
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-emerald" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </CardWrapper>
          ))}
        </div>

        {/* Videos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald mb-6 flex items-center gap-2">
            <Play className="w-6 h-6" /> Essential Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.videos.map((video, index) => (
              <CardWrapper key={video.id} delay={index * 0.05}>
                <button onClick={() => openVideo(video)} className="w-full text-left">
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to other quality thumbnails if mqdefault fails
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('mqdefault.jpg')) {
                          target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                        } else if (target.src.includes('hqdefault.jpg')) {
                          target.src = `https://img.youtube.com/vi/${video.id}/default.jpg`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-emerald fill-emerald ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-1">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </div>
                </button>
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" /> Helpful Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.articles.map((article, index) => (
              <CardWrapper key={article.id} delay={index * 0.05}>
                <Link href={`/articles/${article.id}`} className="block p-5 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 line-clamp-2">{article.title}</h3>
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
        </section>

        {/* Books */}
        <section>
          <h2 className="text-2xl font-bold text-emerald mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Recommended Books
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {resources.books.map((book, index) => (
              <CardWrapper key={book.id} delay={index * 0.05}>
                <Link href={`/books/${book.id}`}>
                  <BookCover title={book.title} author={book.author} color={book.color} thumbnail={book.thumbnail} />
                </Link>
              </CardWrapper>
            ))}
          </div>
        </section>
      </div>

      {selectedVideo && (
        <VideoModalHome
          isOpen={true}
          onClose={handleClose}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
          playlistId="PLnfYS3rBXoKSDiGuqF_DUgsfUIDfItqyw"
          baseUrl="/new-muslim/videos/"
        />
      )}
    </>
  )
}
