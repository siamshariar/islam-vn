import { NextRequest, NextResponse } from 'next/server';
import { fetchAllVideos } from '@/lib/youtube-api';
import { youtubeAPIManager } from '@/lib/youtube-api-manager';

// Fallback videos for when API fails
function getFallbackVideos() {
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
    },
    {
      id: "N9qYF9DZPdw",
      title: "Islamic Ethics in Daily Life",
      description: "Applying Islamic principles to modern life challenges",
      thumbnail: "/muslim-family-gathering.jpg",
      duration: "35:10",
      viewCount: "7.8K",
      publishedAt: "2023-12-20T10:00:00Z",
      channelTitle: "Islamic Lectures"
    },
    {
      id: "RgKAFK5djSk",
      title: "Islamic Finance and Economics",
      description: "Understanding Islamic principles in business and finance",
      thumbnail: "/alhambra-islamic-architecture.jpg",
      duration: "48:30",
      viewCount: "13K",
      publishedAt: "2023-12-15T10:00:00Z",
      channelTitle: "Islamic Lectures"
    }
  ];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // During build time, immediately return fallback data to avoid timeouts
    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD === '1') {
      console.log('Build time detected, using fallback data');
      const fallbackVideos = getFallbackVideos();
      const startIndex = (page - 1) * maxResults;
      const endIndex = startIndex + maxResults;
      const paginatedVideos = fallbackVideos.slice(startIndex, endIndex);

      return NextResponse.json({
        videos: paginatedVideos,
        note: "Using fallback data during build",
        hasMore: endIndex < fallbackVideos.length
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

      // For all API errors, return fallback data
      const fallbackVideos = getFallbackVideos();
      const startIndex = (page - 1) * maxResults;
      const endIndex = startIndex + maxResults;
      const paginatedVideos = fallbackVideos.slice(startIndex, endIndex);

      return NextResponse.json({
        videos: paginatedVideos,
        note: "Using fallback data due to API error",
        hasMore: endIndex < fallbackVideos.length,
        totalVideos: fallbackVideos.length,
        error: apiError?.message || 'Unknown API error'
      });
    }
  } catch (error: any) {
    console.error('Route error:', error);
    // Return fallback data as last resort
    const fallbackVideos = getFallbackVideos();
    const maxResults = parseInt(new URL(request.url).searchParams.get('maxResults') || '20');
    const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
    const startIndex = (page - 1) * maxResults;
    const endIndex = startIndex + maxResults;
    const paginatedVideos = fallbackVideos.slice(startIndex, endIndex);

    return NextResponse.json({
      videos: paginatedVideos,
      note: "Using fallback data due to route error",
      hasMore: endIndex < fallbackVideos.length,
      totalVideos: fallbackVideos.length,
      error: error?.message || 'Route processing error'
    });
  }
}