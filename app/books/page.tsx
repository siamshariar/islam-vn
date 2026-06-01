import { Suspense } from 'react'
import BooksClient from './client'
import { books } from '@/lib/books'
import { nonMuslimBooks } from '@/lib/non-muslim-books'
import { newMuslimBooks } from '@/lib/new-muslim-books'

export const revalidate = 3600

const PAGE_SIZE = 10

export default function BooksPage() {
  // Combine and deduplicate books
  const allBooks = [...books, ...nonMuslimBooks, ...newMuslimBooks]
  const seen = new Set<string>()
  const uniqueBooks = allBooks.filter(book => {
    if (seen.has(book.id)) return false
    seen.add(book.id)
    return true
  })
  
  const totalBooks = uniqueBooks.length
  const totalPages = Math.ceil(totalBooks / PAGE_SIZE)
  const initialBooks = uniqueBooks.slice(0, PAGE_SIZE)
  
  return (
    <Suspense fallback={null}>
      <BooksClient 
        books={initialBooks} 
        totalPages={totalPages}
        totalBooks={totalBooks}
      />
    </Suspense>
  )
}