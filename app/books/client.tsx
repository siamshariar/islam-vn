"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, BookOpen, Download } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { books } from "@/lib/books"

function BookCover({ title, author, color }: { title: string; author: string; color: string }) {
  return (
    <div
      className={`aspect-[3/4] bg-gradient-to-br ${color} p-5 flex flex-col justify-between rounded-t-2xl relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8" />

      <div className="relative z-10">
        <div className="w-10 h-1.5 bg-white/40 rounded-full mb-4" />
        <BookOpen className="w-8 h-8 text-white/60 mb-3" />
      </div>
      <div className="relative z-10">
        <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-3">{title}</h3>
        <p className="text-white/80 text-sm line-clamp-1">{author}</p>
      </div>
    </div>
  )
}

export default function BooksClient() {
  const [search, setSearch] = useState("")

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald mb-2">Books</h1>
          <p className="text-muted-foreground">Explore our collection of Islamic literature</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.map((book, index) => (
          <CardWrapper key={book.id} delay={index * 0.05}>
            <Link href={`/books/${book.id}`}>
              <BookCover title={book.title} author={book.author} color={book.color} />
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