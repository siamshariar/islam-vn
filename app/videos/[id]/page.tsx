import { redirect } from 'next/navigation'
import { Metadata } from 'next'

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  channelTitle: string;
}

// Global cache to avoid duplicate API calls during build
let videosCache: YouTubeVideo[] = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes during build

const getAllVideos = async (): Promise<YouTubeVideo[]> => {
  const now = Date.now()
  if (videosCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    return videosCache
  }

  // During build time, return empty array
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD === '1') {
    console.log('Build time detected in generateStaticParams, returning empty array')
    return []
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/videos?maxResults=50`, {
      next: { revalidate: 3600 } // ISR - revalidate every hour
    })
    if (!response.ok) throw new Error('Failed to fetch videos')

    const data = await response.json()
    videosCache = data.videos || []
    cacheTimestamp = now
    return videosCache
  } catch (error) {
    console.error('Error fetching videos:', error)
    // Return cached data if available, otherwise empty array
    return videosCache.length > 0 ? videosCache : []
  }
}

// This would typically come from your API or database
const getVideoById = async (id: string): Promise<YouTubeVideo | null> => {
  const videos = await getAllVideos()
  return videos.find((video: YouTubeVideo) => video.id === id) || null
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const video = await getVideoById(params.id)

  if (!video) {
    return {
      title: 'Video Not Found | Islam VN Dashboard'
    }
  }

  return {
    title: `${video.title} | Islamic Videos`,
    description: video.description.substring(0, 160),
    openGraph: {
      title: video.title,
      description: video.description.substring(0, 160),
      images: [video.thumbnail],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: video.description.substring(0, 160),
      images: [video.thumbnail],
    },
  }
}

export async function generateStaticParams() {
  const videos = await getAllVideos()
  return videos.map((video: YouTubeVideo) => ({
    id: video.id,
  }))
}

export default async function VideoDetailPage({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const video = await getVideoById(params.id)

  if (!video) {
    redirect('/videos')
  }

  // Preserve incoming `q` (search) param when redirecting so
  // `/videos?video=ID&q=term` opens the modal and keeps search.
  const qParam = searchParams?.q
  const qValue = Array.isArray(qParam) ? qParam[0] : qParam
  const base = `/videos?video=${encodeURIComponent(params.id)}`
  const redirectUrl = qValue ? `${base}&q=${encodeURIComponent(qValue)}` : base

  redirect(redirectUrl)
}