"use client"

import { SegmentBookList } from "@/components/segment/segment-book-list"
import { nonMuslimBooks } from "@/lib/non-muslim-books"

export default function NonMuslimBooksPage() {
  return (
    <SegmentBookList
      books={nonMuslimBooks}
      title="Recommended Books About Islam"
      backHref="/non-muslim"
      backLabel="Back to Discover Islam"
      accent="gold"
      detailBasePath="/non-muslim/books"
    />
  )
}
