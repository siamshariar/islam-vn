"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, HelpCircle, ChevronDown, ChevronUp, X, ArrowUp } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { qaItems } from "@/lib/qa"

const PAGE_SIZE = 10
const MIN_LOADING_TIME = 400
const SCROLL_RESTORE_FLAG = "search_qa_scroll_restore_flag"
const SCROLL_STATE_KEY = "search_qa_scroll_state"
const CACHED_DATA_KEY = "search_qa_cached_data"
const SCROLL_POSITION_KEY = "search_qa_scroll_position"

const allQAs = (() => {
  const seen = new Set<string>()
  return qaItems.filter((item) => { if (seen.has(item.id)) return false; seen.add(item.id); return true })
})()

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

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

export default function SearchQAClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlQuery = searchParams.get('q') || ""

  const [search, setSearch] = useState(urlQuery)
  const [inputValue, setInputValue] = useState(urlQuery)
  const [expandedId, setExpandedId] = useState<string | null>(null)
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

  // Get instant results from local data
  const [searchResults, setSearchResults] = useState<any[]>(() => {
    if (!urlQuery) return []
    const normalized = urlQuery.toLowerCase()
    return allQAs.filter((item: any) =>
      item.question.toLowerCase().includes(normalized) ||
      item.answer.toLowerCase().includes(normalized) ||
      item.category.toLowerCase().includes(normalized)
    )
  })

  const restoreScrollBehaviorRef = useRef<string | null>(null)
  const lastScrollY = useRef(0)
  const isMountedRef = useRef(true)
  const scrollRestoredRef = useRef(false)

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    if (restoreScrollBehaviorRef.current === null) { restoreScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || ""; document.documentElement.style.scrollBehavior = "auto" }
  }, [])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if (scrollRestoredRef.current) return
    const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
    if (!needsRestore || searchResults.length === 0) { setIsRestoringScroll(false); return }
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
      if (Date.now() - startTime > 3000 || attempts > maxAttempts) { setIsRestoringScroll(false); sessionStorage.removeItem(SCROLL_RESTORE_FLAG); sessionStorage.removeItem(SCROLL_POSITION_KEY); return }
      requestAnimationFrame(tick)
    }
    setTimeout(() => requestAnimationFrame(tick), 50)
  }, [searchResults.length])

  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false } }, [])
  useEffect(() => {
    if (typeof window === "undefined") return
    const checkScroll = () => { const scrollY = window.scrollY || document.documentElement.scrollTop || 0; if (lastScrollY.current !== scrollY) { lastScrollY.current = scrollY; if (isMountedRef.current) setShowBackToTop(scrollY > 300) } }
    window.addEventListener("scroll", checkScroll, { passive: true })
    return () => window.removeEventListener("scroll", checkScroll)
  }, [])
  const scrollToTop = useCallback(() => { if (typeof window === "undefined") return; window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  const performSearch = useCallback((query: string) => {
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG); sessionStorage.removeItem(SCROLL_STATE_KEY); sessionStorage.removeItem(SCROLL_POSITION_KEY)
    scrollRestoredRef.current = false
    setIsSearching(true); setSearch(query)
    setExpandedId(null)
    setTimeout(() => {
      if (!isMountedRef.current) return
      const normalized = query.toLowerCase()
      const filtered = allQAs.filter((item: any) =>
        item.question.toLowerCase().includes(normalized) ||
        item.answer.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
      )
      setSearchResults(filtered)
      if (query) router.replace(`/search/qa?q=${encodeURIComponent(query)}`, { scroll: false })
      else router.replace('/qa', { scroll: false })
      setIsSearching(false)
    }, 200)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [router])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); const query = inputValue.trim(); if (query) performSearch(query); else router.push('/qa') }
  const clearSearch = () => { setInputValue(""); router.push('/qa') }

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
              <h1 className="text-3xl font-bold text-emerald mb-2">Search Q&A</h1>
              <p className="text-muted-foreground">
                {search && !isSearching
                  ? `Found ${searchResults.length} Q&A${searchResults.length !== 1 ? 's' : ''} for "${search}"`
                  : search ? `Searching for "${search}"...` : "Search our Q&A collection"
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search Q&A..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="pl-9 pr-9 rounded-xl" />
                {inputValue && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {isSearching && <SearchLoadingAnimation />}

          {!isSearching && search && searchResults.length === 0 && (
            <div className="text-center py-12"><p className="text-muted-foreground">No Q&A found for "{search}"</p></div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((item) => (
                <CardWrapper key={item.id}>
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="w-full text-left p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-emerald" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full font-medium">
                            {item.category.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
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
          )}

          <button onClick={scrollToTop} className={`fixed bottom-6 right-6 w-12 h-12 cursor-pointer bg-emerald text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-emerald/90 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} aria-label="Back to top" style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}