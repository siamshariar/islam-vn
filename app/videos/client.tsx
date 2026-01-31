"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Play, Search, Loader2, X } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import VideoModal from "@/components/modal/VideoModal"
import useSWRInfinite from 'swr/infinite'
import { YouTubeVideo } from "@/lib/youtube-api"

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json())

// Get key function for infinite loading - always start from page 1
const getKey = (pageIndex: number, previousPageData: any) => {
  // If previous page doesn't exist or has no more data, stop
  if (previousPageData && !previousPageData.hasMore) return null

  // Always start from page 1, let SWR handle pagination
  const actualPage = pageIndex + 1
  return `/api/videos?maxResults=20&page=${actualPage}`
}

interface VideosClientProps {
  initialVideos: YouTubeVideo[]
}

export default function VideosClient({ initialVideos }: VideosClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [search, setSearch] = useState("")
  const suppressOpenRef = useRef(false)

  // Redirect to search page if there's a search query in URL
  useEffect(() => {
    const query = searchParams.get('q')
    const videoParam = searchParams.get('video')
    // Only redirect to search if `q` exists and there's no `video` param
    if (query && !videoParam) {
      router.replace(`/search/videos?q=${encodeURIComponent(query)}`)
    }
  }, [searchParams, router])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    if (query) {
      router.push(`/search/videos?q=${encodeURIComponent(query)}`)
    }
  }

  // Use SWR Infinite for videos - always load from API
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args),
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes deduping
      focusThrottleInterval: 300000,
      errorRetryInterval: 30000, // 30 seconds retry interval (reduced)
      shouldRetryOnError: true,
      refreshInterval: 0, // Disable automatic refresh
      initialSize: 1, // Start with 1 page to always load initial data
      suspense: false, // Disable suspense to prevent hydration issues
    }
  )

  // Get videos from API data
  const apiVideos: YouTubeVideo[] = data ? data.flatMap(page => page.videos || []) : []

  // Fallback videos for when API completely fails
  const fallbackVideos: YouTubeVideo[] = [
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
      title: "Ramadan Reflections - The Month of Mercy",
      description: "Explore the spiritual significance of Ramadan",
      thumbnail: "/ramadan-mosque-night.jpg",
      duration: "28:45",
      viewCount: "15K",
      publishedAt: "2024-01-05T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "hTWKbfoikeg",
      title: "The Life of Prophet Muhammad (PBUH)",
      description: "A comprehensive overview of the Prophet's life",
      thumbnail: "/prophet-muhammad-biography.jpg",
      duration: "67:20",
      viewCount: "25K",
      publishedAt: "2024-01-01T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "N9Q2I4fTxpM",
      title: "Islamic Finance - Interest-Free Banking",
      description: "Understanding the principles of Islamic finance",
      thumbnail: "/islamic-finance-money.jpg",
      duration: "41:10",
      viewCount: "9K",
      publishedAt: "2023-12-28T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "2Vv-BfVoq4g",
      title: "Women in Islam - Rights and Responsibilities",
      description: "Exploring the status of women in Islamic teachings",
      thumbnail: "/muslim-women-education.jpg",
      duration: "38:55",
      viewCount: "18K",
      publishedAt: "2023-12-25T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "eIho2S0ZahI",
      title: "The Quran - A Source of Guidance",
      description: "Understanding the miraculous nature of the Quran",
      thumbnail: "/holy-quran-scripture.jpg",
      duration: "52:30",
      viewCount: "22K",
      publishedAt: "2023-12-20T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Islamic Art and Architecture",
      description: "Appreciating the beauty of Islamic civilization",
      thumbnail: "/islamic-art-architecture.jpg",
      duration: "35:40",
      viewCount: "11K",
      publishedAt: "2023-12-15T10:00:00Z",
      channelTitle: "Islamic Lectures"
    }
  ]

  // Combine API videos with fallback videos
  const videos = apiVideos.length > 0 ? apiVideos : fallbackVideos

  // Handle video param to open modal
  useEffect(() => {
    if (suppressOpenRef.current) return
    const videoId = searchParams.get('video')
    if (videoId && videos.length > 0) {
      const video = videos.find(v => v.id === videoId)
      if (video) {
        setSelectedVideo(video)
      }
    }
  }, [searchParams, videos])

  // Remove q param when modal opens to show clean URL
  useEffect(() => {
    if (selectedVideo) {
      router.replace(`/videos?video=${selectedVideo.id}`)
    }
  }, [selectedVideo, router])

  // Remove video param when modal is closed
  useEffect(() => {
    if (!selectedVideo && searchParams.get('video')) {
      const q = searchParams.get('q')
      if (q) {
        router.replace(`/search/videos?q=${encodeURIComponent(q)}`)
      } else {
        router.replace('/videos')
      }
    }
  }, [selectedVideo, searchParams, router])

  // Check if there's more data to load
  const hasMoreData = data && data[data.length - 1]?.hasMore !== false
  const isLoadingMore = isValidating && size > 1
  const isLoadingMoreFromApi = isValidating && size === 1
  const showLoading = !data && !error

  // Load more function for manual loading
  const loadMore = useCallback(() => {
    if (hasMoreData && !isLoadingMore && !isLoadingMoreFromApi) {
      setSize(size + 1)
    }
  }, [hasMoreData, isLoadingMore, isLoadingMoreFromApi, setSize, size])

  if (showLoading) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          <span className="ml-2 text-muted-foreground">Loading videos...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald mb-2">
              Islamic Videos
            </h1>
            <p className="text-muted-foreground">
              Discover authentic Islamic content from trusted scholars and educators around the world.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <CardWrapper key={video.id} delay={index * 0.05}>
              <div
                className="group cursor-pointer"
                onClick={() => {
                  // Ensure open suppression is off when intentionally opening
                  suppressOpenRef.current = false
                  const params = new URLSearchParams()
                  params.set('video', video.id)
                  router.push(`/videos?${params.toString()}`)
                  setSelectedVideo(video)
                }}
              >
                <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <Play className="w-6 h-6 text-emerald ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-emerald transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{video.viewCount} views</span>
                    <span>{video.channelTitle}</span>
                  </div>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreData && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoadingMore || isLoadingMoreFromApi}
              className="px-6 py-2 bg-emerald text-white rounded-xl hover:bg-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingMore || isLoadingMoreFromApi ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                'Load More Videos'
              )}
            </button>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => {
            // suppress re-opening from URL while we remove the param
            suppressOpenRef.current = true
            router.replace('/videos')
            setSelectedVideo(null)
          }}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
          playlistId=""
        />
      )}
    </>
  )
}

// Helper functions
const formatViewCount = (count: string) => {
  const num = parseInt(count)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

const formatPublishedDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}