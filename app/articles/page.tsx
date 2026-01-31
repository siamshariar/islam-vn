import { Suspense } from 'react'
import ArticlesClient from './client'

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticlesClient />
    </Suspense>
  )
}
