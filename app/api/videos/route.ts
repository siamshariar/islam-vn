import { NextRequest, NextResponse } from 'next/server';
import { fetchAllVideos } from '@/lib/youtube-api';
import { youtubeAPIManager } from '@/lib/youtube-api-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // During build time, return empty array to avoid timeouts
    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD === '1') {
      console.log('Build time detected, returning empty array');

      return NextResponse.json({
        videos: [],
        note: "Build time - no videos available",
        hasMore: false
      });
    }

    // Set a timeout for API calls (reduced for Vercel)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for Vercel

    try {
      // For pagination, we need to fetch all videos and then slice
      // But optimize by using cache and reducing API calls
      const allVideos = await fetchAllVideos(20); // Increased to get more videos for better pagination
      clearTimeout(timeoutId);

      if (!allVideos || allVideos.length === 0) {
        console.log('No videos fetched from YouTube API, using fallback data');
        console.log('YouTube API Key present:', !!process.env.YOUTUBE_API_KEY);
        console.log('YouTube API Key length:', process.env.YOUTUBE_API_KEY?.length);

        const fallbackVideos = getFallbackVideos();
        const startIndex = (page - 1) * maxResults;
        const endIndex = startIndex + maxResults;
        const paginatedVideos = fallbackVideos.slice(startIndex, endIndex);

        return NextResponse.json({
          videos: paginatedVideos,
          note: "Using fallback data due to API issues or quota exceeded",
          hasMore: endIndex < fallbackVideos.length,
          apiStatus: {
            availableKeys: youtubeAPIManager.getAvailableKeysCount(),
            totalKeys: youtubeAPIManager.getTotalKeysCount(),
            lastSuccessfulKey: youtubeAPIManager.getLastSuccessfulKeyIndex(),
            keyUsageStats: youtubeAPIManager.getKeyUsageStats()
          }
        });
      }

      // Implement proper server-side pagination
      const startIndex = (page - 1) * maxResults;
      const endIndex = startIndex + maxResults;
      const paginatedVideos = allVideos.slice(startIndex, endIndex);

      return NextResponse.json({
        videos: paginatedVideos,
        hasMore: endIndex < allVideos.length,
        totalVideos: allVideos.length,
        apiStatus: {
          availableKeys: youtubeAPIManager.getAvailableKeysCount(),
          totalKeys: youtubeAPIManager.getTotalKeysCount(),
          lastSuccessfulKey: youtubeAPIManager.getLastSuccessfulKeyIndex(),
          keyUsageStats: youtubeAPIManager.getKeyUsageStats()
        }
      });
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      console.error('YouTube API error:', apiError?.message || apiError);
      console.log('YouTube API Key present:', !!process.env.YOUTUBE_API_KEY);
      console.log('YouTube API Key length:', process.env.YOUTUBE_API_KEY?.length);

      return NextResponse.json({
        videos: [],
        note: "YouTube API error - no videos available",
        hasMore: false,
        error: apiError?.message || 'Unknown API error'
      });
    }
  } catch (error: any) {
    console.error('Route error:', error);

    return NextResponse.json({
      videos: [],
      note: "Route error - no videos available",
      hasMore: false,
      error: error?.message || 'Route processing error'
    });
  }
}