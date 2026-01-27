import VideosClient from './client'
import { fetchAllVideos } from '@/lib/youtube-api'
import { YouTubeVideo } from '@/lib/youtube-api'

// Enable ISR - revalidate every 10 minutes
export const revalidate = 600

async function getInitialVideos(): Promise<YouTubeVideo[]> {
  try {
    // Fetch more videos for initial load (e.g., 50 videos)
    const videos = await fetchAllVideos(50)
    return videos
  } catch (error) {
    console.error('Error fetching initial videos:', error)
    // Return empty array, client will handle fallback
    return []
  }
}

export default async function VideosPage() {
  const initialVideos = await getInitialVideos()

  return <VideosClient initialVideos={initialVideos} />
}
