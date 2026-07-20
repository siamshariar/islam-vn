"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  href?: string
  viewAllText?: string
}

export function SectionHeader({ title, href, viewAllText = "View All" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-emerald to-gold rounded-full" />
        <h2 className="text-2xl font-bold text-emerald">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-emerald transition-colors group"
        >
          {viewAllText}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  )
}
