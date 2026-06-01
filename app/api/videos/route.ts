import { NextRequest, NextResponse } from 'next/server';
import { fetchAllVideos } from '@/lib/youtube-api';

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_BUILD === '1') {
      return NextResponse.json({
        videos: [],
        currentPage: 1,
        totalPages: 1,
        totalVideos: 0,
        note: "Build time - no videos available",
        hasMore: false
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const allVideos = await fetchAllVideos(100);
      clearTimeout(timeoutId);

      // Remove duplicates by ID
      const seen = new Set<string>();
      let filteredVideos = allVideos.filter((v: any) => {
        if (seen.has(v.id)) return false;
        seen.add(v.id);
        return true;
      });

      // Remove duplicates by title + channel
      const seenTitleChannel = new Set<string>();
      filteredVideos = filteredVideos.filter((v: any) => {
        const key = `${v.title?.toLowerCase().trim()}_${v.channelTitle?.toLowerCase().trim()}`;
        if (seenTitleChannel.has(key)) return false;
        seenTitleChannel.add(key);
        return true;
      });

      // Filter by search if query provided
      if (search) {
        const query = search.toLowerCase().trim();
        filteredVideos = filteredVideos.filter((v: any) =>
          v.title?.toLowerCase().includes(query) ||
          v.description?.toLowerCase().includes(query) ||
          v.channelTitle?.toLowerCase().includes(query)
        );
      }

      const totalVideos = filteredVideos.length;
      const totalPages = Math.ceil(totalVideos / maxResults);
      
      const startIndex = (page - 1) * maxResults;
      const endIndex = startIndex + maxResults;
      const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

      return NextResponse.json({
        videos: paginatedVideos,
        currentPage: page,
        totalPages,
        totalVideos,
        hasMore: page < totalPages,
      });
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      console.error('YouTube API error:', apiError?.message || apiError);
      return NextResponse.json({
        videos: [],
        currentPage: 1,
        totalPages: 1,
        totalVideos: 0,
        note: "YouTube API error",
        hasMore: false,
      });
    }
  } catch (error: any) {
    console.error('Route error:', error);
    return NextResponse.json({
      videos: [],
      currentPage: 1,
      totalPages: 1,
      totalVideos: 0,
      note: "Route error",
      hasMore: false,
    });
  }
}