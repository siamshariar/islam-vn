"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Play, Search, Loader2 } from "lucide-react"
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [search, setSearch] = useState("")
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(null)

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
    }
  ]

  const [showFallback, setShowFallback] = useState(false)

  // Timeout fallback for Vercel deployment - only show fallback after API fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (apiVideos.length === 0 && !isValidating) {
        console.log('API timeout reached, showing fallback videos')
        setShowFallback(true)
      }
    }, 8000) // 8 seconds timeout

    return () => clearTimeout(timer)
  }, [apiVideos.length, isValidating])

  // Use API videos if available, otherwise use fallback videos only after timeout
  const displayVideos = apiVideos.length > 0 ? apiVideos : (showFallback ? fallbackVideos : [])

  const isLoadingInitialData = !data && !error && !showFallback
  const isLoadingMoreFromApi = isValidating && size > 1
  const isRefreshing = isValidating && size === 1
  const isEmpty = data?.[0]?.videos?.length === 0
  const hasMoreData = data && data.length > 0 && data[data.length - 1]?.hasMore

  // Show loading only when initially loading data and no videos available and not showing fallback
  const showLoading = isLoadingInitialData && displayVideos.length === 0 && !showFallback

  // Show loading when fetching more videos during scroll
  const showLoadMoreLoading = isLoadingMoreFromApi || isLoadingMore

  // Handle URL params for modal
  useEffect(() => {
    const videoId = searchParams.get('video')
    if (videoId && displayVideos.length > 0) {
      const video = displayVideos.find(v => v.id === videoId)
      if (video) {
        setSelectedVideo(video)
      }
    } else if (!videoId) {
      // Clear selected video when no video param in URL
      setSelectedVideo(null)
    }
  }, [searchParams, displayVideos])

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video)
    // Update URL with video ID
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('video', video.id)
    window.history.replaceState({}, '', newUrl.toString())
  }

  // Infinite scroll logic
  const loadMore = useCallback(() => {
    if (hasMoreData && !isLoadingMore && !isLoadingMoreFromApi) {
      console.log('Loading more videos, current size:', size)
      setSize(size + 1)
    }
  }, [hasMoreData, isLoadingMore, isLoadingMoreFromApi, setSize, size])

  useEffect(() => {
    if (isLoadingMore && !isValidating) {
      setIsLoadingMore(false)
    }
  }, [isValidating, isLoadingMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMoreData && !isLoadingMore && !isLoadingMoreFromApi) {
          console.log('Intersection observer triggered, loading more videos')
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Add root margin for earlier loading
    )

    if (observerTarget) {
      observer.observe(observerTarget)
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget)
      }
    }
  }, [observerTarget, hasMoreData, isLoadingMore, isLoadingMoreFromApi, loadMore])

  // Fallback scroll detection for browsers that don't support IntersectionObserver well
  useEffect(() => {
    let isThrottled = false

    const handleScroll = () => {
      if (isThrottled || !hasMoreData || isLoadingMore || isLoadingMoreFromApi) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Trigger load more when user is within 200px of bottom
      if (documentHeight - scrollTop - windowHeight < 200) {
        console.log('Scroll detection triggered, loading more videos')
        isThrottled = true
        loadMore()
        
        // Reset throttle after a short delay
        setTimeout(() => {
          isThrottled = false
        }, 1000)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMoreData, isLoadingMore, isLoadingMoreFromApi, loadMore])

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
            <h1 className="text-3xl font-bold text-emerald mb-2">Islamic Videos</h1>
            <p className="text-muted-foreground">Discover authentic Islamic content from trusted scholars and educators around the world.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {error && displayVideos.length === 0 && !showFallback && (
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

        {displayVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayVideos
              .filter(video =>
                search === '' ||
                video.title.toLowerCase().includes(search.toLowerCase()) ||
                video.description.toLowerCase().includes(search.toLowerCase()) ||
                video.channelTitle.toLowerCase().includes(search.toLowerCase())
              )
              .map((video, index) => (
                <CardWrapper key={video.id} delay={index * 0.05}>
                  <button onClick={() => handleVideoClick(video)} className="w-full text-left cursor-pointer">
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
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

        {displayVideos.length === 0 && !showLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {search ? 'No videos found matching your search.' : 'No videos available at the moment.'}
            </p>
          </div>
        )}

        {!isEmpty && hasMoreData && displayVideos.length > 0 && (
          <div ref={setObserverTarget} className="flex justify-center mt-8 py-8">
            {showLoadMoreLoading && (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-emerald" />
                <span className="ml-2 text-muted-foreground">Loading more videos...</span>
              </>
            )}
          </div>
        )}
      </div>

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => {
          setSelectedVideo(null)
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('video')
          window.history.replaceState({}, '', newUrl.toString())
        }}
        videoId={selectedVideo?.id}
        title={selectedVideo?.title}
        description={selectedVideo?.description}
        playlistId="PLnfYS3rBXoKSDiGuqF_UIDfItqyw"
      />
    </>
  )
}