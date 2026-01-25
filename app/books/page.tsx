"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, BookOpen } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { books } from "@/lib/books"

export default function BooksPage() {
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filteredBooks.map((book, index) => (
          <CardWrapper key={book.id} delay={index * 0.05} className="group">
            <Link href={`/books/${book.id}`}>
              <div className={`aspect-[3/4] bg-gradient-to-br ${book.color} p-4 flex flex-col justify-between`}>
                <div>
                  <div className="w-8 h-1 bg-white/30 rounded-full mb-4" />
                  <BookOpen className="w-6 h-6 text-white/50 mb-2" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{book.title}</h3>
                  <p className="text-white/70 text-xs">{book.author}</p>
                </div>
              </div>
            </Link>
          </CardWrapper>
        ))}
      </div>
    </div>
  )
}
