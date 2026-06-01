import { Suspense } from 'react'
import ArticlesClient from './client'
import { articles } from '@/lib/articles'
import { newMuslimArticles } from '@/lib/new-muslim-articles'

export const revalidate = 3600

const PAGE_SIZE = 12

export default function ArticlesPage() {
  // Combine and deduplicate all articles
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
  
  const totalArticles = uniqueArticles.length
  const totalPages = Math.ceil(totalArticles / PAGE_SIZE)
  const initialArticles = uniqueArticles.slice(0, PAGE_SIZE)
  
  return (
    <Suspense fallback={null}>
      <ArticlesClient 
        articles={initialArticles} 
        totalPages={totalPages}
        totalArticles={totalArticles}
      />
    </Suspense>
  )
}