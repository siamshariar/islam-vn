"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Clock, ChevronRight, X, ArrowUp, FileText } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { articles } from "@/lib/articles"

const PAGE_SIZE = 9
const MIN_LOADING_TIME = 600
const SCROLL_RESTORE_FLAG = "search_articles_scroll_restore_flag"
const SCROLL_STATE_KEY = "search_articles_scroll_state"
const CACHED_DATA_KEY = "search_articles_cached_data"
const SCROLL_POSITION_KEY = "search_articles_scroll_position"

type Article = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  featureImage: string;
  content: string;
  author: string;
  language: string;
}

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

// Article skeleton card
function ArticleSkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-6 space-y-3">
        <div className="flex justify-between">
          <div className="h-6 w-20 bg-emerald/20 rounded-full" />
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-full" />
          <div className="h-5 bg-muted rounded w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="flex items-center gap-1 pt-2">
          <div className="h-4 w-20 bg-emerald/20 rounded" />
          <div className="h-3 w-3 bg-emerald/20 rounded" />
        </div>
      </div>
    </div>
  )
}

// Article loading animation
function ArticleLoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative w-20 h-20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-emerald/10 rounded-lg animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-emerald/15 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-18 bg-white border-2 border-emerald rounded-xl shadow-lg animate-bounce overflow-hidden">
          <div className="p-2">
            <div className="w-8 h-1.5 bg-emerald/30 rounded-full mb-2" />
            <div className="space-y-1">
              <div className="h-1 bg-emerald/20 rounded w-full" />
              <div className="h-1 bg-emerald/20 rounded w-3/4" />
              <div className="h-1 bg-emerald/20 rounded w-1/2" />
            </div>
            <div className="flex items-center gap-0.5 mt-2">
              <div className="h-1 w-5 bg-emerald rounded" />
              <div className="w-1 h-1 text-emerald">›</div>
            </div>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <FileText className="w-3 h-3 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-emerald">Loading more articles</p>
        <span className="flex gap-1">
          <span className="w-1 h-1 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-1 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
          <span className="w-1 h-1 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        </span>
      </div>
    </div>
  )
}

// End of list indicator
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
        <p className="text-sm text-muted-foreground font-medium">All results loaded</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{totalCount} articles found</p>
      </div>
    </div>
  )
}

// Get initial data - returns REAL data immediately
function getInitialData(urlQuery: string) {
  if (typeof window === 'undefined') {
    return { results: [], page: 1, pages: 0, search: urlQuery, hasData: false, scrollY: 0 }
  }
  
  const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
  
  if (needsRestore) {
    const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
    if (snapshot) {
      try {
        const parsed = JSON.parse(snapshot)
        if (Array.isArray(parsed.pages) && parsed.pages.length > 0 && parsed.search) {
          return {
            results: parsed.pages,
            page: parsed.currentPage || 1,
            pages: parsed.totalPages || 0,
            search: parsed.search,
            hasData: true,
            scrollY: parsed.scrollY || parseInt(sessionStorage.getItem(SCROLL_POSITION_KEY) || "0") || 0
          }
        }
      } catch (e) {}
    }
    
    const cached = sessionStorage.getItem(CACHED_DATA_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed.pages) && parsed.pages.length > 0 && parsed.search) {
          return {
            results: parsed.pages,
            page: parsed.currentPage || 1,
            pages: parsed.totalPages || 0,
            search: parsed.search,
            hasData: true,
            scrollY: parseInt(sessionStorage.getItem(SCROLL_POSITION_KEY) || "0") || 0
          }
        }
      } catch (e) {}
    }
    
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
    sessionStorage.removeItem(SCROLL_STATE_KEY)
    sessionStorage.removeItem(CACHED_DATA_KEY)
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
  }
  
  // Client-side search for instant results
  if (urlQuery) {
    const query = urlQuery.toLowerCase()
    const seen = new Set<string>()
    const uniqueArticles = articles.filter(a => {
      if (seen.has(a.id)) return false
      seen.add(a.id)
      return true
    })
    const filtered = uniqueArticles.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
    )
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const firstPage = filtered.slice(0, PAGE_SIZE)
    
    if (firstPage.length > 0) {
      return { results: [firstPage], page: 1, pages: totalPages, search: urlQuery, hasData: true, scrollY: 0 }
    }
  }
  
  return { results: [], page: 1, pages: 0, search: urlQuery, hasData: false, scrollY: 0 }
}

