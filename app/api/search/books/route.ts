import { NextRequest, NextResponse } from 'next/server'
import { books } from '@/lib/books'
import { nonMuslimBooks } from '@/lib/non-muslim-books'
import { newMuslimBooks } from '@/lib/new-muslim-books'

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        hasMore: false,
        query: ''
      })
    }

    const allBooks = [...books, ...nonMuslimBooks, ...newMuslimBooks]
    
    // Remove duplicates by ID
    const seen = new Set<string>()
    let uniqueBooks = allBooks.filter(book => {
      if (seen.has(book.id)) return false
      seen.add(book.id)
      return true
    })

    // Also remove duplicates by title + author
    const seenTitleAuthor = new Set<string>()
    uniqueBooks = uniqueBooks.filter(book => {
      const key = `${book.title.toLowerCase().trim()}_${book.author.toLowerCase().trim()}`
      if (seenTitleAuthor.has(key)) return false
      seenTitleAuthor.add(key)
      return true
    })

    const filteredBooks = uniqueBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.description?.toLowerCase().includes(query.toLowerCase())
    )

    const totalResults = filteredBooks.length
    const totalPages = Math.ceil(totalResults / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedResults = filteredBooks.slice(start, end)

    return NextResponse.json({
      results: paginatedResults,
      total: totalResults,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
      query
    })
  } catch (error) {
    console.error('Error searching books:', error)
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    )
  }
}