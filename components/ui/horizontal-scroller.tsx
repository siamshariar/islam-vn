"use client"

import type React from "react"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HorizontalScrollerProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  scrollAmount?: number
}

export function HorizontalScroller({
  children,
  className,
  containerClassName,
  scrollAmount = 280,
}: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className={cn("flex items-center gap-2", containerClassName)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden lg:flex flex-shrink-0 rounded-xl bg-transparent cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div
        ref={scrollRef}
        className={cn("flex overflow-x-auto scrollbar-hide", className)}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden lg:flex flex-shrink-0 rounded-xl bg-transparent cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
