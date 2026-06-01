import { NextRequest, NextResponse } from 'next/server'
import { articles } from '@/lib/articles'
import { newMuslimArticles } from '@/lib/new-muslim-articles'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const allArticles = [...articles, ...newMuslimArticles]
  
  // Remove duplicates by ID
  const seen = new Set<string>()
  const uniqueArticles = allArticles.filter(article => {
    if (seen.has(article.id)) return false
    seen.add(article.id)
    return true
  })
  
  const article = uniqueArticles.find(a => a.id === id)

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  return NextResponse.json(article)
}