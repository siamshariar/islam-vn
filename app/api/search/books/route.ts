import { NextRequest, NextResponse } from 'next/server'
import { books } from '@/lib/books'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: ''
      })
    }

    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.description?.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({
      results: filteredBooks,
      total: filteredBooks.length,
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