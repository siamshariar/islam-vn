"use client"

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Play, Search, X, ArrowUp, Video } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import VideoModal from "@/components/modal/VideoModal"
import { YouTubeVideo } from "@/lib/youtube-api"

const PAGE_SIZE = 20
const MIN_LOADING_TIME = 600
const SCROLL_RESTORE_FLAG = "videos_scroll_restore_flag"
const SCROLL_STATE_KEY = "videos_scroll_state"
const CACHED_DATA_KEY = "videos_cached_data"
const SCROLL_POSITION_KEY = "videos_scroll_position"

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

interface VideosClientProps {
  initialVideos: YouTubeVideo[]
  initialTotalVideos: number
  initialTotalPages: number
}

function VideoSkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="flex justify-between">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  )
}

function VideoLoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-12 h-12">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-2 bg-emerald/10 rounded-lg animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-9 h-2 bg-emerald/15 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-10 bg-white border-2 border-emerald rounded-lg shadow-md animate-bounce overflow-hidden">
          <div className="p-1.5 flex items-center justify-center h-full">
            <Play className="w-4 h-4 text-emerald" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-emerald">Loading more videos</p>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        </span>
      </div>
    </div>
  )
}

function SearchLoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative w-12 h-12">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-2 bg-emerald/10 rounded-lg animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-9 h-2 bg-emerald/15 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-10 bg-white border-2 border-emerald rounded-lg shadow-md animate-bounce overflow-hidden">
          <div className="p-1.5 flex items-center justify-center h-full">
            <Search className="w-4 h-4 text-emerald" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-emerald">Searching videos...</p>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        </span>
      </div>
    </div>
  )
}

function EndOfListIndicator({ totalCount }: { totalCount: number }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="relative">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald/10 rounded-full flex items-center justify-center">
          <Video className="w-4 h-4 text-emerald/60" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-medium">All videos loaded</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{totalCount} videos in collection</p>
      </div>
    </div>
  )
}

