"use client"

import { useLayoutEffect } from "react"
import Link from "next/link"
import { BookOpen, ChevronLeft, Download, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SegmentBookDetailItem {
  id: string
  title: string
  author: string
  description: string
  color: string
  category: string
  pages: number
  thumbnail?: string | null
  pdfUrl?: string
  detailUrl?: string
}

interface SegmentBookDetailProps {
  book: SegmentBookDetailItem | undefined
  backHref: string
  backLabel: string
  accent: "emerald" | "gold"
}

export function SegmentBookDetail({ book, backHref, backLabel, accent }: SegmentBookDetailProps) {
  const accentText = accent === "emerald" ? "text-emerald" : "text-gold"
  const accentBg = accent === "emerald" ? "bg-emerald hover:bg-emerald/90" : "bg-gold hover:bg-gold/90"
  const accentBorder =
    accent === "emerald" ? "border-emerald text-emerald hover:bg-emerald/10" : "border-gold text-gold hover:bg-gold/10"

  useLayoutEffect(() => {
    if (typeof window === "undefined") return
    window.scrollTo(0, 0)
  }, [])

  if (!book) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
          <Link href={backHref} className={`inline-flex items-center gap-2 hover:underline mb-6 ${accentText}`}>
            <ChevronLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 lg:px-8 py-8">
      <Link href={backHref} className={`inline-flex items-center gap-2 hover:underline mb-6 ${accentText}`}>
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[340px_1fr] gap-8 lg:gap-10 xl:gap-12">
        <div>
          <div className="sticky top-8">
            <div className="w-[240px] sm:w-[260px] lg:w-full">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full aspect-[3/4] object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div
                  className={`w-full aspect-[3/4] bg-gradient-to-br ${book.color} p-4 sm:p-6 rounded-xl shadow-lg relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-10 sm:w-12 h-2 bg-white/40 rounded-full mb-4 sm:mb-5" />
                      <BookOpen className="w-10 sm:w-12 h-10 sm:h-12 text-white/60 mb-3 sm:mb-4" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg sm:text-xl leading-tight mb-2 sm:mb-3">{book.title}</h3>
                      <p className="text-white/90 text-sm sm:text-base">{book.author}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 font-serif ${accentText}`}>
              {book.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">{book.author}</p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <User className={`w-5 h-5 ${accentText}`} />
              <div>
                <p className="text-sm text-muted-foreground">Author</p>
                <p className="font-semibold">{book.author}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3 text-foreground">
              <Tag className={`w-5 h-5 ${accentText}`} />
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold">{book.category}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3 text-foreground">
              <BookOpen className={`w-5 h-5 ${accentText}`} />
              <div>
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-semibold">{book.pages?.toLocaleString?.() ?? book.pages}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {book.pdfUrl ? (
              <>
                <Button size="default" className={`flex-1 rounded-xl text-white h-11 sm:h-12 ${accentBg}`} asChild>
                  <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Now (PDF)
                  </a>
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className={`flex-1 rounded-xl bg-transparent h-11 sm:h-12 ${accentBorder}`}
                  asChild
                >
                  <a
                    href={`/api/download?url=${encodeURIComponent(book.pdfUrl)}&name=${encodeURIComponent(`${book.title}.pdf`)}`}
                    aria-label={`Download ${book.title}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </>
            ) : (
              <Button size="default" className={`w-full rounded-xl text-white h-11 sm:h-12 ${accentBg}`} asChild>
                <a href={book.detailUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Details
                </a>
              </Button>
            )}
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 lg:p-8">
            <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 ${accentText}`}>About this Book</h2>
            <div className="prose max-w-none">
              <p className="text-foreground leading-relaxed text-sm sm:text-base">{book.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
