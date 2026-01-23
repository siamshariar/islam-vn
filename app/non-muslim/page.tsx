"use client"

import { useState } from "react"
import { Play, FileText, HelpCircle, Lightbulb, ChevronRight } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { MediaModal } from "@/components/ui/media-modal"
import { motion } from "framer-motion"

const resources = {
  videos: [
    { id: "dQw4w9WgXcQ", title: "What is Islam? An Introduction", thumbnail: "/placeholder.svg?height=200&width=350" },
    { id: "dQw4w9WgXcQ", title: "Who was Prophet Muhammad?", thumbnail: "/placeholder.svg?height=200&width=350" },
    {
      id: "dQw4w9WgXcQ",
      title: "Islam and Science - Harmony of Knowledge",
      thumbnail: "/placeholder.svg?height=200&width=350",
    },
    { id: "dQw4w9WgXcQ", title: "Women in Islam - Truth vs Myths", thumbnail: "/placeholder.svg?height=200&width=350" },
  ],
  articles: [
    { id: "1", title: "5 Common Misconceptions About Islam", readTime: "8 min" },
    { id: "2", title: "The Quran - What is it Really About?", readTime: "10 min" },
    { id: "3", title: "Islam's Message of Peace and Mercy", readTime: "6 min" },
    { id: "4", title: "Muslims in Vietnam - A Brief History", readTime: "7 min" },
  ],
}

const faqs = [
  {
    q: "What do Muslims believe?",
    a: "Muslims believe in one God (Allah), angels, prophets, holy books, the Day of Judgment, and divine decree.",
  },
  {
    q: "Is Islam a peaceful religion?",
    a: "Yes, Islam means 'peace' and 'submission to God.' The Quran teaches peace, justice, and compassion.",
  },
  {
    q: "What is the Quran?",
    a: "The Quran is the holy book of Islam, believed to be the word of God revealed to Prophet Muhammad.",
  },
]

export default function NonMuslimPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="text-center mb-12 py-12 px-6 bg-gradient-to-br from-gold/10 to-orange/5 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gold mb-4">Discover Islam</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Welcome! We're glad you're curious about Islam. Explore our resources to learn about the religion practiced
            by nearly 2 billion people worldwide.
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

        {/* Videos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald mb-6 flex items-center gap-2">
            <Play className="w-6 h-6" /> Introductory Videos
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
                        <Play className="w-5 h-5 text-gold fill-gold ml-0.5" />
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
            <FileText className="w-6 h-6" /> Learn More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.articles.map((article, index) => (
              <CardWrapper key={article.id} delay={index * 0.05}>
                <div className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-gold" />
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
    </MainLayout>
  )
}
