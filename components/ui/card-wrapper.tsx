"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface CardWrapperProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function CardWrapper({ children, className }: CardWrapperProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  )
}
