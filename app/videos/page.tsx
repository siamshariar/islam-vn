import VideosClient from './client'
import { YouTubeVideo } from '@/lib/youtube-api'

// Disable ISR for videos page to prevent build timeouts
export const revalidate = false
// Use dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

async function getInitialVideos(): Promise<YouTubeVideo[]> {
  try {
    // For Vercel deployment, use a shorter timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for Vercel

    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/videos?maxResults=12&page=1`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error fetching initial videos:', error);
    // For Vercel, return empty array immediately to prevent build failures
    if (process.env.VERCEL) {
      console.log('Vercel environment detected, returning empty array to prevent build timeout');
      return [];
    }
    // Return empty array, client will handle fallback
    return [];
  }
}

export default async function VideosPage() {
  const initialVideos = await getInitialVideos()

  return <VideosClient initialVideos={initialVideos} />
}
