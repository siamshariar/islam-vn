"use client"

import { useState } from "react"
import { Play, Search } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { MediaModal } from "@/components/ui/media-modal"
import { Input } from "@/components/ui/input"

const videos = [
  {
    id: "dQw4w9WgXcQ",
    title: "Understanding Tawheed - The Oneness of Allah",
    views: "12K",
    duration: "45:30",
    thumbnail: "/islamic-lecture-hall.png",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "The Beauty of Salah - Your Connection to Allah",
    views: "8.5K",
    duration: "32:15",
    thumbnail: "/muslim-prayer-mosque.jpg",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Stories of Prophet Muhammad (PBUH)",
    views: "15K",
    duration: "1:02:45",
    thumbnail: "/islamic-calligraphy-gold.jpg",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Ramadan - The Month of Blessings",
    views: "20K",
    duration: "28:00",
    thumbnail: "/ramadan-crescent-moon.jpg",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "The Quran - A Guide for Humanity",
    views: "25K",
    duration: "55:20",
    thumbnail: "/quran-open-book.jpg",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Islamic History - The Golden Age",
    views: "18K",
    duration: "1:15:00",
    thumbnail: "/alhambra-islamic-architecture.jpg",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "The Pillars of Islam Explained",
    views: "30K",
    duration: "40:00",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Understanding Zakat and Charity",
    views: "9K",
    duration: "25:30",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
]

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filteredVideos = videos.filter((video) => video.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald mb-2">Videos</h1>
            <p className="text-muted-foreground">Watch and learn from our collection of Islamic lectures</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, index) => (
            <CardWrapper key={video.id + index} delay={index * 0.05}>
              <button onClick={() => setSelectedVideo(video.id)} className="w-full text-left">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <Play className="w-7 h-7 text-emerald fill-emerald ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                  <span className="text-sm text-muted-foreground">{video.views} views</span>
                </div>
              </button>
            </CardWrapper>
          ))}
        </div>
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
