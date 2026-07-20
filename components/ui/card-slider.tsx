"use client"

import type React from "react"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CardSliderProps {
  children: React.ReactNode
  className?: string
  scrollAmount?: number
  viewAllHref?: string
  viewAllText?: string
}

export function CardSlider({
  children,
  className,
  scrollAmount = 280,
  viewAllHref,
  viewAllText = "View All",
}: CardSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div>
      {/* Carousel controls */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-xl bg-transparent"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-xl bg-transparent"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className={cn("flex overflow-x-auto scrollbar-hide", className)}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {viewAllHref && (
        <div className="mt-4 text-center">
          <Button asChild variant="outline" className="rounded-xl border-emerald text-emerald hover:bg-emerald/10">
            <Link href={viewAllHref}>{viewAllText}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
