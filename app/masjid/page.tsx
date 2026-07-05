"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Phone, Clock, ChevronRight, X, ArrowUp } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"

const SCROLL_RESTORE_FLAG = "masjid_scroll_restore_flag"
const SCROLL_STATE_KEY = "masjid_scroll_state"
const CACHED_DATA_KEY = "masjid_cached_data"
const SCROLL_POSITION_KEY = "masjid_scroll_position"

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

const allMasjids = [
  { id: "1", name: "Jamiul Muslimin Masjid", address: "52 Đ. Nguyễn Văn Trỗi, Cầu Kiệu, Hồ Chí Minh", phone: "+84 28 3824 6543", hours: "4:15 AM - 10:00 PM", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFSoYkpscFEThiJ374-kyhqsvmoho1skdbvIXPUCd2pKsxrZpcpUYnZKX_voE7WdgnbNDRzGok4Yawe5sboi_0PigKSJMI0dJcLfY31uAexqy6qW1RjD5I_-738soCndmQVK4Wd7OQ53Mb2=s1360-w1360-h1020-rw" },
  { id: "2", name: "Saigon Central Mosque (Masjid Al-Rahim)", address: "459 Trần Hưng Đạo, District 5, Ho Chi Minh City", phone: "+84 28 3836 2149", hours: "5:00 AM - 9:00 PM", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH2-MWag-sgPWnch6SxxR8V0SUajSjQUgDAKYJ75nSEQv4V5BDCBQYJ5EmfKoWJsfvjYPLz2YdNFhxkr3lbTFgfpDfGos-vYIrmIZjRUXokL2mFhQlw0LrIeYSPM22I3UlooStcoQ=s1360-w1360-h1020-rw" },
  { id: "3", name: "Masjid Jamiul Azhar Mosque", address: "Tổ 8, ấp Châu Giang, Xã Châu Phong, An Giang Province", phone: "+84 941 852 762", hours: "Open 24 hours", image: "https://file3.qdnd.vn/data/images/3/2019/02/26/hieu_ta/1%2025.jpg?dpi=150&quality=100&w=500" },
  { id: "4", name: "Masjid Mubarak (Cham Mosque)", address: "Châu Giang Village, An Giang Province", phone: "+84 296 3861 234", hours: "Open 24 hours", image: "https://evivatour.com/wp-content/uploads/2021/09/Masjid-Jamiul-Azhar-Mosque-An-Giang.jpg" },
  { id: "5", name: "Da Nang Mosque (Masjid Al-Akbar)", address: "123 Nguyễn Văn Linh, Da Nang", phone: "+84 236 3823 789", hours: "5:30 AM - 9:30 PM", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtL7fOkALJi-tchGSfuqS96W3ngPl2m_bbyw&s" },
  { id: "6", name: "Hanoi Muslim Community Center", address: "45 Hàng Lược, Hoàn Kiếm, Hanoi", phone: "+84 24 3826 1234", hours: "6:00 AM - 9:00 PM", image: "https://img2.beritasatu.com/cache/jakartaglobe/960x620-3/2015/01/DSC_1892.jpg" },
]

type Masjid = typeof allMasjids[0]

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
        <p className="text-sm font-medium text-emerald">Searching masjids...</p>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        </span>
      </div>
    </div>
  )
}

export default function MasjidPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [inputValue, setInputValue] = useState(searchParams.get('q') || "")
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

  // Get filtered results instantly from local data
  const [displayedMasjids, setDisplayedMasjids] = useState<Masjid[]>(() => {
    const query = searchParams.get('q') || ""
    if (!query) return allMasjids
    const q = query.toLowerCase()
    return allMasjids.filter(m => m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q))
  })

  const restoreScrollBehaviorRef = useRef<string | null>(null)
  const lastScrollY = useRef(0)
  const isMountedRef = useRef(true)
  const scrollRestoredRef = useRef(false)

  const cacheDataBeforeNavigation = useCallback(() => {
    if (typeof window === "undefined") return
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    sessionStorage.setItem(CACHED_DATA_KEY, JSON.stringify({ search, timestamp: Date.now() }))
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollY.toString())
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    sessionStorage.setItem(SCROLL_STATE_KEY, JSON.stringify({ search, scrollY, timestamp: Date.now() }))
  }, [search])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    if (restoreScrollBehaviorRef.current === null) { restoreScrollBehaviorRef.current = document.documentElement.style.scrollBehavior || ""; document.documentElement.style.scrollBehavior = "auto" }
  }, [])

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return
    if (scrollRestoredRef.current) return
    const needsRestore = sessionStorage.getItem(SCROLL_RESTORE_FLAG) === "true"
    if (!needsRestore || displayedMasjids.length === 0) { setIsRestoringScroll(false); return }
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
  }, [displayedMasjids.length])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href) {
        try {
          const url = new URL(target.href)
          if (url.origin === window.location.origin && url.pathname.includes('/masjid/') && !url.pathname.endsWith('/masjid')) {
            cacheDataBeforeNavigation()
          }
        } catch (e) {}
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [cacheDataBeforeNavigation])

  useEffect(() => { isMountedRef.current = true; return () => { isMountedRef.current = false } }, [])
  useEffect(() => {
    if (typeof window === "undefined") return
    const checkScroll = () => { const scrollY = window.scrollY || document.documentElement.scrollTop || 0; if (lastScrollY.current !== scrollY) { lastScrollY.current = scrollY; if (isMountedRef.current) setShowBackToTop(scrollY > 300) } }
    window.addEventListener("scroll", checkScroll, { passive: true })
    return () => window.removeEventListener("scroll", checkScroll)
  }, [])
  const scrollToTop = useCallback(() => { if (typeof window === "undefined") return; window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  // Smooth search - same page, no full reload (like QA page)
  const performSearch = useCallback((query: string) => {
    sessionStorage.removeItem(SCROLL_RESTORE_FLAG)
    sessionStorage.removeItem(SCROLL_STATE_KEY)
    sessionStorage.removeItem(SCROLL_POSITION_KEY)
    scrollRestoredRef.current = false
    
    setIsSearching(true)
    setSearch(query)
    
    // Update URL without reload
    if (query) {
      router.replace(`/masjid?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.replace('/masjid', { scroll: false })
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Small delay for smooth animation
    setTimeout(() => {
      if (!isMountedRef.current) return
      
      if (query) {
        const q = query.toLowerCase()
        const filtered = allMasjids.filter(m => m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q))
        setDisplayedMasjids(filtered)
      } else {
        setDisplayedMasjids(allMasjids)
      }
      
      setIsSearching(false)
    }, 200)
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
              <h1 className="text-3xl font-bold text-emerald mb-2">Masjid Directory</h1>
              <p className="text-muted-foreground">
                {search
                  ? `Found ${displayedMasjids.length} masjid${displayedMasjids.length !== 1 ? 's' : ''} for "${search}"`
                  : "Find mosques and prayer spaces in Vietnam"
                }
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search masjids..."
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

          {/* No results */}
          {!isSearching && displayedMasjids.length === 0 && search && (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No masjids found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search terms</p>
              <button onClick={clearSearch} className="text-emerald hover:text-emerald/80 font-medium">Clear search</button>
            </div>
          )}

          {/* Masjid Grid */}
          {!isSearching && displayedMasjids.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMasjids.map((masjid, index) => (
                <CardWrapper key={masjid.id} delay={index * 0.05}>
                  <Link href={`/masjid/${masjid.id}`} onClick={() => cacheDataBeforeNavigation()}>
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img
                        src={masjid.image}
                        alt={masjid.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://placehold.co/800x400/059669/FFFFFF?text=${encodeURIComponent(masjid.name)}` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-lg text-white">{masjid.name}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 text-emerald flex-shrink-0" />
                          <span className="line-clamp-2">{masjid.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald" />
                          <span>{masjid.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald" />
                          <span>{masjid.hours}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-emerald font-medium text-sm">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </CardWrapper>
              ))}
            </div>
          )}

          <button
            onClick={scrollToTop}
            className={`scroll-top-btn w-12 h-12 bg-emerald text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-emerald/90 ${
              showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Back to top"
            style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}