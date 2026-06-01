import { Suspense } from 'react'
import VideosClient from './client'
import { YouTubeVideo } from '@/lib/youtube-api'

export const revalidate = 3600

const PAGE_SIZE = 20

export default async function VideosPage() {
  let videos: YouTubeVideo[] = []
  let totalVideos = 0
  let totalPages = 1

  // Skip API call during build time
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD === '1') {
    return (
      <Suspense fallback={null}>
        <VideosClient
          initialVideos={[]}
          initialTotalVideos={0}
          initialTotalPages={1}
        />
      </Suspense>
    )
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/videos?maxResults=1000&page=1`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (response.ok) {
      const data = await response.json()
      videos = (data.videos || []).slice(0, PAGE_SIZE)
      totalVideos = data.totalVideos || videos.length
      totalPages = Math.max(1, Math.ceil(totalVideos / PAGE_SIZE))
    }
  } catch (error) {
    console.error('Error loading initial videos:', error instanceof Error ? error.message : error)
    // Return empty state on error
  }

  return (
    <Suspense fallback={null}>
      <VideosClient
        initialVideos={videos}
        initialTotalVideos={totalVideos}
        initialTotalPages={totalPages}
      />
    </Suspense>
  )
}