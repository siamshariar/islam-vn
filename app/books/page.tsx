import { Suspense } from 'react'
import BooksClient from './client'
import { books } from '@/lib/books'

export const revalidate = 3600 // Revalidate every hour

export default function BooksPage() {
  return (
    <Suspense fallback={null}>
      <BooksClient books={books} />
    </Suspense>
  )
}
