"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, BookOpen, Download, X, ArrowUp } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 10
const MIN_LOADING_TIME = 600
const SCROLL_RESTORE_FLAG = "books_scroll_restore_flag"
const SCROLL_STATE_KEY = "books_scroll_state"
const CACHED_DATA_KEY = "books_cached_data"
const SCROLL_POSITION_KEY = "books_scroll_position"

type Book = {
  id: string;
  title: string;
  author: string;
  translator?: string;
  category: string;
  pages: number;
  color: string;
  thumbnail: string | null;
  description: string;
  url?: string;
  pdfUrl: string;
}

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

interface BooksClientProps {
  books: Book[]
  totalPages: number
  totalBooks: number
}

function BookSkeletonCard() {
  const colors = [
    "from-emerald-400 to-emerald-600",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-amber-400 to-amber-600",
    "from-rose-400 to-rose-600",
  ]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className={`aspect-[3/4] bg-gradient-to-br ${randomColor} p-5 flex flex-col justify-between relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative z-10">
          <div className="w-10 h-1.5 bg-white/20 rounded-full mb-4" />
          <div className="w-8 h-8 bg-white/10 rounded-lg" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="h-4 bg-white/20 rounded w-3/4" />
          <div className="h-4 bg-white/20 rounded w-1/2" />
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-8 w-8 bg-muted rounded-xl" />
      </div>
    </div>
  )
}

function BookLoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-14 h-14">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-emerald/20 rounded-sm animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-emerald/30 rounded-sm animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-9 h-8 bg-emerald rounded-lg shadow-md animate-bounce">
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-emerald">Loading more books</p>
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
        <p className="text-sm font-medium text-emerald">Searching books...</p>
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
          <BookOpen className="w-4 h-4 text-emerald/60" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-medium">All books loaded</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{totalCount} books in collection</p>
      </div>
    </div>
  )
}

export function BookCover({ title, author, color, thumbnail }: { title: string; author: string; color: string; thumbnail?: string | null }) {
  const isActualThumbnail = thumbnail && thumbnail !== "https://islamhouse.com/logo_IslamHouse.jpg";
  return (
    <div className={`aspect-[3/4] bg-gradient-to-br ${color} p-5 flex flex-col justify-between rounded-t-2xl relative overflow-hidden`}>
      {isActualThumbnail && (
        <div className="absolute inset-0">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover rounded-t-2xl" />
          <div className="absolute inset-0 bg-black/20 rounded-t-2xl" />
        </div>
      )}
      {!isActualThumbnail && (
        <>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
        </>
      )}
      <div className="relative z-10">
        {!isActualThumbnail && <div className="w-10 h-1.5 bg-white/40 rounded-full mb-4" />}
        {!isActualThumbnail && <BookOpen className="w-8 h-8 text-white/60 mb-3" />}
      </div>
      <div className="relative z-10">
        <h3 className={`font-bold text-base leading-tight mb-2 line-clamp-3 ${isActualThumbnail ? 'text-white drop-shadow-lg' : 'text-white'}`}>{title}</h3>
        <p className={`text-sm line-clamp-1 ${isActualThumbnail ? 'text-white drop-shadow-lg' : 'text-white/80'}`}>{author}</p>
      </div>
    </div>
  )
}

export default function BooksClient({ books: initialBooks, totalPages: initialTotalPages, totalBooks: initialTotalBooks }: BooksClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [inputValue, setInputValue] = useState(searchParams.get('q') || "")
  
  const [loadedBooks, setLoadedBooks] = useState<Book[][]>(() => {
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
    return [initialBooks]
  })
  
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      if (needsRestore) {
        const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
        if (snapshot) { try { const p = JSON.parse(snapshot); if (p.currentPage) return p.currentPage } catch (e) {} }
        const cached = sessionStorage.getItem(CACHED_DATA_KEY)
        if (cached) { try { const p = JSON.parse(cached); if (p.currentPage) return p.currentPage } catch (e) {} }
      }
    }
    return 1
  })
  
  const [totalPages, setTotalPages] = useState(() => {
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      if (needsRestore) {
        const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
        if (snapshot) { try { const p = JSON.parse(snapshot); if (p.totalPages) return p.totalPages } catch (e) {} }
        const cached = sessionStorage.getItem(CACHED_DATA_KEY)
        if (cached) { try { const p = JSON.parse(cached); if (p.totalPages) return p.totalPages } catch (e) {} }
      }
    }
    return initialTotalPages
  })
  
  const [totalBooks, setTotalBooks] = useState(() => {
    if (typeof window !== 'undefined') {
      const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
      if (needsRestore) {
        const snapshot = sessionStorage.getItem(SCROLL_STATE_KEY)
        if (snapshot) { try { const p = JSON.parse(snapshot); if (p.totalBooks) return p.totalBooks } catch (e) {} }
        const cached = sessionStorage.getItem(CACHED_DATA_KEY)
        if (cached) { try { const p = JSON.parse(cached); if (p.totalBooks) return p.totalBooks } catch (e) {} }
      }
    }
    return initialTotalBooks
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
  const prefetchCacheRef = useRef<Map<string, Book>>(new Map())
  const lastScrollY = useRef(0)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollRestoredRef = useRef(false)
  const searchRequestIdRef = useRef(0)

  // Initialize loadedIds
  useEffect(() => {
    const ids = new Set<string>()
    loadedBooks.flat().forEach(item => { if (item?.id) ids.add(item.id) })
    loadedIdsRef.current = ids
  }, [])

  const prefetchBook = useCallback(async (bookId: string) => {
    if (prefetchCacheRef.current.has(bookId)) return
    try {
      const res = await fetch(`/api/books/${bookId}`)
      if (res.ok) { const data = await res.json(); prefetchCacheRef.current.set(bookId, data) }
    } catch (error) {}
  }, [])

  const cacheDataBeforeNavigation = useCallback((bookId?: string) => {
    if (typeof window === "undefined") return
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    
    const snapshot = { 
      pages: loadedBooks, 
      currentPage, 
      totalPages, 
      totalBooks, 
      scrollY, 
      search,
      timestamp: Date.now() 
    }
    
    sessionStorage.setItem(CACHED_DATA_KEY, JSON.stringify({ 
      pages: loadedBooks, 
      currentPage, 
      totalPages, 
      totalBooks,
      search,
      timestamp: Date.now() 
    }))
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify(snapshot))
    
    if (bookId && prefetchCacheRef.current.has(bookId)) {
      sessionStorage.setItem(`book_${bookId}`, JSON.stringify(prefetchCacheRef.current.get(bookId)))
    }
  }, [currentPage, loadedBooks, totalPages, totalBooks, search])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    if (restoreScrollBehaviorRef.current === null) {
      restoreScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || ""
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  // Restore scroll position ONCE when coming back from detail page
  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if (scrollRestoredRef.current) return
    
    const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
    if (!needsRestore) {
      setIsRestoringScroll(false)
      return
    }
    
    const savedScrollY = parseInt(sessionStorage.getItem(SCROLL_POSITION_KEY) || "0", 10) || 0
    if (savedScrollY <= 0) {
      setIsRestoringScroll(false)
      sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
      sessionStorage.removeItem(SCROLL_POSITION_KEY)
      sessionStorage.removeItem(SCROLL_STATE_KEY)
      return
    }
    
    scrollRestoredRef.current = true
    
    let attempts = 0
    const maxAttempts = 40
    const startTime = Date.now()
    
    const tick = () => {
      if (!isMountedRef.current) return
      
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const targetY = Math.min(savedScrollY, maxScroll)
      
      if (maxScroll < targetY && attempts < maxAttempts) {
        attempts++
        requestAnimationFrame(tick)
        return
      }
      
      window.scrollTo(0, targetY)
      document.documentElement.scrollTop = targetY
      document.body.scrollTop = targetY
      
      const currentY = window.scrollY || document.documentElement.scrollTop
      const closeEnough = Math.abs(currentY - targetY) <= 20
      const elapsed = Date.now() - startTime
      attempts++
      
      if ((closeEnough && currentY > 0) || elapsed > 3000 || attempts > maxAttempts) {
        if (restoreScrollBehaviorRef.current !== null) { 
          document.documentElement.style.scrollBehavior = restoreScrollBehaviorRef.current
          restoreScrollBehaviorRef.current = null 
        }
        
        setIsRestoringScroll(false)
        
        sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
        sessionStorage.removeItem(SCROLL_POSITION_KEY)
        
        return
      }
      
      requestAnimationFrame(tick)
    }
    
    setTimeout(() => requestAnimationFrame(tick), 50)
  }, [loadedBooks.length])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href) {
        try {
          const url = new URL(target.href)
          if (url.origin === window.location.origin && url.pathname.includes('/books/') && !url.pathname.endsWith('/books')) {
            const bookId = url.pathname.split('/').pop()
            if (bookId) {
              cacheDataBeforeNavigation(bookId)
            }
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
    return () => { window.removeEventListener("scroll", checkScroll); clearInterval(interval) }
  }, [])

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const ids = new Set<string>()
    loadedBooks.flat().forEach(item => { if (item?.id) ids.add(item.id) })
    loadedIdsRef.current = ids
  }, [loadedBooks])

  const loadMore = useCallback(async () => {
    if (fetchingRef.current) return
    if (currentPage >= totalPages) return
    
    const searchAtStart = search
    fetchingRef.current = true
    setIsLoadingMore(true)
    
    const loadStartTime = Date.now()
    const nextPage = currentPage + 1
    
    try {
      const params = new URLSearchParams({ page: nextPage.toString(), search: searchAtStart })
      const res = await fetch(`/api/books?${params}`)
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
      
      if (data.books?.length > 0) {
        const newItems = data.books.filter((b: Book) => b?.id && !loadedIdsRef.current.has(b.id))
        
        if (newItems.length > 0) { 
          newItems.forEach((b: Book) => loadedIdsRef.current.add(b.id))
          setLoadedBooks(prev => [...prev, newItems])
        }
        
        setCurrentPage(data.currentPage || nextPage)
        setTotalPages(data.totalPages || totalPages)
        if (data.totalBooks) setTotalBooks(data.totalBooks)
      } else {
        setCurrentPage(nextPage)
        if (nextPage >= totalPages) {
          setTotalPages(nextPage)
        }
      }
    } catch (error) { 
      console.error("Error loading more books:", error)
    } finally { 
      if (isMountedRef.current) { 
        fetchingRef.current = false
        setIsLoadingMore(false)
      }
    }
  }, [currentPage, totalPages, search])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (typeof window === "undefined") return
    
    if (observerRef.current) { 
      observerRef.current.disconnect()
      observerRef.current = null 
    }
    
    if (isSearching || isRestoringScroll) return
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
    
    return () => { 
      observer.disconnect()
      observerRef.current = null 
    }
  }, [isSearching, isRestoringScroll, currentPage, totalPages, loadMore])

  // Auto-load if page is too short
  useEffect(() => {
    if (typeof window === "undefined") return
    if (isSearching || isRestoringScroll) return
    if (currentPage >= totalPages) return
    if (fetchingRef.current) return
    
    const timer = setTimeout(() => {
      const docHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      
      if (docHeight <= viewportHeight + 200 && currentPage < totalPages) {
        loadMore()
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [loadedBooks, isSearching, isRestoringScroll, currentPage, totalPages, loadMore])

  // Handle search - show loading, fetch results, update URL
  const performSearch = useCallback(async (query: string) => {
    const requestId = ++searchRequestIdRef.current
    
    // Clear session storage
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
    sessionStorage.removeItem(SCROLL_STATE_KEY)
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
    sessionStorage.removeItem(CACHED_DATA_KEY)
    scrollRestoredRef.current = false
    
    setIsSearching(true)
    setSearch(query)
    setLoadedBooks([])
    setCurrentPage(1)
    setTotalPages(0)
    setTotalBooks(0)
    loadedIdsRef.current = new Set()
    fetchingRef.current = false
    
    // Update URL
    if (query) {
      router.replace(`/books?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.replace('/books', { scroll: false })
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    const loadStartTime = Date.now()
    
    try {
      const params = new URLSearchParams({ page: '1', search: query })
      const res = await fetch(`/api/books?${params}`)
      const data = await res.json()
      
      // Check if this request is still valid
      if (requestId !== searchRequestIdRef.current) return
      
      const elapsed = Date.now() - loadStartTime
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remainingTime > 0) { 
        await new Promise(resolve => { loadingTimeoutRef.current = setTimeout(resolve, remainingTime) })
        loadingTimeoutRef.current = null 
      }
      
      if (requestId !== searchRequestIdRef.current || !isMountedRef.current) return
      
      if (data.books?.length > 0) {
        data.books.forEach((b: Book) => { if (b?.id) loadedIdsRef.current.add(b.id) })
        setLoadedBooks([data.books])
        setCurrentPage(data.currentPage || 1)
        setTotalPages(data.totalPages || Math.ceil((data.totalBooks || data.books.length) / PAGE_SIZE))
        setTotalBooks(data.totalBooks || data.books.length)
      } else {
        setLoadedBooks([])
        setTotalPages(0)
        setTotalBooks(0)
      }
    } catch (error) {
      console.error("Search error:", error)
      if (requestId === searchRequestIdRef.current && isMountedRef.current) {
        setLoadedBooks([])
        setTotalPages(0)
        setTotalBooks(0)
      }
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
    // Clear search and go back to all books
    performSearch("")
  }

  const getDownloadFileName = (book: Book) => `${book.title}.pdf`
  const allLoadedBooks = loadedBooks.flat()
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
              <h1 className="text-3xl font-bold text-emerald mb-2">Books</h1>
              <p className="text-muted-foreground">
                {search
                  ? totalBooks > 0
                    ? `Found ${totalBooks} ${totalBooks === 1 ? 'book' : 'books'} for "${search}"`
                    : `Searching for "${search}"...`
                  : "Explore our collection of Islamic literature"
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-9 pr-9 rounded-xl"
                />
                {inputValue && (
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

          {/* Search Loading Animation */}
          {isSearching && (
            <SearchLoadingAnimation />
          )}

          {/* Show skeleton only on initial load with no data */}
          {!isSearching && allLoadedBooks.length === 0 && !search && totalBooks === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => <BookSkeletonCard key={i} />)}
            </div>
          )}

          {/* No results message */}
          {!isSearching && allLoadedBooks.length === 0 && search && totalBooks === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No books found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search terms</p>
              <button onClick={clearSearch} className="text-emerald hover:text-emerald/80 font-medium">
                Clear search
              </button>
            </div>
          )}

          {/* Books Grid */}
          {!isSearching && allLoadedBooks.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {allLoadedBooks.map((book) => (
                  <CardWrapper key={book.id}>
                    <Link 
                      href={`/books/${book.id}`} 
                      onClick={() => cacheDataBeforeNavigation(book.id)} 
                      onMouseEnter={() => prefetchBook(book.id)} 
                      prefetch={false}
                    >
                      <BookCover title={book.title} author={book.author} color={book.color} thumbnail={book.thumbnail} />
                    </Link>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{book.pages} pages</span>
                      {book.pdfUrl ? (
                        <Button size="icon" variant="ghost" className="rounded-xl text-emerald hover:text-emerald hover:bg-emerald/10 cursor-pointer" asChild>
                          <a href={`/api/download?url=${encodeURIComponent(book.pdfUrl)}&name=${encodeURIComponent(getDownloadFileName(book))}`} aria-label={`Download ${book.title}`} title="Download PDF">
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button size="icon" variant="ghost" className="rounded-xl text-emerald/50 cursor-not-allowed" disabled>
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardWrapper>
                ))}
              </div>
              
              {/* Sentinel for infinite scroll */}
              <div ref={sentinelRef} className="h-4 w-full" />
              
              {/* Loading animation for scroll load more */}
              {isLoadingMore && <BookLoadingAnimation />}
              
              {/* End of list */}
              {!hasMore && allLoadedBooks.length > 0 && !isLoadingMore && allLoadedBooks.length >= totalBooks && (
                <EndOfListIndicator totalCount={totalBooks} />
              )}
            </>
          )}

          <button
            onClick={scrollToTop}
            className={`scroll-top-btn w-12 h-12 bg-emerald text-white cursor-pointer rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-emerald/90 ${
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