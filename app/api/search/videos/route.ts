import { NextRequest, NextResponse } from 'next/server'
import { fetchAllVideos } from '@/lib/youtube-api'

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        hasMore: false,
        query: ''
      })
    }

    let allVideos: any[] = []
    try {
      allVideos = await fetchAllVideos(50)
    } catch (error) {
      console.error('Error fetching videos for search:', error)
      allVideos = []
    }

    const filteredVideos = allVideos.filter(
      (video: any) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.channelTitle.toLowerCase().includes(query.toLowerCase())
    )

    const totalResults = filteredVideos.length
    const totalPages = Math.ceil(totalResults / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedResults = filteredVideos.slice(start, end)

    return NextResponse.json({
      results: paginatedResults,
      total: totalResults,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
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