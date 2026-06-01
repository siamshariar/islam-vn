"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Download, ChevronLeft, User, Languages, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { books } from "@/lib/books"
import { nonMuslimBooks } from "@/lib/non-muslim-books"
import { newMuslimBooks } from "@/lib/new-muslim-books"

// Combine all books for instant lookup
const allBooks = [...books, ...nonMuslimBooks, ...newMuslimBooks]

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  // Try to get book instantly from cache or local data
  const [book, setBook] = useState<any>(() => {
    // Check sessionStorage cache first
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(`book_${id}`)
      if (cached) {
        try {
          return JSON.parse(cached)
        } catch (e) {
          // ignore
        }
      }
    }
    
    // Check local data
    const localBook = allBooks.find(b => b.id === id)
    if (localBook) return localBook
    
    return null
  })
  
  const [isLoading, setIsLoading] = useState(!book)
  const [error, setError] = useState(false)

  // Force scroll to top on mount - instant
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    
    const prevScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    
    document.documentElement.style.scrollBehavior = "auto"
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    return () => {
      window.history.scrollRestoration = prevScrollRestoration
      document.documentElement.style.scrollBehavior = ""
    }
  }, [])

  // Fetch book data if not available locally
  useEffect(() => {
    if (book) {
      setIsLoading(false)
      return
    }
    
    if (!id) return
    
    let isCancelled = false
    
    const fetchBook = async () => {
      setIsLoading(true)
      setError(false)
      
      try {
        // Try local lookup first
        const localBook = allBooks.find(b => b.id === id)
        if (localBook && !isCancelled) {
          setBook(localBook)
          setIsLoading(false)
          sessionStorage.setItem(`book_${id}`, JSON.stringify(localBook))
          return
        }
        
        // Fetch from API
        const res = await fetch(`/api/books/${id}`)
        if (!res.ok) throw new Error('Book not found')
        const data = await res.json()
        
        if (!isCancelled) {
          setBook(data)
          setIsLoading(false)
          sessionStorage.setItem(`book_${id}`, JSON.stringify(data))
        }
      } catch (err) {
        console.error("Error fetching book:", err)
        if (!isCancelled) {
          setError(true)
          setIsLoading(false)
        }
      }
    }
    
    fetchBook()
    
    return () => {
      isCancelled = true
    }
  }, [id])

  // Handle back navigation - use browser back to preserve scroll
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Use browser back - scroll position will be restored by books list
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/books')
    }
  }

  // Type guard to check if book has translator property
  const hasTranslator = (book: any): book is typeof books[0] => 'translator' in book
  const hasDetailUrl = (book: any): book is typeof nonMuslimBooks[0] => 'detailUrl' in book

  // Error state
  if (error || (!book && !isLoading)) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
          <Link
            href="/books"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-emerald hover:underline transition-colors cursor-pointer mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Books
          </Link>
        </div>
      </div>
    )
  }

  // Loading state
  if (!book) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mb-6" />
          <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[340px_1fr] gap-8 lg:gap-10 xl:gap-12">
            <div className="aspect-[3/4] max-w-[240px] sm:max-w-[260px] bg-muted rounded-xl" />
            <div className="space-y-8">
              <div>
                <div className="h-10 w-3/4 bg-muted rounded mb-3" />
                <div className="h-6 w-1/2 bg-muted rounded" />
              </div>
              <div className="h-48 bg-muted rounded-2xl" />
              <div className="h-12 bg-muted rounded-2xl" />
              <div className="h-32 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-4 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/books"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-emerald hover:underline mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Books
      </Link>

      {/* Responsive grid: stacks on mobile, side by side on lg+ */}
      <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[340px_1fr] gap-8 lg:gap-10 xl:gap-12">
        
        {/* Book Cover - Left aligned on all screens */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="sticky top-8">
            {/* Mobile: left aligned with max-width. Desktop: full width in column */}
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
        </motion.div>

        {/* Right Column: Metadata and Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald mb-2 sm:mb-3 font-serif">{book.title}</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">{book.author}</p>
          </div>

          {/* Metadata */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <User className="w-5 h-5 text-emerald" />
              <div>
                <p className="text-sm text-muted-foreground">Author</p>
                <p className="font-semibold">{book.author}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            {hasTranslator(book) && (
              <>
                <div className="flex items-center gap-3 text-foreground">
                  <Languages className="w-5 h-5 text-emerald" />
                  <div>
                    <p className="text-sm text-muted-foreground">Translator</p>
                    <p className="font-semibold">{book.translator}</p>
                  </div>
                </div>
                <div className="h-px bg-border" />
              </>
            )}
            <div className="flex items-center gap-3 text-foreground">
              <Tag className="w-5 h-5 text-emerald" />
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-semibold">{book.category}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3 text-foreground">
              <BookOpen className="w-5 h-5 text-emerald" />
              <div>
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-semibold">{book.pages.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {book.pdfUrl ? (
              <>
                <Button
                  size="default"
                  className="flex-1 rounded-xl bg-emerald hover:bg-emerald/90 text-white h-11 sm:h-12"
                  asChild
                >
                  <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Now (PDF)
                  </a>
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="flex-1 rounded-xl border-emerald text-emerald hover:bg-emerald/10 bg-transparent h-11 sm:h-12"
                  asChild
                >
                  <a href={`/api/download?url=${encodeURIComponent(book.pdfUrl)}&name=${encodeURIComponent(`${book.title}.pdf`)}`} aria-label={`Download ${book.title}`}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </>
            ) : (
              <Button
                size="default"
                className="w-full rounded-xl bg-emerald hover:bg-emerald/90 text-white h-11 sm:h-12"
                asChild
              >
                <a href={hasDetailUrl(book) ? book.detailUrl : '#'} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Details
                </a>
              </Button>
            )}
          </div>

          {/* About Section */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald mb-3 sm:mb-4">About this Book</h2>
            <div className="prose prose-emerald max-w-none">
              <p className="text-foreground leading-relaxed text-sm sm:text-base">{book.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}