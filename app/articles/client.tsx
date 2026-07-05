"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Clock, ChevronRight, X, ArrowUp, FileText } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Article } from "@/lib/articles"

const PAGE_SIZE = 12
const MIN_LOADING_TIME = 600
const SCROLL_RESTORE_FLAG = "articles_scroll_restore_flag"
const SCROLL_STATE_KEY = "articles_scroll_state"
const CACHED_DATA_KEY = "articles_cached_data"
const CACHED_CATEGORY_KEY = "articles_cached_category"
const SCROLL_POSITION_KEY = "articles_scroll_position"
const LAST_CATEGORY_KEY = "articles_last_category"

const categories = [
  "All", 
  "Evidence Islam is Truth", 
  "The Benefits of Islam", 
  "Beliefs of Islam", 
  "How to Convert to Islam", 
  "Worship and Practice", 
  "The Hereafter", 
  "Stories of New Muslims", 
  "Comparative Religion", 
  "The Holy Quran", 
  "The Prophet Muhammad", 
  "Current Issues", 
  "Islamic History", 
  "Systems in Islam", 
  "General"
]

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

interface ArticlesClientProps {
  articles: Article[]
  totalPages: number
  totalArticles: number
}

function ArticleSkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-emerald/20 rounded-full" />
          <div className="h-4 w-14 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
        <div className="flex items-center gap-1 pt-1">
          <div className="h-3 w-16 bg-emerald/20 rounded" />
          <div className="h-3 w-3 bg-emerald/20 rounded" />
        </div>
      </div>
    </div>
  )
}

function ArticleLoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-14 h-14">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-emerald/20 rounded-sm animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-emerald/30 rounded-sm animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-9 h-8 bg-emerald rounded-lg shadow-md animate-bounce">
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-emerald">Loading more articles</p>
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
      <div className="relative w-14 h-14">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-emerald/20 rounded-sm animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-emerald/30 rounded-sm animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-9 h-8 bg-emerald rounded-lg shadow-md animate-bounce">
          <div className="w-full h-full flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-emerald">Searching articles...</p>
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
          <FileText className="w-4 h-4 text-emerald/60" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-medium">All articles loaded</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{totalCount} articles in collection</p>
      </div>
    </div>
  )
}

