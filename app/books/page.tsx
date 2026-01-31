import { Suspense } from 'react'
import BooksClient from './client'

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksClient />
    </Suspense>
  )
}
