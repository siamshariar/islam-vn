import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/lib/articles'
import { newMuslimArticles } from '@/lib/new-muslim-articles'

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category') || 'All'
    const search = searchParams.get('search') || ''

    let filtered = [...articles, ...newMuslimArticles]

    // Remove duplicates by ID
    const seen = new Set<string>()
    filtered = filtered.filter(article => {
      if (seen.has(article.id)) return false
      seen.add(article.id)
      return true
    })

    // Also remove duplicates by title + category
    const seenTitleCategory = new Set<string>()
    filtered = filtered.filter(article => {
      const key = `${article.title.toLowerCase().trim()}_${article.category.toLowerCase().trim()}`
      if (seenTitleCategory.has(key)) return false
      seenTitleCategory.add(key)
      return true
    })

    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category === category)
    }

    if (search) {
      const query = search.toLowerCase().trim()
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
      )
    }

    const totalArticles = filtered.length
    const totalPages = Math.ceil(totalArticles / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedArticles = filtered.slice(start, end)

    return NextResponse.json({
      articles: paginatedArticles,
      currentPage: page,
      totalPages,
      totalArticles,
      hasMore: page < totalPages
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}