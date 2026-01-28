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

// Fallback videos for SEO during build time
function getFallbackVideos(): YouTubeVideo[] {
  return [
    {
      id: "dQw4w9WgXcQ",
      title: "Understanding Tawheed - The Oneness of Allah",
      description: "Learn about the fundamental concept of Tawheed in Islam",
      thumbnail: "/islamic-lecture-mosque.jpg",
      duration: "45:30",
      viewCount: "12K",
      publishedAt: "2024-01-15T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "9bZkp7q19f0",
      title: "The Beauty of Salah - Your Connection to Allah",
      description: "Discover the spiritual benefits of prayer in Islam",
      thumbnail: "/muslim-prayer-dawn.jpg",
      duration: "32:15",
      viewCount: "8.5K",
      publishedAt: "2024-01-10T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "JGwWNGJdvx8",
      title: "Stories of Prophet Muhammad (PBUH)",
      description: "Inspiring stories from the life of Prophet Muhammad",
      thumbnail: "/islamic-art-calligraphy.jpg",
      duration: "1:02:45",
      viewCount: "15K",
      publishedAt: "2024-01-05T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "hTWKbfoikeg",
      title: "Ramadan Preparation Guide",
      description: "How to prepare spiritually for the month of Ramadan",
      thumbnail: "/ramadan-moon-lanterns.jpg",
      duration: "28:00",
      viewCount: "6.2K",
      publishedAt: "2024-01-01T10:00:00Z",
      channelTitle: "Islamic Lectures"
    }
  ]
}

const getAllVideos = async (): Promise<YouTubeVideo[]> => {
  const now = Date.now()
  if (videosCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    return videosCache
  }

  // During build time, return fallback videos to avoid API calls
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD === '1') {
    console.log('Build time detected in generateStaticParams, using fallback videos for SEO')
    return getFallbackVideos()
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
    // Return cached data if available, otherwise fallback videos
    return videosCache.length > 0 ? videosCache : getFallbackVideos()
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

export default async function VideoDetailPage({ params }: { params: { id: string } }) {
  const video = await getVideoById(params.id)

  if (!video) {
    redirect('/videos')
  }

  // Redirect to list page with modal param for better UX
  redirect(`/videos?video=${params.id}`)
}