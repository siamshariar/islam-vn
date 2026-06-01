import { Suspense } from 'react'
import QAClient from './client'
import { qaItems } from '@/lib/qa'

export const revalidate = 3600

const PAGE_SIZE = 10

export default function QAPage() {
  // Remove duplicates by ID
  const seen = new Set<string>()
  let uniqueItems = qaItems.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  // Also remove duplicates by question + category
  const seenQuestionCategory = new Set<string>()
  uniqueItems = uniqueItems.filter(item => {
    const key = `${item.question.toLowerCase().trim()}_${item.category.toLowerCase().trim()}`
    if (seenQuestionCategory.has(key)) return false
    seenQuestionCategory.add(key)
    return true
  })

  const totalItems = uniqueItems.length
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)
  const initialItems = uniqueItems.slice(0, PAGE_SIZE)

  return (
    <Suspense fallback={null}>
      <QAClient
        qaItems={initialItems}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </Suspense>
  )
}