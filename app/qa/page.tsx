import { Suspense } from 'react'
import QAClient from './client'

export default function QAPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QAClient />
    </Suspense>
  )
}

