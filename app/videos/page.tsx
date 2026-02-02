import { Suspense } from 'react'
import VideosClient from './client'

// Enable ISR for videos page
export const revalidate = 3600

export default function VideosPage() {
  return (
    <Suspense fallback={null}>
      <VideosClient />
    </Suspense>
  )
}
