import { NextRequest, NextResponse } from 'next/server'
import { fetchAllVideos } from '@/lib/youtube-api'

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
    }
  ]
}

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
      allVideos = getFallbackVideos()
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