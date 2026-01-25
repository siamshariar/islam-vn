import { NextRequest, NextResponse } from 'next/server';
import { fetchAllVideos } from '@/lib/youtube-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '5');

    const videos = await fetchAllVideos(maxResults);

    // If no videos were fetched (due to API quota or other issues), return fallback data
    if (!videos || videos.length === 0) {
      console.log('No videos fetched from YouTube API, using fallback data');
      const fallbackVideos = [
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
          viewCount: "20K",
          publishedAt: "2024-01-01T10:00:00Z",
          channelTitle: "Islamic Lectures"
        },
        {
          id: "N9Q2J9mQZ9M",
          title: "Islamic Ethics in Daily Life",
          description: "How to apply Islamic principles in your everyday activities",
          thumbnail: "/islamic-prayer-guide.jpg",
          duration: "38:45",
          viewCount: "9.2K",
          publishedAt: "2023-12-28T10:00:00Z",
          channelTitle: "Islamic Lectures"
        },
        {
          id: "3JZ_D3ELwOQ",
          title: "The Importance of Seeking Knowledge",
          description: "Why seeking knowledge is obligatory for every Muslim",
          thumbnail: "/quran-open-book.jpg",
          duration: "41:20",
          viewCount: "11K",
          publishedAt: "2023-12-25T10:00:00Z",
          channelTitle: "Islamic Lectures"
        },
        {
          id: "sVtZ6MlXKwE",
          title: "Building Strong Muslim Communities",
          description: "How to foster unity and brotherhood in the Muslim community",
          thumbnail: "/mosque-beautiful.jpg",
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

      return NextResponse.json({
        videos: fallbackVideos.slice(0, maxResults),
        note: "Using fallback data due to API quota limits or connection issues"
      });
    }

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);

    // Return fallback data for testing modal functionality
    const fallbackVideos = [
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
        viewCount: "20K",
        publishedAt: "2024-01-01T10:00:00Z",
        channelTitle: "Islamic Lectures"
      }
    ];

    return NextResponse.json({
      videos: fallbackVideos.slice(0, 5), // Default to 5 if maxResults is not available
      note: "Using fallback data due to API quota limits"
    });
  }
}