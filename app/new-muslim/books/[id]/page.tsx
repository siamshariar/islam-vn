"use client"

import { useParams } from "next/navigation"
import { SegmentBookDetail } from "@/components/segment/segment-book-detail"
import { newMuslimBooks } from "@/lib/new-muslim-books"

export default function NewMuslimBookDetailPage() {
  const params = useParams()
  const id = params.id as string
  const book = newMuslimBooks.find((b) => b.id === id)

  return <SegmentBookDetail book={book} backHref="/new-muslim/books" backLabel="Back to Books" accent="emerald" />
}
