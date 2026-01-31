"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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

export default function BooksClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState("")

  // Redirect to search page if there's a search query in URL
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      router.replace(`/search/books?q=${encodeURIComponent(query)}`)
    }
  }, [searchParams, router])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    if (query) {
      router.push(`/search/books?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald mb-2">
            Books
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of Islamic literature
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9 rounded-xl"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book, index) => (
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
    </div>
  )
}