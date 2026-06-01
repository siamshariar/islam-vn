import { NextRequest, NextResponse } from 'next/server'
import { qaItems } from '@/lib/qa'

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category') || 'All'
    const search = searchParams.get('search') || ''

    let filtered = [...qaItems]

    // Remove duplicates by ID
    const seen = new Set<string>()
    filtered = filtered.filter(item => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })

    // Also remove duplicates by question + category
    const seenQuestionCategory = new Set<string>()
    filtered = filtered.filter(item => {
      const key = `${item.question.toLowerCase().trim()}_${item.category.toLowerCase().trim()}`
      if (seenQuestionCategory.has(key)) return false
      seenQuestionCategory.add(key)
      return true
    })

    if (category && category !== 'All') {
      filtered = filtered.filter(item => item.category === category)
    }

    if (search) {
      const query = search.toLowerCase().trim()
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    }

    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedItems = filtered.slice(start, end)

    return NextResponse.json({
      items: paginatedItems,
      currentPage: page,
      totalPages,
      totalItems,
      hasMore: page < totalPages
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Q&A' }, { status: 500 })
  }
}