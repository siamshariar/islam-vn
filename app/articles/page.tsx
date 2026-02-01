import { Suspense } from 'react'
import ArticlesClient from './client'
import { articles } from '@/lib/articles'

export const revalidate = 3600 // Revalidate every hour

export default function ArticlesPage() {
  return (
    <Suspense fallback={null}>
      <ArticlesClient articles={articles} />
    </Suspense>
  )
}