export default function SearchArticlesClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlQuery = searchParams.get('q') || ""
  
  const initialData = getInitialData(urlQuery)
  
  const [search, setSearch] = useState(initialData.search)
  const [inputValue, setInputValue] = useState(initialData.search)
  const [loadedResults, setLoadedResults] = useState<Article[][]>(initialData.results)
  const [currentPage, setCurrentPage] = useState(initialData.page)
  const [totalPages, setTotalPages] = useState(initialData.pages)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isRestoringScroll, setIsRestoringScroll] = useState(initialData.hasData && initialData.scrollY > 0)
  const [hasSearched, setHasSearched] = useState(initialData.hasData || !!urlQuery)
  
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const fetchingRef = useRef(false)
  const isMountedRef = useRef(true)
  const loadedIdsRef = useRef(new Set<string>())
  const restoreScrollBehaviorRef = useRef<string | null>(null)
  const prefetchCacheRef = useRef<Map<string, Article>>(new Map())
  const lastScrollY = useRef(0)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (initialData.hasData) {
      const ids = new Set<string>()
      initialData.results.flat().forEach((item: Article) => {
        if (item?.id) ids.add(item.id)
      })
      loadedIdsRef.current = ids
    }
  }, [])

  const prefetchArticle = useCallback(async (articleId: string) => {
    if (prefetchCacheRef.current.has(articleId)) return
    try {
      const res = await fetch(`/api/articles/${articleId}`)
      if (res.ok) {
        const data = await res.json()
        prefetchCacheRef.current.set(articleId, data)
      }
    } catch (error) {}
  }, [])

  const cacheDataBeforeNavigation = useCallback((articleId?: string) => {
    if (typeof window === "undefined") return
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0

    const snapshot = {
      pages: loadedResults,
      currentPage,
      totalPages,
      search,
      scrollY,
      timestamp: Date.now(),
    }

    sessionStorage.setItem(CACHED_DATA_KEY, JSON.stringify({
      pages: loadedResults,
      currentPage,
      totalPages,
      search,
      timestamp: Date.now(),
    }))
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(snapshot))
    
    if (articleId && prefetchCacheRef.current.has(articleId)) {
      sessionStorage.setItem(`article_${articleId}`, JSON.stringify(prefetchCacheRef.current.get(articleId)))
    }
  }, [currentPage, loadedResults, totalPages, search])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    if (restoreScrollBehaviorRef.current === null) {
      restoreScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || ""
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href) {
        try {
          const url = new URL(target.href)
          if (url.origin === window.location.origin) {
            if (url.pathname.includes('/articles/') && !url.pathname.endsWith('/articles')) {
              const articleId = url.pathname.split('/').pop()
              if (articleId) cacheDataBeforeNavigation(articleId)
            }
            if (url.pathname === '/articles' || url.pathname === '/articles/') {
              sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
              sessionStorage.removeItem(SCROLL_STATE_KEY)
              sessionStorage.removeItem(CACHED_DATA_KEY)
              sessionStorage.removeItem(SCROLL_POSITION_KEY)
            }
          }
        } catch (e) {}
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [cacheDataBeforeNavigation])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if (!initialData.hasData || initialData.scrollY <= 0) {
      setIsRestoringScroll(false)
      return
    }
    
    let attempts = 0
    const startTime = Date.now()
    
    const tick = () => {
      if (!isMountedRef.current) return
      
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const targetY = Math.min(initialData.scrollY, maxScroll)
      
      window.scrollTo(0, targetY)
      document.documentElement.scrollTop = targetY
      document.body.scrollTop = targetY
      
      const currentY = window.scrollY || document.documentElement.scrollTop
      const closeEnough = Math.abs(currentY - targetY) <= 5
      const elapsed = Date.now() - startTime
      attempts++
      
      if ((closeEnough && currentY > 0) || elapsed > 3000 || attempts > 50) {
        if (restoreScrollBehaviorRef.current !== null) {
          document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current
          restoreScrollBehaviorRef.current = null
        }
        if (isMountedRef.current) setIsRestoringScroll(false)
        sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
        sessionStorage.removeItem(SCROLL_POSITION_KEY)
        return
      }
      
      requestAnimationFrame(tick)
    }
    
    requestAnimationFrame(tick)
  }, [initialData.hasData, initialData.scrollY])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (restoreScrollBehaviorRef.current !== null && typeof document !== "undefined") {
        document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current
        restoreScrollBehaviorRef.current = null
      }
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      if (lastScrollY.current !== scrollY) {
        lastScrollY.current = scrollY
        if (isMountedRef.current) setShowBackToTop(scrollY > 300)
      }
    }
    window.addEventListener("scroll", checkScroll, { passive: true })
    const interval = setInterval(checkScroll, 300)
    return () => {
      window.removeEventListener("scroll", checkScroll)
      clearInterval(interval)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const ids = new Set<string>()
    loadedResults.flat().forEach(item => {
      if (item?.id) ids.add(item.id)
    })
    loadedIdsRef.current = ids
  }, [loadedResults])

  const doSearch = useCallback(async (query: string) => {
    if (!query.trim()) return
    setSearch(query)
    setInputValue(query)
    setHasSearched(true)
    setIsInitialLoading(true)
    setCurrentPage(1)
    setTotalPages(0)
    loadedIdsRef.current = new Set()
    fetchingRef.current = false
    
    const loadStartTime = Date.now()
    
    try {
      const res = await fetch(`/api/search/articles?q=${encodeURIComponent(query)}&page=1`)
      const data = await res.json()
      
      const elapsed = Date.now() - loadStartTime
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) {
        await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) })
        loadingTimeoutRef.current = null
      }
      
      if (!isMountedRef.current) return
      
      if (data.results?.length > 0) {
        data.results.forEach((a: Article) => { if (a?.id) loadedIdsRef.current.add(a.id) })
        setLoadedResults([data.results])
        setCurrentPage(data.currentPage || 1)
        setTotalPages(data.totalPages || 0)
      } else {
        setLoadedResults([])
        setTotalPages(0)
      }
      window.history.replaceState({}, '', `/search/articles?q=${encodeURIComponent(query)}`)
    } catch (error) {
      console.error("Search error:", error)
      if (isMountedRef.current) {
        setLoadedResults([])
        setTotalPages(0)
      }
    } finally {
      if (isMountedRef.current) setIsInitialLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (fetchingRef.current) return
    if (currentPage >= totalPages) return
    if (!search) return
    
    const searchAtStart = search
    fetchingRef.current = true
    setIsLoadingMore(true)
    
    const loadStartTime = Date.now()
    const nextPage = currentPage + 1
    
    try {
      const res = await fetch(`/api/search/articles?q=${encodeURIComponent(searchAtStart)}&page=${nextPage}`)
      const data = await res.json()
      
      const elapsed = Date.now() - loadStartTime
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) {
        await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) })
        loadingTimeoutRef.current = null
      }
      
      if (searchAtStart !== search || !isMountedRef.current) {
        fetchingRef.current = false
        setIsLoadingMore(false)
        return
      }
      
      if (data.results?.length > 0) {
        const newItems = data.results.filter((a: Article) => a?.id && !loadedIdsRef.current.has(a.id))
        if (newItems.length > 0) {
          newItems.forEach((a: Article) => loadedIdsRef.current.add(a.id))
          setLoadedResults(prev => [...prev, newItems])
        }
        setCurrentPage(data.currentPage || nextPage)
        setTotalPages(data.totalPages || totalPages)
      }
    } catch (error) {
      console.error("Error loading more:", error)
    } finally {
      if (searchAtStart === search && isMountedRef.current) {
        fetchingRef.current = false
        setIsLoadingMore(false)
      }
    }
  }, [currentPage, totalPages, search])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (isInitialLoading || isRestoringScroll) return
    if (currentPage >= totalPages) return
    
    const sentinel = sentinelRef.current
    if (!sentinel) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !fetchingRef.current && currentPage < totalPages) {
          loadMore()
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    )
    
    observer.observe(sentinel)
    observerRef.current = observer
    return () => { observer.disconnect(); observerRef.current = null }
  }, [isInitialLoading, isRestoringScroll, currentPage, totalPages, loadMore])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isInitialLoading || isRestoringScroll) return
    if (currentPage >= totalPages) return
    if (fetchingRef.current) return
    
    const checkHeight = () => {
      const docHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      if (docHeight <= viewportHeight + 200 && currentPage < totalPages) loadMore()
    }
    const timeout = setTimeout(checkHeight, 500)
    return () => clearTimeout(timeout)
  }, [loadedResults, isInitialLoading, isRestoringScroll, currentPage, totalPages, loadMore])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = inputValue.trim()
    if (query) {
      sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
      sessionStorage.removeItem(SCROLL_STATE_KEY)
      sessionStorage.removeItem(CACHED_DATA_KEY)
      sessionStorage.removeItem(SCROLL_POSITION_KEY)
      doSearch(query)
    } else {
      window.location.href = '/articles'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearSearch = () => {
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
    sessionStorage.removeItem(SCROLL_STATE_KEY)
    sessionStorage.removeItem(CACHED_DATA_KEY)
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
    window.location.href = '/articles'
  }

  const allLoadedResults = loadedResults.flat()
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
              <h1 className="text-3xl font-bold text-emerald mb-2">Search Articles</h1>
              <p className="text-muted-foreground">
                {hasSearched && allLoadedResults.length > 0
                  ? `Found ${allLoadedResults.length} article${allLoadedResults.length !== 1 ? 's' : ''} for "${search}"`
                  : hasSearched
                    ? `No results found for "${search}"`
                    : "Search our collection of Islamic articles"
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    if (!e.target.value.trim()) clearSearch()
                  }}
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

          {isInitialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => <ArticleSkeletonCard key={i} />)}
            </div>
          ) : allLoadedResults.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allLoadedResults.map((article) => (
                  <CardWrapper key={article.id}>
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
                      <div className="p-6">
                        <div className="flex md:flex-col flex-row justify-between gap-2 mb-3">
                          <span className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-xs font-medium w-fit">
                            {article.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime} read
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-emerald font-medium text-sm group-hover:gap-1 transition-all">
                          Read more
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </CardWrapper>
                ))}
              </div>
              <div ref={sentinelRef} className="h-4" />
              {isLoadingMore && <ArticleLoadingAnimation />}
              {!hasMore && allLoadedResults.length > 0 && !isLoadingMore && (
                <EndOfListIndicator totalCount={allLoadedResults.length} />
              )}
            </>
          ) : hasSearched ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">Try a different search term</p>
              <button onClick={clearSearch} className="text-emerald hover:text-emerald/80 font-medium">Back to all articles</button>
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">Search for articles</h3>
              <p className="text-muted-foreground">Type a search term above to find articles</p>
            </div>
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
    </>
  )
}