export default function VideosClient({
  initialVideos,
  initialTotalVideos,
  initialTotalPages,
}: VideosClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [search, setSearch] = useState("")
  const [inputValue, setInputValue] = useState("")
  const suppressOpenRef = useRef(false)

  const [loadedVideos, setLoadedVideos] = useState<YouTubeVideo[][]>(() => {
    if (initialVideos.length > 0) return [initialVideos]
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      if (needsRestore) {
        const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
        if (snapshot) { try { const p = JSON.parse(snapshot); if (Array.isArray(p.pages) && p.pages.length > 0) return p.pages } catch (e) {} }
        const cached = sessionStorage.getItem(CACHED_DATA_KEY)
        if (cached) { try { const p = JSON.parse(cached); if (Array.isArray(p.pages) && p.pages.length > 0) return p.pages } catch (e) {} }
      }
    }
    return []
  })

  const [currentPage, setCurrentPage] = useState(() => {
    if (initialVideos.length > 0) return 1
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.currentPage) return p.currentPage } catch (e) {} }
    }
    return 1
  })

  const [totalPages, setTotalPages] = useState(() => {
    if (initialVideos.length > 0) return initialTotalPages
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.totalPages) return p.totalPages } catch (e) {} }
    }
    return 1
  })

  const [totalVideos, setTotalVideos] = useState(initialTotalVideos)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(() => initialVideos.length === 0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isRestoringScroll, setIsRestoringScroll] = useState(() => {
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      const scrollY = parseInt(sessionStorage.getItem(SCROLL_POSITION_KEY) || "0", 10) || 0
      return needsRestore && scrollY > 0
    }
    return false
  })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const fetchingRef = useRef(false)
  const isMountedRef = useRef(true)
  const loadedIdsRef = useRef(new Set<string>())
  const restoreScrollBehaviorRef = useRef<string | null>(null)
  const lastScrollY = useRef(0)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialFetchDoneRef = useRef(false)
  const searchRequestIdRef = useRef(0)
  const scrollRestoredRef = useRef(false)

  useEffect(() => { const ids = new Set<string>(); loadedVideos.flat().forEach(item => { if (item?.id) ids.add(item.id) }); loadedIdsRef.current = ids }, [])

  const cacheDataBeforeNavigation = useCallback(() => {
    if (typeof window === "undefined") return
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    const snapshot = { pages: loadedVideos, currentPage, totalPages, totalVideos, search, scrollY, timestamp: Date.now() }
    sessionStorage.setItem(CACHED_DATA_KEY, JSON.stringify({ pages: loadedVideos, currentPage, totalPages, totalVideos, search, timestamp: Date.now() }))
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(snapshot))
  }, [currentPage, loadedVideos, totalPages, totalVideos, search])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    if (restoreScrollBehaviorRef.current === null) { restoreScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || ""; document.documentElement.style.scrollBehavior = "auto" }
  }, [])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if (scrollRestoredRef.current) return
    const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
    if (!needsRestore || loadedVideos.flat().length === 0) { setIsRestoringScroll(false); return }
    const savedScrollY = parseInt(sessionStorage.getItem(SCROLL_POSITION_KEY) || "0", 10) || 0
    if (savedScrollY <= 0) { setIsRestoringScroll(false); return }
    scrollRestoredRef.current = true
    let attempts = 0; const maxAttempts = 40; const startTime = Date.now()
    const tick = () => {
      if (!isMountedRef.current) return
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const targetY = Math.min(savedScrollY, maxScroll)
      if (maxScroll < targetY && attempts < maxAttempts) { attempts++; requestAnimationFrame(tick); return }
      window.scrollTo(0, targetY); document.documentElement.scrollTop = targetY; document.body.scrollTop = targetY
      const closeEnough = Math.abs((window.scrollY || document.documentElement.scrollTop) - targetY) <= 20
      attempts++
      if ((closeEnough && (window.scrollY || document.documentElement.scrollTop) > 0) || Date.now() - startTime > 3000 || attempts > maxAttempts) {
        if (restoreScrollBehaviorRef.current !== null) { document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current; restoreScrollBehaviorRef.current = null }
        setIsRestoringScroll(false)
        sessionStorage.removeItem(SCROLL_RESTORE_FLAG); sessionStorage.removeItem(SCROLL_POSITION_KEY)
        return
      }
      requestAnimationFrame(tick)
    }
    setTimeout(() => requestAnimationFrame(tick), 50)
  }, [loadedVideos.length])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-video-card]')
      if (target) cacheDataBeforeNavigation()
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [cacheDataBeforeNavigation])

  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false; if (restoreScrollBehaviorRef.current !== null && typeof document !== "undefined") { document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current; restoreScrollBehaviorRef.current = null }; if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current) } }, [])
  useEffect(() => {
    if (typeof window === "undefined") return
    const checkScroll = () => { const scrollY = window.scrollY || document.documentElement.scrollTop || 0; if (lastScrollY.current !== scrollY) { lastScrollY.current = scrollY; if (isMountedRef.current) setShowBackToTop(scrollY > 300) } }
    window.addEventListener("scroll", checkScroll, { passive: true })
    const interval = setInterval(checkScroll, 300)
    return () => { window.removeEventListener("scroll", checkScroll); clearInterval(interval) }
  }, [])
  const scrollToTop = useCallback(() => { if (typeof window === "undefined") return; window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  useEffect(() => { const ids = new Set<string>(); loadedVideos.flat().forEach(item => { if (item?.id) ids.add(item.id) }); loadedIdsRef.current = ids }, [loadedVideos])

  const loadMore = useCallback(async () => {
    if (fetchingRef.current) return
    if (currentPage >= totalPages) return
    const searchAtStart = search
    fetchingRef.current = true; setIsLoadingMore(true)
    const nextPage = currentPage + 1
    try {
      const params = new URLSearchParams({ maxResults: String(PAGE_SIZE), page: String(nextPage), search: searchAtStart })
      const res = await fetch(`/api/videos?${params}`)
      const data = await res.json()
      const elapsed = Date.now() - Date.now()
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) { await new Promise(r => { loadingTimeoutRef.current = setTimeout(r, remainingTime) }); loadingTimeoutRef.current = null }
      if (searchAtStart !== search || !isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false); return }
      if (data.videos?.length > 0) {
        const newItems = data.videos.filter((v: YouTubeVideo) => v?.id && !loadedIdsRef.current.has(v.id))
        if (newItems.length > 0) { newItems.forEach((v: YouTubeVideo) => loadedIdsRef.current.add(v.id)); setLoadedVideos(prev => [...prev, newItems]) }
        setCurrentPage(data.currentPage || nextPage); setTotalPages(data.totalPages || totalPages)
        if (data.totalVideos) setTotalVideos(data.totalVideos)
      } else { setTotalPages(currentPage) }
    } catch (error) { console.error("Error loading more:", error) }
    finally { if (isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false) } }
  }, [currentPage, totalPages, search])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null }
    if (isSearching || isInitialLoading || isRestoringScroll) return
    if (currentPage >= totalPages) return
    const sentinel = sentinelRef.current; if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting && !fetchingRef.current && currentPage < totalPages) loadMore() },
      { rootMargin: '200px', threshold: 0.1 }
    )
    observer.observe(sentinel); observerRef.current = observer
    return () => { observer.disconnect(); observerRef.current = null }
  }, [isSearching, isInitialLoading, isRestoringScroll, currentPage, totalPages, loadMore])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isSearching || isInitialLoading || isRestoringScroll) return
    if (currentPage >= totalPages) return
    if (fetchingRef.current) return
    const checkHeight = () => {
      const docHeight = document.documentElement.scrollHeight; const viewportHeight = window.innerHeight
      if (docHeight <= viewportHeight + 200 && currentPage < totalPages) loadMore()
    }
    const timeout = setTimeout(checkHeight, 500)
    return () => clearTimeout(timeout)
  }, [loadedVideos, isSearching, isInitialLoading, isRestoringScroll, currentPage, totalPages, loadMore])

  // Initial fetch
  useEffect(() => {
    if (initialFetchDoneRef.current) return
    if (loadedVideos.length > 0) { initialFetchDoneRef.current = true; setIsInitialLoading(false); return }
    initialFetchDoneRef.current = true
    setIsInitialLoading(true)
    fetch(`/api/videos?maxResults=${PAGE_SIZE}&page=1`)
      .then(res => res.json())
      .then(async data => {
        if (!isMountedRef.current) return
        if (data.videos?.length > 0) {
          data.videos.forEach((v: YouTubeVideo) => { if (v?.id) loadedIdsRef.current.add(v.id) })
          setLoadedVideos([data.videos]); setCurrentPage(data.currentPage || 1); setTotalPages(data.totalPages || 1)
          if (data.totalVideos) setTotalVideos(data.totalVideos)
        } else { setTotalPages(1) }
      })
      .catch(console.error)
      .finally(() => { if (isMountedRef.current) setIsInitialLoading(false) })
  }, [])

  // Handle video param
  useEffect(() => {
    if (suppressOpenRef.current) return
    const videoId = searchParams.get('video')
    if (videoId && loadedVideos.flat().length > 0) {
      const video = loadedVideos.flat().find(v => v.id === videoId)
      if (video) setSelectedVideo(video)
    }
  }, [searchParams, loadedVideos])

  useEffect(() => { if (selectedVideo) router.replace(`/videos?video=${selectedVideo.id}`, { scroll: false }) }, [selectedVideo, router])
  useEffect(() => { if (!selectedVideo && searchParams.get('video')) router.replace('/videos', { scroll: false }) }, [selectedVideo, searchParams, router])

  // Smooth search - same page, no full reload (like QA page)
  const performSearch = useCallback(async (query: string) => {
    const requestId = ++searchRequestIdRef.current
    
    // Clear session storage for fresh state
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
    sessionStorage.removeItem(SCROLL_STATE_KEY)
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
    sessionStorage.removeItem(CACHED_DATA_KEY)
    scrollRestoredRef.current = false
    
    setIsSearching(true)
    setSearch(query)
    setLoadedVideos([])
    setCurrentPage(1)
    setTotalPages(0)
    setTotalVideos(0)
    loadedIdsRef.current = new Set()
    fetchingRef.current = false
    
    // Update URL without reload
    if (query) {
      router.replace(`/videos?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.replace('/videos', { scroll: false })
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    const loadStartTime = Date.now()
    
    try {
      const params = new URLSearchParams({ 
        maxResults: String(PAGE_SIZE), 
        page: '1', 
        search: query 
      })
      const res = await fetch(`/api/videos?${params}`)
      const data = await res.json()
      
      if (requestId !== searchRequestIdRef.current) return
      
      const elapsed = Date.now() - loadStartTime
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) { 
        await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) })
        loadingTimeoutRef.current = null 
      }
      
      if (requestId !== searchRequestIdRef.current || !isMountedRef.current) return
      
      if (data.videos?.length > 0) {
        data.videos.forEach((v: YouTubeVideo) => { if (v?.id) loadedIdsRef.current.add(v.id) })
        setLoadedVideos([data.videos])
        setCurrentPage(data.currentPage || 1)
        setTotalPages(data.totalPages || 1)
        setTotalVideos(data.totalVideos || data.videos.length)
      } else {
        setLoadedVideos([])
        setTotalPages(0)
        setTotalVideos(0)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      if (requestId === searchRequestIdRef.current && isMountedRef.current) {
        setIsSearching(false)
      }
    }
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = inputValue.trim()
    performSearch(query)
  }

  const clearSearch = () => {
    setInputValue("")
    setSearch("")
    performSearch("")
  }

  const allLoadedVideos = loadedVideos.flat()
  const hasMore = currentPage < totalPages

  return (
    <>
      <style jsx global>{`
        button:focus, button:focus-visible, button:active:focus, button:focus:not(:focus-visible) { outline: none !important; box-shadow: none !important; }
        button:focus-visible { outline: none !important; }
        button::-moz-focus-inner { border: 0; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <div style={{ visibility: isRestoringScroll ? "hidden" : "visible" }}>
        <div className="px-4 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald mb-2">Islamic Videos</h1>
              <p className="text-muted-foreground">
                {search
                  ? totalVideos > 0
                    ? `Found ${totalVideos} ${totalVideos === 1 ? 'video' : 'videos'} for "${search}"`
                    : `Searching for "${search}"...`
                  : "Discover authentic Islamic content from trusted scholars and educators around the world."
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-9 pr-9 rounded-xl"
                />
                {inputValue && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Search Loading */}
          {isSearching && <SearchLoadingAnimation />}

          {/* Initial Loading */}
          {!isSearching && isInitialLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => <VideoSkeletonCard key={i} />)}
            </div>
          )}

          {/* No results */}
          {!isSearching && !isInitialLoading && allLoadedVideos.length === 0 && search && (
            <div className="text-center py-20">
              <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search terms</p>
              <button onClick={clearSearch} className="text-emerald hover:text-emerald/80 font-medium">Clear search</button>
            </div>
          )}

          {/* No videos at all */}
          {!isSearching && !isInitialLoading && allLoadedVideos.length === 0 && !search && (
            <div className="text-center py-20">
              <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No videos available</h3>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          )}

          {/* Videos Grid */}
          {!isSearching && allLoadedVideos.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allLoadedVideos.map((video) => (
                  <CardWrapper key={video.id}>
                    <div
                      data-video-card
                      className="group cursor-pointer"
                      onClick={() => {
                        cacheDataBeforeNavigation()
                        suppressOpenRef.current = false
                        const params = new URLSearchParams()
                        params.set('video', video.id)
                        router.push(`/videos?${params.toString()}`, { scroll: false })
                        setSelectedVideo(video)
                      }}
                    >
                      <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
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
              <div ref={sentinelRef} className="h-4" />
              {isLoadingMore && <VideoLoadingAnimation />}
              {!hasMore && allLoadedVideos.length > 0 && !isLoadingMore && (
                <EndOfListIndicator totalCount={totalVideos > 0 ? totalVideos : allLoadedVideos.length} />
              )}
            </>
          )}

          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 cursor-pointer right-6 w-12 h-12 bg-emerald text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-emerald/90 ${
              showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Back to top"
            style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => {
            suppressOpenRef.current = true
            router.replace('/videos', { scroll: false })
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