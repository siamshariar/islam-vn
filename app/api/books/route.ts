import { NextRequest, NextResponse } from 'next/server'
import { books } from '@/lib/books'
import { nonMuslimBooks } from '@/lib/non-muslim-books'
import { newMuslimBooks } from '@/lib/new-muslim-books'

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''

    let allBooks = [...books, ...nonMuslimBooks, ...newMuslimBooks]

    // Remove duplicates by ID
    const seen = new Set<string>()
    allBooks = allBooks.filter(book => {
      if (seen.has(book.id)) return false
      seen.add(book.id)
      return true
    })

    // Also remove duplicates by title + author combination
    const seenTitleAuthor = new Set<string>()
    allBooks = allBooks.filter(book => {
      const key = `${book.title.toLowerCase().trim()}_${book.author.toLowerCase().trim()}`
      if (seenTitleAuthor.has(key)) return false
      seenTitleAuthor.add(key)
      return true
    })

    // Filter by search
    if (search) {
      const query = search.toLowerCase().trim()
      allBooks = allBooks.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
      )
    }

    const totalBooks = allBooks.length
    const totalPages = Math.ceil(totalBooks / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedBooks = allBooks.slice(start, end)

    return NextResponse.json({
      books: paginatedBooks,
      currentPage: page,
      totalPages,
      totalBooks,
      hasMore: page < totalPages
    })
  } catch (error) {
    console.error("Error in books API:", error)
    return NextResponse.json(
      { error: 'Failed to fetch books' }, 
      { status: 500 }
    )
  }
}