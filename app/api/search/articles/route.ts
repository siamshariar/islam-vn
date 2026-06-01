import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/lib/articles'
import { newMuslimArticles } from '@/lib/new-muslim-articles'

const PAGE_SIZE = 9

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

    const allArticles = [...articles, ...newMuslimArticles]
    
    // Remove duplicates by ID
    const seen = new Set<string>()
    let uniqueArticles = allArticles.filter(article => {
      if (seen.has(article.id)) return false
      seen.add(article.id)
      return true
    })

    // Also remove duplicates by title + category
    const seenTitleCategory = new Set<string>()
    uniqueArticles = uniqueArticles.filter(article => {
      const key = `${article.title.toLowerCase().trim()}_${article.category.toLowerCase().trim()}`
      if (seenTitleCategory.has(key)) return false
      seenTitleCategory.add(key)
      return true
    })

    const filteredArticles = uniqueArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.category.toLowerCase().includes(query.toLowerCase())
    )

    const totalResults = filteredArticles.length
    const totalPages = Math.ceil(totalResults / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedResults = filteredArticles.slice(start, end)

    return NextResponse.json({
      results: paginatedResults,
      total: totalResults,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
      query
    })
  } catch (error) {
    console.error('Error searching articles:', error)
    return NextResponse.json(
      { error: 'Failed to search articles' },
      { status: 500 }
    )
  }
}