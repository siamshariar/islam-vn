"use client"

import { SegmentBookList } from "@/components/segment/segment-book-list"
import { newMuslimBooks } from "@/lib/new-muslim-books"

export default function NewMuslimBooksPage() {
  return (
    <SegmentBookList
      books={newMuslimBooks}
      title="Recommended Books for New Muslims"
      backHref="/new-muslim"
      backLabel="Back to New Muslim"
      accent="emerald"
      detailBasePath="/new-muslim/books"
    />
  )
}
