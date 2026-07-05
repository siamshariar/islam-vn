"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Play, Search, X, ArrowUp, Video } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import VideoModal from "@/components/modal/VideoModal"
import { YouTubeVideo } from "@/lib/youtube-api"

const PAGE_SIZE = 12
const MIN_LOADING_TIME = 600
const SCROLL_RESTORE_FLAG = "search_videos_scroll_restore_flag"
const SCROLL_STATE_KEY = "search_videos_scroll_state"
const CACHED_DATA_KEY = "search_videos_cached_data"
const SCROLL_POSITION_KEY = "search_videos_scroll_position"

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

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
        <p className="text-sm font-medium text-emerald">Loading more results</p>
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

function EndOfListIndicator({ totalCount, query }: { totalCount: number; query: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="relative">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald/10 rounded-full flex items-center justify-center">
          <Video className="w-4 h-4 text-emerald/60" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-medium">All results loaded</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{totalCount} videos found for "{query}"</p>
      </div>
    </div>
  )
}

export default function SearchVideosClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlQuery = searchParams.get('q') || ""
  
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [search, setSearch] = useState(urlQuery)
  const [inputValue, setInputValue] = useState(urlQuery)
  const suppressOpenRef = useRef(false)
  
  const [loadedResults, setLoadedResults] = useState<YouTubeVideo[][]>(() => {
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      if (needsRestore) {
        const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
        if (snapshot) {
          try { const p = JSON.parse(snapshot); if (Array.isArray(p.pages) && p.pages.length > 0 && p.search === urlQuery) return p.pages } catch (e) {}
        }
        const cached = sessionStorage.getItem(CACHED_DATA_KEY)
        if (cached) {
          try { const p = JSON.parse(cached); if (Array.isArray(p.pages) && p.pages.length > 0 && p.search === urlQuery) return p.pages } catch (e) {}
        }
      }
    }
    return []
  })
  
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.currentPage && p.search === urlQuery) return p.currentPage } catch (e) {} }
      const cached = sessionStorage.getItem(CACHED_DATA_KEY)
      if (cached) { try { const p = JSON.parse(cached); if (p.currentPage && p.search === urlQuery) return p.currentPage } catch (e) {} }
    }
    return 1
  })
  
  const [totalPages, setTotalPages] = useState(() => {
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.totalPages && p.search === urlQuery) return p.totalPages } catch (e) {} }
      const cached = sessionStorage.getItem(CACHED_DATA_KEY)
      if (cached) { try { const p = JSON.parse(cached); if (p.totalPages && p.search === urlQuery) return p.totalPages } catch (e) {} }
    }
    return 0
  })
  
  const [totalResults, setTotalResults] = useState(() => {
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.total && p.search === urlQuery) return p.total } catch (e) {} }
      const cached = sessionStorage.getItem(CACHED_DATA_KEY)
      if (cached) { try { const p = JSON.parse(cached); if (p.total && p.search === urlQuery) return p.total } catch (e) {} }
    }
    return 0
  })
  
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
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
  const searchRequestIdRef = useRef(0)
  const scrollRestoredRef = useRef(false)
  const initialFetchDoneRef = useRef(false)

  useEffect(() => {
    const ids = new Set<string>()
    loadedResults.flat().forEach(item => { if (item?.id) ids.add(item.id) })
    loadedIdsRef.current = ids
  }, [])

  const cacheDataBeforeNavigation = useCallback(() => {
    if (typeof window === "undefined") return
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    const snapshot = { pages: loadedResults, currentPage, totalPages, total: totalResults, search, scrollY, timestamp: Date.now() }
    sessionStorage.setItem(CACHED_DATA_KEY, JSON.stringify({ pages: loadedResults, currentPage, totalPages, total: totalResults, search, timestamp: Date.now() }))
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(snapshot))
  }, [currentPage, loadedResults, totalPages, totalResults, search])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    if (restoreScrollBehaviorRef.current === null) {
      restoreScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || ""
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if (scrollRestoredRef.current) return
    const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
    if (!needsRestore || loadedResults.flat().length === 0) { setIsRestoringScroll(false); return }
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
      const currentY = window.scrollY || document.documentElement.scrollTop
      const closeEnough = Math.abs(currentY - targetY) <= 20
      attempts++
      if ((closeEnough && currentY > 0) || Date.now() - startTime > 3000 || attempts > maxAttempts) {
        if (restoreScrollBehaviorRef.current !== null) { document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current; restoreScrollBehaviorRef.current = null }
        setIsRestoringScroll(false)
        sessionStorage.removeItem(SCROLL_RESTORE_FLAG); sessionStorage.removeItem(SCROLL_POSITION_KEY)
        return
      }
      requestAnimationFrame(tick)
    }
    setTimeout(() => requestAnimationFrame(tick), 50)
  }, [loadedResults.length])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (restoreScrollBehaviorRef.current !== null && typeof document !== "undefined") { document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current; restoreScrollBehaviorRef.current = null }
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      if (lastScrollY.current !== scrollY) { lastScrollY.current = scrollY; if (isMountedRef.current) setShowBackToTop(scrollY > 300) }
    }
    window.addEventListener("scroll", checkScroll, { passive: true })
    const interval = setInterval(checkScroll, 300)
    return () => { window.removeEventListener("scroll", checkScroll); clearInterval(interval) }
  }, [])

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const ids = new Set<string>()
    loadedResults.flat().forEach(item => { if (item?.id) ids.add(item.id) })
    loadedIdsRef.current = ids
  }, [loadedResults])

  const performSearch = useCallback(async (query: string) => {
    const requestId = ++searchRequestIdRef.current
    
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
    sessionStorage.removeItem(SCROLL_STATE_KEY)
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
    sessionStorage.removeItem(CACHED_DATA_KEY)
    scrollRestoredRef.current = false
    initialFetchDoneRef.current = false
    
    setIsSearching(true); setSearch(query)
    setLoadedResults([]); setCurrentPage(1); setTotalPages(0); setTotalResults(0)
    loadedIdsRef.current = new Set(); fetchingRef.current = false
    
    if (query) {
      router.replace(`/search/videos?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.replace('/videos', { scroll: false })
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    try {
      const res = await fetch(`/api/search/videos?q=${encodeURIComponent(query)}&page=1`)
      const data = await res.json()
      if (requestId !== searchRequestIdRef.current) return
      if (requestId !== searchRequestIdRef.current || !isMountedRef.current) return
      if (data.results?.length > 0) {
        data.results.forEach((v: YouTubeVideo) => { if (v?.id) loadedIdsRef.current.add(v.id) })
        setLoadedResults([data.results]); setCurrentPage(data.currentPage || 1)
        setTotalPages(data.totalPages || Math.ceil((data.total || data.results.length) / PAGE_SIZE))
        setTotalResults(data.total || data.results.length)
      } else { setLoadedResults([]); setTotalPages(0); setTotalResults(0) }
    } catch (error) { console.error("Search error:", error) }
    finally { if (requestId === searchRequestIdRef.current && isMountedRef.current) setIsSearching(false) }
  }, [router])

  // Initial search
  useEffect(() => {
    if (initialFetchDoneRef.current) return
    if (!urlQuery) { initialFetchDoneRef.current = true; return }
    if (loadedResults.length > 0) { initialFetchDoneRef.current = true; return }
    initialFetchDoneRef.current = true
    performSearch(urlQuery)
  }, [urlQuery])

  const loadMore = useCallback(async () => {
    if (fetchingRef.current) return
    if (currentPage >= totalPages || !search) return
    const searchAtStart = search
    fetchingRef.current = true; setIsLoadingMore(true)
    const nextPage = currentPage + 1
    try {
      const res = await fetch(`/api/search/videos?q=${encodeURIComponent(searchAtStart)}&page=${nextPage}`)
      const data = await res.json()
      if (searchAtStart !== search || !isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false); return }
      if (data.results?.length > 0) {
        const newItems = data.results.filter((v: YouTubeVideo) => v?.id && !loadedIdsRef.current.has(v.id))
        if (newItems.length > 0) { newItems.forEach((v: YouTubeVideo) => loadedIdsRef.current.add(v.id)); setLoadedResults(prev => [...prev, newItems]) }
        setCurrentPage(data.currentPage || nextPage); setTotalPages(data.totalPages || totalPages)
        if (data.total) setTotalResults(data.total)
      }
    } catch (error) { console.error("Error loading more:", error) }
    finally { if (isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false) } }
  }, [currentPage, totalPages, search])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null }
    if (isSearching || isRestoringScroll) return
    if (currentPage >= totalPages) return
    const sentinel = sentinelRef.current; if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting && !fetchingRef.current && currentPage < totalPages) loadMore() },
      { rootMargin: '200px', threshold: 0.1 }
    )
    observer.observe(sentinel); observerRef.current = observer
    return () => { observer.disconnect(); observerRef.current = null }
  }, [isSearching, isRestoringScroll, currentPage, totalPages, loadMore])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = inputValue.trim()
    if (query) performSearch(query)
    else router.push('/videos')
  }

  const clearSearch = () => {
    setInputValue("")
    router.push('/videos')
  }

  const allLoadedResults = loadedResults.flat()
  const hasMore = currentPage < totalPages

  useEffect(() => {
    if (suppressOpenRef.current) return
    const videoId = searchParams.get('video')
    if (videoId && allLoadedResults.length > 0) {
      const video = allLoadedResults.find(v => v.id === videoId)
      if (video) setSelectedVideo(video)
    }
  }, [searchParams, allLoadedResults])

  useEffect(() => {
    if (selectedVideo) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('video', selectedVideo.id)
      router.replace(`/search/videos?${params.toString()}`, { scroll: false })
    }
  }, [selectedVideo])

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-emerald mb-2">Search Videos</h1>
              <p className="text-muted-foreground">
                {search && totalResults > 0
                  ? `Found ${totalResults} ${totalResults === 1 ? 'video' : 'videos'} for "${search}"`
                  : search ? `Searching for "${search}"...` : "Search our video collection"
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search videos..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="pl-9 pr-9 rounded-xl" />
                {inputValue && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {isSearching && <SearchLoadingAnimation />}

          {!isSearching && allLoadedResults.length === 0 && search && (
            <div className="text-center py-20">
              <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-6">Try a different search term</p>
              <button onClick={clearSearch} className="text-emerald hover:text-emerald/80 font-medium">Back to all videos</button>
            </div>
          )}

          {!isSearching && allLoadedResults.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allLoadedResults.map((video) => (
                  <CardWrapper key={video.id}>
                    <div className="group cursor-pointer" onClick={() => { cacheDataBeforeNavigation(); suppressOpenRef.current = false; setSelectedVideo(video) }}>
                      <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden relative">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">{video.duration}</div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                            <Play className="w-6 h-6 text-emerald ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-emerald transition-colors">{video.title}</h3>
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
              {!hasMore && allLoadedResults.length > 0 && !isLoadingMore && (
                <EndOfListIndicator totalCount={totalResults || allLoadedResults.length} query={search} />
              )}
            </>
          )}

          <button onClick={scrollToTop} className={`scroll-top-btn w-12 h-12 cursor-pointer bg-emerald text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-emerald/90 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} aria-label="Back to top" style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedVideo && (
        <VideoModal isOpen={true} onClose={() => { suppressOpenRef.current = true; setSelectedVideo(null) }} videoId={selectedVideo.id} title={selectedVideo.title} description={selectedVideo.description} playlistId="" />
      )}
    </>
  )
}