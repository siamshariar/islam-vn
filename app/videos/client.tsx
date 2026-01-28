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

// Get key function for infinite loading - start from page 0 since initial videos are page 1
const getKey = (pageIndex: number, previousPageData: any) => {
  // If this is the first page and we have initial videos, don't fetch
  if (pageIndex === 0 && initialVideos.length > 0) return null

  // If previous page doesn't exist or has no more data, stop
  if (previousPageData && !previousPageData.hasMore) return null

  // For pageIndex 0, we already have initial videos, so start from page 2
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

  // Use SWR Infinite for videos - start from page 1 (since page 0 is initial videos)
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args),
    fetcher,
    {
      revalidateOnMount: true, // Allow revalidation on mount
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes deduping
      focusThrottleInterval: 300000,
      errorRetryInterval: 60000, // 1 minute retry interval
      shouldRetryOnError: true,
      refreshInterval: 0, // Disable automatic refresh
      initialSize: 0, // Start with no additional pages
    }
  )

  // Combine initial videos with paginated API videos
  const apiVideos: YouTubeVideo[] = data ? data.flatMap(page => page.videos || []) : []
  const allVideos = [...initialVideos, ...apiVideos]

  // Remove duplicates based on video ID
  const videos = allVideos.filter((video, index, self) =>
    index === self.findIndex(v => v.id === video.id)
  )

  const isLoadingInitialData = initialVideos.length === 0 && !data
  const isLoadingMoreFromApi = isValidating && size > 0
  const isRefreshing = isValidating && size === 0
  const isEmpty = data?.[0]?.videos?.length === 0
  const hasMoreData = data && data.length > 0 && data[data.length - 1]?.hasMore

  // Show loading only if no initial videos and no API data
  const showLoading = initialVideos.length === 0 && !data

  // Show loading when fetching more videos during scroll
  const showLoadMoreLoading = isLoadingMoreFromApi || isLoadingMore

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
    window.history.replaceState({}, '', newUrl.toString())
  }

  // Infinite scroll logic
  const loadMore = useCallback(() => {
    if (hasMoreData && !isLoadingMore && !isLoadingMoreFromApi) {
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
        if (entries[0].isIntersecting && hasMoreData && !isLoadingMore && !isLoadingMoreFromApi) {
          loadMore()
        }
      },
      { threshold: 0.1 }
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

        {videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos
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

        {videos.length === 0 && !showLoading && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found matching your search.</p>
          </div>
        )}

        {!isEmpty && hasMoreData && videos.length > 0 && (
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