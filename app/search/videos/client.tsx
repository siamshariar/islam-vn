"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Play, Search, X } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import VideoModal from "@/components/modal/VideoModal"
import { YouTubeVideo } from "@/lib/youtube-api"

export default function SearchVideosClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(!!searchParams.get('q')) // Set loading to true if there's a query

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    if (query) {
      setLoading(true)
      try {
        const response = await fetch(`/api/search/videos?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.results || [])
        } else {
          setSearchResults([])
        }
        // Update URL with search parameter
        window.history.replaceState({}, '', `/search/videos?q=${encodeURIComponent(query)}`)
      } catch (error) {
        setSearchResults([])
        // Update URL with search parameter
        window.history.replaceState({}, '', `/search/videos?q=${encodeURIComponent(query)}`)
      } finally {
        setLoading(false)
      }
    } else {
      // Redirect immediately when search is empty
      window.location.href = '/videos'
    }
  }

  const clearSearch = () => {
    setSearch("")
    setSearchResults([])
    // Redirect to videos list page
    window.location.href = '/videos'
  }

  // Handle URL search params on mount
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearch(query)
      // Trigger search for direct URL access
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
      handleSearch(syntheticEvent)
    }
    const videoId = searchParams.get('video')
    if (videoId && searchResults.length > 0) {
      const video = searchResults.find(v => v.id === videoId)
      if (video) {
        setSelectedVideo(video)
      }
    }
  }, [])

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

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald mb-2">
            Search Videos
          </h1>
          <p className="text-muted-foreground">
            {searchResults.length > 0
              ? `Found ${searchResults.length} video${searchResults.length !== 1 ? 's' : ''} for "${search}"`
              : search
                ? `Searching for "${search}"...`
                : "Search our video collection"
            }
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search videos..."
              value={search}
              onChange={(e) => {
                const value = e.target.value
                setSearch(value)
                // Redirect immediately when search becomes empty
                if (!value.trim()) {
                  window.location.href = '/videos'
                }
              }}
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald"></div>
        </div>
      ) : (
        <>
          {search && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No videos found for "{search}"
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((video, index) => (
                <CardWrapper key={video.id} delay={index * 0.05}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedVideo(video)
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('video', video.id)
                      window.history.replaceState({}, '', `/search/videos?${params.toString()}`)
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
          ) : null}
        </>
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => {
            setSelectedVideo(null)
            const params = new URLSearchParams(searchParams.toString())
            params.delete('video')
            window.history.replaceState({}, '', `/search/videos?${params.toString()}`)
          }}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
          playlistId=""
        />
      )}
    </div>
  )
}