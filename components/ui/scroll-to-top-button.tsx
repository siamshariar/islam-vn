"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowUp } from "lucide-react"
import { DETAIL_PAGE_PATTERN } from "@/components/layout/bottom-nav"

interface ScrollToTopButtonProps {
  accent?: "emerald" | "gold"
}

export function ScrollToTopButton({ accent = "emerald" }: ScrollToTopButtonProps) {
  const pathname = usePathname()
  const isBottomNavHidden = DETAIL_PAGE_PATTERN.test(pathname)
  const [visible, setVisible] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      if (lastScrollY.current !== scrollY) {
        lastScrollY.current = scrollY
        setVisible(scrollY > 300)
      }
    }
    window.addEventListener("scroll", checkScroll, { passive: true })
    checkScroll()
    return () => window.removeEventListener("scroll", checkScroll)
  }, [])

  const scrollToTop = () => {
    if (typeof window === "undefined") return
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed ${isBottomNavHidden ? "bottom-6" : "bottom-24"} right-4 lg:bottom-8 lg:right-8 w-12 h-12 text-white cursor-pointer rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
        accent === "emerald" ? "bg-emerald hover:bg-emerald/90" : "bg-gold hover:bg-gold/90"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      style={{
        boxShadow:
          accent === "emerald" ? "0 4px 20px rgba(16, 185, 129, 0.4)" : "0 4px 20px rgba(234, 179, 8, 0.4)",
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
