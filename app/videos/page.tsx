import VideosClient from './client'
import { YouTubeVideo } from '@/lib/youtube-api'

// Disable ISR for videos page to prevent build timeouts
export const revalidate = false
// Use dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

async function getInitialVideos(): Promise<YouTubeVideo[]> {
  // For Vercel deployment, don't fetch initial videos on server side
  // Let the client component handle all data loading to avoid build-time issues
  return []
}

export default async function VideosPage() {
  const initialVideos = await getInitialVideos()

  return <VideosClient initialVideos={initialVideos} />
}