export default function ArticlesClient({ 
  articles: initialArticles, 
  totalPages: initialTotalPages,
  totalArticles: initialTotalArticles 
}: ArticlesClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [inputValue, setInputValue] = useState(searchParams.get('q') || "")
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(LAST_CATEGORY_KEY) || "All"
    }
    return "All"
  })
  
  const [loadedArticles, setLoadedArticles] = useState<Article[][]>(() => {
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      if (needsRestore) {
        const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
        if (snapshot) {
          try {
            const parsed = JSON.parse(snapshot)
            if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
              return parsed.pages
            }
          } catch (e) {}
        }
        const cached = sessionStorage.getItem(CACHED_DATA_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
              return parsed.pages
            }
          } catch (e) {}
        }
      }
    }
    return [initialArticles]
  })
  
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.currentPage) return p.currentPage } catch (e) {} }
      const cached = sessionStorage.getItem(CACHED_DATA_KEY)
      if (cached) { try { const p = JSON.parse(cached); if (p.currentPage) return p.currentPage } catch (e) {} }
    }
    return 1
  })
  
  const [totalPages, setTotalPages] = useState(() => {
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.totalPages) return p.totalPages } catch (e) {} }
      const cached = sessionStorage.getItem(CACHED_DATA_KEY)
      if (cached) { try { const p = JSON.parse(cached); if (p.totalPages) return p.totalPages } catch (e) {} }
    }
    return initialTotalPages
  })
  
  const [totalArticles, setTotalArticles] = useState(() => {
    if (typeof window !== 'undefined') {
      const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
      if (snapshot) { try { const p = JSON.parse(snapshot); if (p.totalArticles) return p.totalArticles } catch (e) {} }
      const cached = sessionStorage.getItem(CACHED_DATA_KEY)
      if (cached) { try { const p = JSON.parse(cached); if (p.totalArticles) return p.totalArticles } catch (e) {} }
    }
    return initialTotalArticles
  })
  
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false)
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
  const categoryRequestIdRef = useRef(0)
  const lastScrollY = useRef(0)
  const prefetchCacheRef = useRef<Map<string, Article>>(new Map())
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollRestoredRef = useRef(false)
  const searchRequestIdRef = useRef(0)

  useEffect(() => {
    const ids = new Set<string>()
    loadedArticles.flat().forEach(item => { if (item?.id) ids.add(item.id) })
    loadedIdsRef.current = ids
  }, [])

  const prefetchArticle = useCallback(async (articleId: string) => {
    if (prefetchCacheRef.current.has(articleId)) return
    try {
      const res = await fetch(`/api/articles/${articleId}`)
      if (res.ok) { const data = await res.json(); prefetchCacheRef.current.set(articleId, data) }
    } catch (error) {}
  }, [])

  const cacheDataBeforeNavigation = useCallback((articleId?: string) => {
    if (typeof window === "undefined") return
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    const snapshot = {
      pages: loadedArticles, currentPage, totalPages, totalArticles,
      category: selectedCategory, search, scrollY, timestamp: Date.now(),
    }
    sessionStorage.setItem(CACHED_DATA_KEY, JSON.stringify({ pages: loadedArticles, currentPage, totalPages, totalArticles, search, timestamp: Date.now() }))
    sessionStorage.setItem(CACHED_CATEGORY_KEY, selectedCategory)
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(snapshot))
    if (articleId && prefetchCacheRef.current.has(articleId)) {
      sessionStorage.setItem(`article_${articleId}`, JSON.stringify(prefetchCacheRef.current.get(articleId)))
    }
  }, [currentPage, loadedArticles, selectedCategory, totalPages, totalArticles, search])

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
    if (!needsRestore) { setIsRestoringScroll(false); return }
    
    const savedScrollY = parseInt(sessionStorage.getItem(SCROLL_POSITION_KEY) || "0", 10) || 0
    if (savedScrollY <= 0 || loadedArticles.flat().length === 0) {
      setIsRestoringScroll(false)
      sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
      sessionStorage.removeItem(SCROLL_POSITION_KEY)
      return
    }
    
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
      const elapsed = Date.now() - startTime; attempts++
      if ((closeEnough && currentY > 0) || elapsed > 3000 || attempts > maxAttempts) {
        if (restoreScrollBehaviorRef.current !== null) { document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current; restoreScrollBehaviorRef.current = null }
        setIsRestoringScroll(false)
        sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
        sessionStorage.removeItem(SCROLL_POSITION_KEY)
        return
      }
      requestAnimationFrame(tick)
    }
    setTimeout(() => requestAnimationFrame(tick), 50)
  }, [loadedArticles.length])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href) {
        try {
          const url = new URL(target.href)
          if (url.origin === window.location.origin && url.pathname.includes('/articles/') && !url.pathname.endsWith('/articles')) {
            const articleId = url.pathname.split('/').pop()
            if (articleId) cacheDataBeforeNavigation(articleId)
          }
        } catch (e) {}
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [cacheDataBeforeNavigation])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (restoreScrollBehaviorRef.current !== null && typeof document !== "undefined") {
        document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current; restoreScrollBehaviorRef.current = null
      }
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
    loadedArticles.flat().forEach(item => { if (item?.id) ids.add(item.id) })
    loadedIdsRef.current = ids
  }, [loadedArticles])

  const loadMore = useCallback(async () => {
    if (fetchingRef.current) return
    if (currentPage >= totalPages) return
    
    const categoryAtStart = selectedCategory
    const searchAtStart = search
    fetchingRef.current = true; setIsLoadingMore(true)
    const loadStartTime = Date.now(); const nextPage = currentPage + 1
    
    try {
      const params = new URLSearchParams({ page: nextPage.toString(), category: categoryAtStart, search: searchAtStart })
      const res = await fetch(`/api/articles?${params}`); const data = await res.json()
      const elapsed = Date.now() - loadStartTime
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) { await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) }); loadingTimeoutRef.current = null }
      if (categoryAtStart !== selectedCategory || searchAtStart !== search || !isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false); return }
      if (data.articles?.length > 0) {
        const newItems = data.articles.filter((a: Article) => a?.id && !loadedIdsRef.current.has(a.id))
        if (newItems.length > 0) { newItems.forEach((a: Article) => loadedIdsRef.current.add(a.id)); setLoadedArticles(prev => [...prev, newItems]) }
        setCurrentPage(data.currentPage || nextPage); setTotalPages(data.totalPages || totalPages)
        if (data.totalArticles) setTotalArticles(data.totalArticles)
      }
    } catch (error) { console.error("Error loading more articles:", error) }
    finally { if (categoryAtStart === selectedCategory && isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false) } }
  }, [currentPage, totalPages, selectedCategory, search])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null }
    if (isSearching || isSwitchingCategory || isRestoringScroll) return
    if (currentPage >= totalPages) return
    const sentinel = sentinelRef.current; if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting && !fetchingRef.current && currentPage < totalPages) loadMore() },
      { rootMargin: '200px', threshold: 0.1 }
    )
    observer.observe(sentinel); observerRef.current = observer
    return () => { observer.disconnect(); observerRef.current = null }
  }, [isSearching, isSwitchingCategory, isRestoringScroll, currentPage, totalPages, loadMore])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isSearching || isSwitchingCategory || isRestoringScroll) return
    if (currentPage >= totalPages) return
    if (fetchingRef.current) return
    const checkHeight = () => {
      const docHeight = document.documentElement.scrollHeight; const viewportHeight = window.innerHeight
      if (docHeight <= viewportHeight + 200 && currentPage < totalPages) loadMore()
    }
    const timeout = setTimeout(checkHeight, 500)
    return () => clearTimeout(timeout)
  }, [loadedArticles, isSearching, isSwitchingCategory, isRestoringScroll, currentPage, totalPages, loadMore])

  const handleCategoryChange = async (category: string) => {
    if (category === selectedCategory) return
    const requestId = ++categoryRequestIdRef.current
    setIsSwitchingCategory(true); setSelectedCategory(category)
    setCurrentPage(1); setTotalPages(1)
    loadedIdsRef.current = new Set(); fetchingRef.current = false
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG); sessionStorage.removeItem(SCROLL_STATE_KEY); sessionStorage.removeItem(SCROLL_POSITION_KEY)
    if (typeof window !== "undefined") sessionStorage.setItem(LAST_CATEGORY_KEY, category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      const params = new URLSearchParams({ page: '1', category, search })
      const res = await fetch(`/api/articles?${params}`); const data = await res.json()
      if (requestId !== categoryRequestIdRef.current || !isMountedRef.current) return
      if (data.articles?.length > 0) {
        data.articles.forEach((a: Article) => { if (a?.id) loadedIdsRef.current.add(a.id) })
        setLoadedArticles([data.articles]); setCurrentPage(data.currentPage || 1); setTotalPages(data.totalPages || 1)
        if (data.totalArticles) setTotalArticles(data.totalArticles)
      } else { setLoadedArticles([]); setTotalPages(1); setTotalArticles(0) }
    } catch (error) { console.error("Error switching category:", error) }
    finally { if (requestId === categoryRequestIdRef.current && isMountedRef.current) setIsSwitchingCategory(false) }
  }

  // Smooth search function (like books page)
  const performSearch = useCallback(async (query: string) => {
    const requestId = ++searchRequestIdRef.current
    
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
    sessionStorage.removeItem(SCROLL_STATE_KEY)
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
    sessionStorage.removeItem(CACHED_DATA_KEY)
    scrollRestoredRef.current = false
    
    setIsSearching(true); setSearch(query)
    setLoadedArticles([]); setCurrentPage(1); setTotalPages(0); setTotalArticles(0)
    loadedIdsRef.current = new Set(); fetchingRef.current = false
    
    if (query) {
      router.replace(`/articles?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.replace('/articles', { scroll: false })
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    const loadStartTime = Date.now()
    
    try {
      const params = new URLSearchParams({ page: '1', category: selectedCategory, search: query })
      const res = await fetch(`/api/articles?${params}`); const data = await res.json()
      if (requestId !== searchRequestIdRef.current) return
      const elapsed = Date.now() - loadStartTime
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) { await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) }); loadingTimeoutRef.current = null }
      if (requestId !== searchRequestIdRef.current || !isMountedRef.current) return
      if (data.articles?.length > 0) {
        data.articles.forEach((a: Article) => { if (a?.id) loadedIdsRef.current.add(a.id) })
        setLoadedArticles([data.articles]); setCurrentPage(data.currentPage || 1)
        setTotalPages(data.totalPages || Math.ceil((data.totalArticles || data.articles.length) / PAGE_SIZE))
        setTotalArticles(data.totalArticles || data.articles.length)
      } else { setLoadedArticles([]); setTotalPages(0); setTotalArticles(0) }
    } catch (error) { console.error("Search error:", error) }
    finally { if (requestId === searchRequestIdRef.current && isMountedRef.current) setIsSearching(false) }
  }, [router, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = inputValue.trim()
    performSearch(query)
  }

  const clearSearch = () => {
    setInputValue("")
    performSearch("")
  }

  const allLoadedArticles = loadedArticles.flat()
  const hasMore = currentPage < totalPages

  return (
    <>
      <style jsx global>{`
        button:focus, button:focus-visible, button:active:focus, button:focus:not(:focus-visible) {
          outline: none !important; box-shadow: none !important;
        }
        button:focus-visible { outline: none !important; }
        button::-moz-focus-inner { border: 0; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <div style={{ visibility: isRestoringScroll ? "hidden" : "visible" }}>
        <div className="px-4 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-emerald mb-2">Articles</h1>
              <p className="text-muted-foreground">
                {search
                  ? totalArticles > 0
                    ? `Found ${totalArticles} ${totalArticles === 1 ? 'article' : 'articles'} for "${search}"`
                    : `Searching for "${search}"...`
                  : "Read and learn from our collection of Islamic articles"
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
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

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === category
                    ? "bg-emerald text-white"
                    : "bg-muted text-muted-foreground hover:bg-emerald/10 hover:text-emerald"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Loading */}
          {isSearching && <SearchLoadingAnimation />}

          {/* Category switching loading */}
          {isSwitchingCategory && !isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <ArticleSkeletonCard key={i} />)}
            </div>
          )}

          {/* No results */}
          {!isSearching && !isSwitchingCategory && allLoadedArticles.length === 0 && search && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter</p>
              <button onClick={() => handleCategoryChange("All")} className="text-emerald hover:text-emerald/80 font-medium">
                Browse all articles
              </button>
            </div>
          )}

          {/* Articles Grid - 4 columns like books */}
          {!isSearching && !isSwitchingCategory && allLoadedArticles.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allLoadedArticles.map((article) => (
                  <CardWrapper key={`${selectedCategory}-${article.id}`}>
                    <Link 
                      href={`/articles/${article.id}`} 
                      className="block h-full group"
                      onClick={() => cacheDataBeforeNavigation(article.id)}
                      onMouseEnter={() => prefetchArticle(article.id)}
                      prefetch={false}
                    >
                      {article.featureImage && (
                        <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                          <img
                            src={article.featureImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-1 bg-emerald/10 text-emerald rounded-full text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-3 mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-emerald font-medium text-xs group-hover:gap-1 transition-all">
                          Read more
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </CardWrapper>
                ))}
              </div>
              <div ref={sentinelRef} className="h-4" />
              {isLoadingMore && <ArticleLoadingAnimation />}
              {!hasMore && allLoadedArticles.length > 0 && !isLoadingMore && allLoadedArticles.length >= totalArticles && (
                <EndOfListIndicator totalCount={totalArticles} />
              )}
            </>
          )}

          <button
            onClick={scrollToTop}
            className={`scroll-top-btn w-12 h-12 cursor-pointer bg-emerald text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-emerald/90 ${
              showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Back to top"
            style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}