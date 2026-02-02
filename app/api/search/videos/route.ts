import { NextRequest, NextResponse } from 'next/server'
import { fetchAllVideos } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: ''
      })
    }

    // Try to fetch videos from YouTube API
    let allVideos = []
    try {
      allVideos = await fetchAllVideos(50) // Fetch more videos for better search results
    } catch (error) {
      console.error('Error fetching videos for search:', error)
      allVideos = []
    }

    // Filter videos based on search query
    const filteredVideos = allVideos.filter(
      (video: any) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.channelTitle.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({
      results: filteredVideos,
      total: filteredVideos.length,
      query
    })
  } catch (error) {
    console.error('Error searching videos:', error)
    return NextResponse.json(
      { error: 'Failed to search videos' },
      { status: 500 }
    )
  }
}