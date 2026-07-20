"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, HelpCircle, ChevronDown, ChevronUp, X, ArrowUp, MessageCircle } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { HorizontalScroller } from "@/components/ui/horizontal-scroller"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { qaItems } from "@/lib/qa"

const PAGE_SIZE = 10
const MIN_LOADING_TIME = 400
const SCROLL_RESTORE_FLAG = "qa_scroll_restore_flag"
const SCROLL_STATE_KEY = "qa_scroll_state"
const CACHED_DATA_KEY = "qa_cached_data"
const SCROLL_POSITION_KEY = "qa_scroll_position"
const LAST_CATEGORY_KEY = "qa_last_category"

type QAItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

interface QAClientProps {
  qaItems: QAItem[]
  totalPages: number
  totalItems: number
}

const allCategories = ["All", ...new Set(qaItems.map(item => item.category).filter(Boolean))]

function QASkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald/20 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-16 bg-gold/20 rounded-full" />
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

function QALoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-14 h-14">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-emerald/20 rounded-sm animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-emerald/30 rounded-sm animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-9 h-8 bg-emerald rounded-lg shadow-md animate-bounce">
          <div className="w-full h-full flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-emerald">Loading more questions</p>
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
        <p className="text-sm font-medium text-emerald">Searching Q&A...</p>
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
          <MessageCircle className="w-4 h-4 text-emerald/60" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-medium">All questions loaded</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{totalCount} Q&A in collection</p>
      </div>
    </div>
  )
}

