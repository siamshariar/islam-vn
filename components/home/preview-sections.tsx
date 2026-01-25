"use client"

import { useState, useEffect } from "react"
import { Play, BookOpen, FileText, ChevronRight, Loader2 } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import { CardWrapper } from "@/components/ui/card-wrapper"
import VideoModalHome from "@/components/modal/VideoModalHome"

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  channelTitle: string;
}

// Sample data for books and articles (keeping these as they are)
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
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)

  // Handle URL params for modal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const videoId = urlParams.get('video')
    if (videoId && videos.length > 0) {
      const video = videos.find(v => v.id === videoId)
      if (video) {
        setSelectedVideo(video)
      }
    }
  }, [videos])

  useEffect(() => {
    const loadVideos = async () => {
      // Check localStorage first for cached videos
      const cachedVideos = localStorage.getItem('islam-vn-home-videos')
      const cacheTimestamp = localStorage.getItem('islam-vn-home-videos-timestamp')
      const CACHE_DURATION = 60 * 60 * 1000 // 1 hour for home page

      if (cachedVideos && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp)
        if (cacheAge < CACHE_DURATION) {
          try {
            const parsedVideos = JSON.parse(cachedVideos)
            if (parsedVideos && parsedVideos.length > 0) {
              setVideos(parsedVideos.slice(0, 4))
              setLoading(false)
              return // Don't make API call if cache is fresh
            }
          } catch (err) {
            console.error('Error parsing cached home videos:', err)
          }
        }
      }

      // Only make API call if cache is stale or empty
      try {
        setLoading(true)
        const response = await fetch('/api/videos?maxResults=4')
        if (!response.ok) {
          throw new Error('Failed to fetch videos')
        }
        const data = await response.json()

        if (data.videos && data.videos.length > 0) {
          const homeVideos = data.videos.slice(0, 4)
          setVideos(homeVideos)
          // Cache for home page
          localStorage.setItem('islam-vn-home-videos', JSON.stringify(homeVideos))
          localStorage.setItem('islam-vn-home-videos-timestamp', Date.now().toString())
        } else {
          // Use fallback if no videos
          setVideos([
            { id: "dQw4w9WgXcQ", title: "Understanding Tawheed", viewCount: "12K", thumbnail: "/islamic-lecture-mosque.jpg", description: "", duration: "45:30", publishedAt: "", channelTitle: "Islamic Lectures" },
            { id: "9bZkp7q19f0", title: "The Beauty of Salah", viewCount: "8.5K", thumbnail: "/muslim-prayer-dawn.jpg", description: "", duration: "32:15", publishedAt: "", channelTitle: "Islamic Lectures" },
            { id: "JGwWNGJdvx8", title: "Stories of the Prophets", viewCount: "15K", thumbnail: "/islamic-art-calligraphy.jpg", description: "", duration: "1:02:45", publishedAt: "", channelTitle: "Islamic Lectures" },
            { id: "hTWKbfoikeg", title: "Ramadan Preparation", viewCount: "20K", thumbnail: "/ramadan-moon-lanterns.jpg", description: "", duration: "28:00", publishedAt: "", channelTitle: "Islamic Lectures" },
          ])
        }
      } catch (err) {
        console.error('Error loading home videos:', err)
        // Use fallback data if API fails
        setVideos([
          { id: "dQw4w9WgXcQ", title: "Understanding Tawheed", viewCount: "12K", thumbnail: "/islamic-lecture-mosque.jpg", description: "", duration: "45:30", publishedAt: "", channelTitle: "Islamic Lectures" },
          { id: "9bZkp7q19f0", title: "The Beauty of Salah", viewCount: "8.5K", thumbnail: "/muslim-prayer-dawn.jpg", description: "", duration: "32:15", publishedAt: "", channelTitle: "Islamic Lectures" },
          { id: "JGwWNGJdvx8", title: "Stories of the Prophets", viewCount: "15K", thumbnail: "/islamic-art-calligraphy.jpg", description: "", duration: "1:02:45", publishedAt: "", channelTitle: "Islamic Lectures" },
          { id: "hTWKbfoikeg", title: "Ramadan Preparation", viewCount: "20K", thumbnail: "/ramadan-moon-lanterns.jpg", description: "", duration: "28:00", publishedAt: "", channelTitle: "Islamic Lectures" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  return (
    <div className="px-4 lg:px-8 py-8 space-y-12">
      {/* Videos Section */}
      <section>
        <SectionHeader title="Videos" href="/videos" viewAllText="View All" />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <CardWrapper key={index} delay={index * 0.1}>
                <div className="aspect-video bg-muted animate-pulse rounded-lg flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald" />
                </div>
                <div className="p-4">
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </CardWrapper>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((video, index) => (
              <CardWrapper key={video.id} delay={index * 0.1}>
                <button onClick={() => {
                  setSelectedVideo(video)
                  // Update URL with video ID
                  const newUrl = new URL(window.location.href)
                  newUrl.searchParams.set('video', video.id)
                  window.history.pushState({}, '', newUrl.toString())
                }} className="w-full text-left">
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
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-xs text-white">
                      {video.duration}
                    </div>
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
          </div>
        )}
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
      <VideoModalHome
        isOpen={!!selectedVideo}
        onClose={() => {
          setSelectedVideo(null)
          // Remove video param from URL
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('video')
          window.history.pushState({}, '', newUrl.toString())
        }}
        videoId={selectedVideo?.id}
        title={selectedVideo?.title}
        description={selectedVideo?.description}
        playlistId="PLnfYS3rBXoKSDiGuqF_DUgsfUIDfItqyw"
      />
    </div>
  )
}
