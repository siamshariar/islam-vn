"use client"

import { useState } from "react"
import { Play, BookOpen, FileText, ChevronRight } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { MediaModal } from "@/components/ui/media-modal"

// Sample data
const videos = [
  { id: "dQw4w9WgXcQ", title: "Understanding Tawheed", views: "12K", thumbnail: "/islamic-lecture-mosque.jpg" },
  { id: "dQw4w9WgXcQ", title: "The Beauty of Salah", views: "8.5K", thumbnail: "/muslim-prayer-dawn.jpg" },
  { id: "dQw4w9WgXcQ", title: "Stories of the Prophets", views: "15K", thumbnail: "/islamic-art-calligraphy.jpg" },
  { id: "dQw4w9WgXcQ", title: "Ramadan Preparation", views: "20K", thumbnail: "/ramadan-moon-lanterns.jpg" },
]

const books = [
  { id: "1", title: "The Sealed Nectar", author: "Safiur Rahman", color: "from-emerald to-emerald-light" },
  { id: "2", title: "Fortress of the Muslim", author: "Sa'id Al-Qahtani", color: "from-gold to-orange" },
  { id: "3", title: "Riyad us-Saliheen", author: "Imam An-Nawawi", color: "from-emerald-light to-emerald" },
  { id: "4", title: "The Book of Tawheed", author: "Muhammad ibn Abdul Wahhab", color: "from-orange to-gold" },
]

const articles = [
  { id: "1", title: "The Five Pillars of Islam Explained", category: "Basics", readTime: "5 min" },
  { id: "2", title: "Understanding Islamic Ethics in Daily Life", category: "Lifestyle", readTime: "8 min" },
  { id: "3", title: "The Importance of Seeking Knowledge", category: "Education", readTime: "6 min" },
  { id: "4", title: "Building a Strong Muslim Community", category: "Community", readTime: "7 min" },
]

export function PreviewSections() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  return (
    <div className="px-4 lg:px-8 py-8 space-y-12">
      {/* Videos Section */}
      <section>
        <SectionHeader title="Videos" href="/videos" viewAllText="View All" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <CardWrapper key={video.id + index} delay={index * 0.1}>
              <button onClick={() => setSelectedVideo(video.id)} className="w-full text-left">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-emerald fill-emerald ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-xs text-white/80">{video.views} views</span>
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

      {/* Books Section */}
      <section>
        <SectionHeader title="Books" href="/books" viewAllText="View All" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {books.map((book, index) => (
            <CardWrapper key={book.id} delay={index * 0.1} className="group">
              <div className={`aspect-[3/4] bg-gradient-to-br ${book.color} p-4 flex flex-col justify-between`}>
                <div>
                  <div className="w-8 h-1 bg-white/30 rounded-full mb-4" />
                  <BookOpen className="w-6 h-6 text-white/50 mb-2" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{book.title}</h3>
                  <p className="text-white/70 text-xs">{book.author}</p>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section>
        <SectionHeader title="Articles" href="/articles" viewAllText="View All" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article, index) => (
            <CardWrapper key={article.id} delay={index * 0.1}>
              <div className="p-5 flex items-start gap-4">
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
            </CardWrapper>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <MediaModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo || undefined}
        title="Video"
      />
    </div>
  )
}
