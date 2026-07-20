"use client"

import { useParams } from "next/navigation"
import { SegmentBookDetail } from "@/components/segment/segment-book-detail"
import { nonMuslimBooks } from "@/lib/non-muslim-books"

export default function NonMuslimBookDetailPage() {
  const params = useParams()
  const id = params.id as string
  const book = nonMuslimBooks.find((b) => b.id === id)

  return <SegmentBookDetail book={book} backHref="/non-muslim/books" backLabel="Back to Books" accent="gold" />
}
