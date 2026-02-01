import { Suspense } from 'react'
import QAClient from './client'
import { qaItems } from '@/lib/qa'

export const revalidate = 3600 // Revalidate every hour

export default function QAPage() {
  return (
    <Suspense fallback={null}>
      <QAClient qaItems={qaItems} />
    </Suspense>
  )
}

