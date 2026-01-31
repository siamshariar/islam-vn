"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, BookOpen, Download, X } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { books } from "@/lib/books"

export function BookCover({ title, author, color, thumbnail }: { title: string; author: string; color: string; thumbnail?: string | null }) {
  const isActualThumbnail = thumbnail && thumbnail !== "https://islamhouse.com/logo_IslamHouse.jpg";
  return (
    <div
      className={`aspect-[3/4] bg-gradient-to-br ${color} p-5 flex flex-col justify-between rounded-t-2xl relative overflow-hidden`}
    >
      {/* Thumbnail image if available and not default logo */}
      {isActualThumbnail && (
        <div className="absolute inset-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-black/20 rounded-t-2xl" />
        </div>
      )}

      {/* Decorative elements - only show if no actual thumbnail */}
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

export default function SearchBooksClient() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(!!searchParams.get('q')) // Set loading to true if there's a query

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    if (query) {
      setLoading(true)
      try {
        const response = await fetch(`/api/search/books?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.results || [])
        } else {
          // Fallback to client-side search
          const filtered = books.filter(
            (book) =>
              book.title.toLowerCase().includes(query.toLowerCase()) ||
              book.author.toLowerCase().includes(query.toLowerCase()) ||
              book.description?.toLowerCase().includes(query.toLowerCase())
          )
          setSearchResults(filtered)
        }
        // Update URL with search parameter
        window.history.replaceState({}, '', `/search/books?q=${encodeURIComponent(query)}`)
      } catch (error) {
        // Fallback to client-side search
        const filtered = books.filter(
          (book) =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.description?.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
        // Update URL with search parameter
        window.history.replaceState({}, '', `/search/books?q=${encodeURIComponent(query)}`)
      } finally {
        setLoading(false)
      }
    } else {
      // Redirect immediately when search is empty
      window.location.href = '/books'
    }
  }

  const clearSearch = () => {
    setSearch("")
    setSearchResults([])
    // Redirect to books list page
    window.location.href = '/books'
  }

  // Handle URL search params on mount
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearch(query)
      // Trigger search for direct URL access
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
      handleSearch(syntheticEvent)
    }
  }, [])

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald mb-2">
            Search Books
          </h1>
          <p className="text-muted-foreground">
            {searchResults.length > 0
              ? `Found ${searchResults.length} book${searchResults.length !== 1 ? 's' : ''} for "${search}"`
              : search
                ? `Searching for "${search}"...`
                : "Search our collection of Islamic literature"
            }
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => {
                const value = e.target.value
                setSearch(value)
                // Redirect immediately when search becomes empty
                if (!value.trim()) {
                  window.location.href = '/books'
                }
              }}
              className="pl-9 pr-9 rounded-xl"
            />
            {search && (
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald"></div>
        </div>
      ) : (
        <>
          {search && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No books found for "{search}"
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((book, index) => (
                <CardWrapper key={book.id} delay={index * 0.05}>
                  <Link href={`/books/${book.id}`}>
                    <BookCover title={book.title} author={book.author} color={book.color} thumbnail={book.thumbnail} />
                  </Link>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{book.pages} pages</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-xl text-emerald hover:text-emerald hover:bg-emerald/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardWrapper>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}