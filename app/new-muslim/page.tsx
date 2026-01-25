"use client"

import { useState } from "react"
import { Play, FileText, BookOpen, Heart, Star, ChevronRight } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { MediaModal } from "@/components/ui/media-modal"
import { motion } from "framer-motion"

const resources = {
  videos: [
    { id: "dQw4w9WgXcQ", title: "Your First Steps as a Muslim", thumbnail: "/placeholder.svg?height=200&width=350" },
    { id: "dQw4w9WgXcQ", title: "How to Perform Wudu (Ablution)", thumbnail: "/placeholder.svg?height=200&width=350" },
    { id: "dQw4w9WgXcQ", title: "Learning Salah - Step by Step", thumbnail: "/placeholder.svg?height=200&width=350" },
    { id: "dQw4w9WgXcQ", title: "Understanding the Shahada", thumbnail: "/placeholder.svg?height=200&width=350" },
  ],
  articles: [
    { id: "1", title: "Welcome to Islam - A Beginner's Guide", readTime: "10 min" },
    { id: "2", title: "The Beautiful Names of Allah", readTime: "8 min" },
    { id: "3", title: "Building Your Daily Routine as a Muslim", readTime: "6 min" },
    { id: "4", title: "Finding Muslim Community in Vietnam", readTime: "5 min" },
  ],
}

export default function NewMuslimPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

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
              <CardWrapper key={video.id + index} delay={index * 0.05}>
                <button onClick={() => setSelectedVideo(video.id)} className="w-full text-left">
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-emerald fill-emerald ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                  </div>
                </button>
              </CardWrapper>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section>
          <h2 className="text-2xl font-bold text-emerald mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" /> Helpful Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.articles.map((article, index) => (
              <CardWrapper key={article.id} delay={index * 0.05}>
                <div className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-emerald" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{article.title}</h3>
                    <span className="text-sm text-muted-foreground">{article.readTime} read</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardWrapper>
            ))}
          </div>
        </section>
      </div>

      <MediaModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo || undefined}
        title="Video"
      />
    </>
  )
}
