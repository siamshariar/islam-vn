"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { BookCover } from "@/app/books/client"

interface SegmentBook {
  id: string
  title: string
  author: string
  thumbnail?: string | null
  color: string
  pages?: number
}

interface SegmentBookListProps {
  books: SegmentBook[]
  title: string
  backHref: string
  backLabel: string
  accent: "emerald" | "gold"
  detailBasePath: string
}

export function SegmentBookList({
  books,
  title,
  backHref,
  backLabel,
  accent,
  detailBasePath,
}: SegmentBookListProps) {
  return (
    <div className="px-4 lg:px-8 py-8">
      <Link
        href={backHref}
        className={`inline-flex items-center gap-2 mb-8 text-sm font-medium hover:underline ${
          accent === "emerald" ? "text-emerald" : "text-gold"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <h1 className={`text-3xl font-bold mb-8 ${accent === "emerald" ? "text-emerald" : "text-gold"}`}>{title}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {books.map((book) => (
          <CardWrapper key={book.id}>
            <Link href={`${detailBasePath}/${book.id}`}>
              <BookCover title={book.title} author={book.author} color={book.color} thumbnail={book.thumbnail} />
            </Link>
            {book.pages != null && (
              <div className="p-3">
                <span className="text-xs text-muted-foreground">{book.pages} pages</span>
              </div>
            )}
          </CardWrapper>
        ))}
      </div>
    </div>
  )
}
