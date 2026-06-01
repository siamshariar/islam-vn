import { NextRequest, NextResponse } from 'next/server'
import { books } from '@/lib/books'
import { nonMuslimBooks } from '@/lib/non-muslim-books'
import { newMuslimBooks } from '@/lib/new-muslim-books'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const allBooks = [...books, ...nonMuslimBooks, ...newMuslimBooks]
  
  // Remove duplicates by ID
  const seen = new Set<string>()
  const uniqueBooks = allBooks.filter(book => {
    if (seen.has(book.id)) return false
    seen.add(book.id)
    return true
  })
  
  const book = uniqueBooks.find(b => b.id === id)

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  return NextResponse.json(book)
}