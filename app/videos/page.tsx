"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Play, Search, Loader2 } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import VideoModal from "@/components/modal/VideoModal"
import useSWRInfinite from 'swr/infinite'
import { YouTubeVideo } from "@/lib/youtube-api"

// Initial videos for immediate loading (same as API fallback)
const initialVideos: YouTubeVideo[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Understanding Tawheed - The Oneness of Allah",
    description: "Learn about the fundamental concept of Tawheed in Islam",
    thumbnail: "/islamic-lecture-mosque.jpg",
    duration: "45:30",
    viewCount: "12K",
    publishedAt: "2024-01-15T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "9bZkp7q19f0",
    title: "The Beauty of Salah - Your Connection to Allah",
    description: "Discover the spiritual benefits of prayer in Islam",
    thumbnail: "/muslim-prayer-dawn.jpg",
    duration: "32:15",
    viewCount: "8.5K",
    publishedAt: "2024-01-10T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "JGwWNGJdvx8",
    title: "Stories of Prophet Muhammad (PBUH)",
    description: "Inspiring stories from the life of Prophet Muhammad",
    thumbnail: "/islamic-art-calligraphy.jpg",
    duration: "1:02:45",
    viewCount: "15K",
    publishedAt: "2024-01-05T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "hTWKbfoikeg",
    title: "Ramadan Preparation Guide",
    description: "How to prepare spiritually for the month of Ramadan",
    thumbnail: "/ramadan-moon-lanterns.jpg",
    duration: "28:00",
    viewCount: "6.2K",
    publishedAt: "2024-01-01T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "N9Q2LRH4lsk",
    title: "Islamic Ethics and Morality",
    description: "Exploring the ethical principles and moral values in Islam",
    thumbnail: "/islamic-ethics-morality.jpg",
    duration: "38:20",
    viewCount: "9.1K",
    publishedAt: "2023-12-28T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "Y7T5P2YBkKQ",
    title: "Prayer in Islam: A Complete Guide",
    description: "Step-by-step guide to performing Salah (Islamic prayer) correctly",
    thumbnail: "/islamic-prayer-guide.jpg",
    duration: "55:10",
    viewCount: "18K",
    publishedAt: "2023-12-25T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "KoZ83cnoZyU",
    title: "The Quran: A Guide to Reading and Understanding",
    description: "Learn how to approach the Quran with proper understanding",
    thumbnail: "/quran-reading-guide.jpg",
    duration: "41:25",
    viewCount: "11K",
    publishedAt: "2023-12-20T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "sample_video_8",
    title: "Islamic Finance and Banking",
    description: "Understanding Islamic principles in modern finance",
    thumbnail: "/islamic-finance-banking.jpg",
    duration: "49:15",
    viewCount: "7.8K",
    publishedAt: "2023-12-15T10:00:00Z",
    channelTitle: "Islamic Lectures"
  }
]

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json())

// Get key function for infinite loading
const getKey = (pageIndex: number, previousPageData: any, initPlaylistId?: string) => {
  if (previousPageData && !previousPageData.videos?.length) return null // reached the end
  return `/api/videos?maxResults=20&page=${pageIndex + 1}${initPlaylistId ? `&playlistId=${initPlaylistId}` : ''}`
}

export default function VideosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [search, setSearch] = useState("")

  // Use SWR Infinite for videos - fetch from YouTube API immediately
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args),
    fetcher,
    {
      revalidateOnMount: true, // Fetch from YouTube API on mount
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // 30 seconds deduping
    }
  )

  // Flatten the data from all pages
  const videos: YouTubeVideo[] = data ? data.flatMap(page => page.videos || []) : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore = isValidating && data && size > 1
  const isRefreshing = isValidating && size === 1 // Loading first page
  const isEmpty = data?.[0]?.videos?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.videos?.length < 20)

  // Show loading for initial load or when refreshing
  const showLoading = isLoadingInitialData || (isRefreshing && videos.length === 0)

  // Handle URL params for modal
  useEffect(() => {
    const videoId = searchParams.get('video')
    if (videoId && videos.length > 0) {
      const video = videos.find(v => v.id === videoId)
      if (video) {
        setSelectedVideo(video)
      }
    } else if (!videoId) {
      // Clear selected video when no video param in URL
      setSelectedVideo(null)
    }
  }, [searchParams, videos])

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video)
    // Update URL with video ID
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('video', video.id)
    window.history.pushState({}, '', newUrl.toString())
  }

  const handleCloseModal = () => {
    setSelectedVideo(null)
    // Remove video param from URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('video')
    window.history.pushState({}, '', newUrl.toString())
  }

  const loadMore = () => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1)
    }
  }

  // Filter videos based on search
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    video.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
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

        {showLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
            <span className="ml-2 text-muted-foreground">Loading videos from YouTube...</span>
          </div>
        )}

        {isRefreshing && videos.length > 0 && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-emerald" />
            <span className="ml-2 text-sm text-muted-foreground">Refreshing videos...</span>
          </div>
        )}

        {error && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load videos from YouTube API.</p>
            <button
              onClick={() => mutate()}
              className="px-4 py-2 bg-emerald text-white rounded-lg hover:bg-emerald/90"
            >
              Try Again
            </button>
          </div>
        )}

        {videos.length > 0 && !showLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <CardWrapper key={video.id} delay={index * 0.05}>
                <button onClick={() => handleVideoClick(video)} className="w-full text-left">
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

        {videos.length === 0 && !showLoading && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found matching your search.</p>
          </div>
        )}

        {!isReachingEnd && !isLoadingMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-emerald text-white rounded-lg hover:bg-emerald/90 transition-colors"
            >
              Load More Videos
            </button>
          </div>
        )}

        {isLoadingMore && (
          <div className="flex justify-center mt-8">
            <Loader2 className="w-6 h-6 animate-spin text-emerald" />
            <span className="ml-2 text-muted-foreground">Loading more videos...</span>
          </div>
        )}
      </div>

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={handleCloseModal}
        videoId={selectedVideo?.id}
        title={selectedVideo?.title}
        description={selectedVideo?.description}
        playlistId="PLnfYS3rBXoKSDiGuqF_UIDfItqyw"
      />
    </>
  )
}