export default function QAClient({ qaItems: initialItems, totalPages: initialTotalPages, totalItems: initialTotalItems }: QAClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [inputValue, setInputValue] = useState(searchParams.get('q') || "")
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem(LAST_CATEGORY_KEY) || "All"
    return "All"
  })

  const [loadedItems, setLoadedItems] = useState<QAItem[][]>(() => {
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      if (needsRestore) {
        const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
        if (snapshot) { try { const p = JSON.parse(snapshot); if (Array.isArray(p.pages) && p.pages.length > 0) return p.pages } catch (e) {} }
        const cached = sessionStorage.getItem(CACHED_DATA_KEY)
        if (cached) { try { const p = JSON.parse(cached); if (Array.isArray(p.pages) && p.pages.length > 0) return p.pages } catch (e) {} }
      }
    }
    return [initialItems]
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const fetchingRef = useRef(false)
  const isMountedRef = useRef(true)
  const loadedIdsRef = useRef(new Set<string>())
  const restoreScrollBehaviorRef = useRef<string | null>(null)
  const lastScrollY = useRef(0)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const categoryRequestIdRef = useRef(0)
  const searchRequestIdRef = useRef(0)
  const scrollRestoredRef = useRef(false)

  useEffect(() => { const ids = new Set<string>(); loadedItems.flat().forEach(item => { if (item?.id) ids.add(item.id) }); loadedIdsRef.current = ids }, [])

  const cacheDataBeforeNavigation = useCallback(() => {
    if (typeof window === "undefined") return
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    const snapshot = { pages: loadedItems, currentPage, totalPages, category: selectedCategory, search, scrollY, timestamp: Date.now() }
    sessionStorage.setItem(CACHED_DATA_KEY, JSON.stringify({ pages: loadedItems, currentPage, totalPages, search, timestamp: Date.now() }))
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(snapshot))
  }, [currentPage, loadedItems, totalPages, selectedCategory, search])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    if (restoreScrollBehaviorRef.current === null) { restoreScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || ""; document.documentElement.style.scrollBehavior = "auto" }
  }, [])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if (scrollRestoredRef.current) return
    const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
    if (!needsRestore || loadedItems.flat().length === 0) { setIsRestoringScroll(false); return }
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
  }, [loadedItems.length])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href) {
        try {
          const url = new URL(target.href)
          if (url.origin === window.location.origin && url.pathname.includes('/qa/') && !url.pathname.endsWith('/qa')) cacheDataBeforeNavigation()
        } catch (e) {}
      }
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
  useEffect(() => { const ids = new Set<string>(); loadedItems.flat().forEach(item => { if (item?.id) ids.add(item.id) }); loadedIdsRef.current = ids }, [loadedItems])

  const loadMore = useCallback(async () => {
    if (fetchingRef.current) return
    if (currentPage >= totalPages) return
    const categoryAtStart = selectedCategory; const searchAtStart = search
    fetchingRef.current = true; setIsLoadingMore(true)
    const nextPage = currentPage + 1
    try {
      const params = new URLSearchParams({ page: nextPage.toString(), category: categoryAtStart, search: searchAtStart })
      const res = await fetch(`/api/qa?${params}`); const data = await res.json()
      const elapsed = Date.now() - Date.now()
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) { await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) }); loadingTimeoutRef.current = null }
      if (categoryAtStart !== selectedCategory || searchAtStart !== search || !isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false); return }
      if (data.items?.length > 0) {
        const newItems = data.items.filter((a: QAItem) => a?.id && !loadedIdsRef.current.has(a.id))
        if (newItems.length > 0) { newItems.forEach((a: QAItem) => loadedIdsRef.current.add(a.id)); setLoadedItems(prev => [...prev, newItems]) }
        setCurrentPage(data.currentPage || nextPage); setTotalPages(data.totalPages || totalPages)
      }
    } catch (error) { console.error("Error loading more:", error) }
    finally { if (categoryAtStart === selectedCategory && isMountedRef.current) { fetchingRef.current = false; setIsLoadingMore(false) } }
  }, [currentPage, totalPages, selectedCategory, search])

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

  const handleCategoryChange = useCallback(async (category: string) => {
    if (category === selectedCategory) return
    const requestId = ++categoryRequestIdRef.current
    setSelectedCategory(category); setCurrentPage(1); setTotalPages(1)
    loadedIdsRef.current = new Set(); fetchingRef.current = false
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG); sessionStorage.removeItem(SCROLL_STATE_KEY); sessionStorage.removeItem(SCROLL_POSITION_KEY)
    if (typeof window !== "undefined") sessionStorage.setItem(LAST_CATEGORY_KEY, category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      const params = new URLSearchParams({ page: '1', category, search })
      const res = await fetch(`/api/qa?${params}`); const data = await res.json()
      if (requestId !== categoryRequestIdRef.current || !isMountedRef.current) return
      if (data.items?.length > 0) { data.items.forEach((a: QAItem) => { if (a?.id) loadedIdsRef.current.add(a.id) }); setLoadedItems([data.items]); setCurrentPage(data.currentPage || 1); setTotalPages(data.totalPages || 1) }
      else { setLoadedItems([]); setTotalPages(1) }
    } catch (error) { console.error("Error switching category:", error) }
  }, [selectedCategory, search])

  // Smooth search like books page
  const performSearch = useCallback(async (query: string) => {
    const requestId = ++searchRequestIdRef.current
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG); sessionStorage.removeItem(SCROLL_STATE_KEY); sessionStorage.removeItem(SCROLL_POSITION_KEY); sessionStorage.removeItem(CACHED_DATA_KEY)
    scrollRestoredRef.current = false
    setIsSearching(true); setSearch(query)
    setLoadedItems([]); setCurrentPage(1); setTotalPages(0)
    loadedIdsRef.current = new Set(); fetchingRef.current = false
    setExpandedId(null)
    
    if (query) {
      router.replace(`/qa?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.replace('/qa', { scroll: false })
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    const loadStartTime = Date.now()
    
    try {
      const params = new URLSearchParams({ page: '1', category: selectedCategory, search: query })
      const res = await fetch(`/api/qa?${params}`)
      const data = await res.json()
      
      if (requestId !== searchRequestIdRef.current) return
      
      const elapsed = Date.now() - loadStartTime
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) { await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) }); loadingTimeoutRef.current = null }
      
      if (requestId !== searchRequestIdRef.current || !isMountedRef.current) return
      
      if (data.items?.length > 0) {
        data.items.forEach((a: QAItem) => { if (a?.id) loadedIdsRef.current.add(a.id) })
        setLoadedItems([data.items])
        setCurrentPage(data.currentPage || 1)
        setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.items.length) / PAGE_SIZE))
      } else {
        setLoadedItems([])
        setTotalPages(0)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      if (requestId === searchRequestIdRef.current && isMountedRef.current) {
        setIsSearching(false)
      }
    }
  }, [router, selectedCategory])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); const query = inputValue.trim(); performSearch(query) }
  const clearSearch = () => { setInputValue(""); setSearch(""); performSearch("") }

  const formatCategory = (category: string) => {
    if (category === "All") return category
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const allLoadedItems = loadedItems.flat()
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
              <h1 className="text-3xl font-bold text-emerald mb-2">Questions & Answers</h1>
              <p className="text-muted-foreground">
                {search
                  ? `Found ${allLoadedItems.length} Q&A${allLoadedItems.length !== 1 ? 's' : ''} for "${search}"`
                  : "Find answers to common questions about Islam"
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search questions and answers..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="pl-9 pr-9 rounded-xl" />
                {inputValue && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>
          </div>

          <HorizontalScroller className="gap-2" containerClassName="mb-6">
            {allCategories.map((category) => (
              <button key={category} onClick={() => handleCategoryChange(category)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category ? "bg-emerald text-white" : "bg-muted text-muted-foreground hover:bg-emerald/10 hover:text-emerald"}`}>
                {formatCategory(category)}
              </button>
            ))}
          </HorizontalScroller>

          {isSearching && <SearchLoadingAnimation />}

          {!isSearching && allLoadedItems.length === 0 && (
            <div className="text-center py-20">
              <HelpCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Q&A found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter</p>
              <button onClick={() => handleCategoryChange("All")} className="text-emerald hover:text-emerald/80 font-medium">Browse all questions</button>
            </div>
          )}

          {!isSearching && allLoadedItems.length > 0 && (
            <>
              <div className="space-y-4">
                {allLoadedItems.map((item) => (
                  <CardWrapper key={item.id}>
                    <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="w-full text-left p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-5 h-5 text-emerald" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full font-medium">{formatCategory(item.category)}</span>
                          </div>
                          <h3 className="font-semibold text-lg">{item.question}</h3>
                        </div>
                        {expandedId === item.id ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                      </div>
                      <AnimatePresence>
                        {expandedId === item.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <p className="mt-4 ml-14 text-muted-foreground leading-relaxed">{item.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </CardWrapper>
                ))}
              </div>
              <div ref={sentinelRef} className="h-4" />
              {isLoadingMore && <QALoadingAnimation />}
              {!hasMore && allLoadedItems.length > 0 && !isLoadingMore && <EndOfListIndicator totalCount={allLoadedItems.length} />}
            </>
          )}

          <button onClick={scrollToTop} className={`scroll-top-btn w-12 h-12 bg-emerald text-white cursor-pointer rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-emerald/90 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} aria-label="Back to top" style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}