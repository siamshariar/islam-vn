import { Suspense } from 'react'
import VideosClient from './client'
import { YouTubeVideo } from '@/lib/youtube-api'

// Enable ISR for videos page
export const revalidate = 3600

// Fallback videos for immediate display
const fallbackVideos: YouTubeVideo[] = [
  {
    id: "xpwqymRS7xI",
    title: "Understanding Tawheed - The Oneness of Allah",
    description: "Learn about the fundamental concept of Tawheed in Islam",
    thumbnail: "/islamic-lecture-mosque.jpg",
    duration: "45:30",
    viewCount: "12K",
    publishedAt: "2024-01-15T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "TKtAYxlA28Q",
    title: "The Beauty of Salah - Your Connection to Allah",
    description: "Discover the spiritual benefits of prayer in Islam",
    thumbnail: "/muslim-prayer-dawn.jpg",
    duration: "32:15",
    viewCount: "8.5K",
    publishedAt: "2024-01-10T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "r2X75sbaOQc",
    title: "Ramadan Reflections - The Month of Mercy",
    description: "Explore the spiritual significance of Ramadan",
    thumbnail: "/ramadan-mosque-night.jpg",
    duration: "28:45",
    viewCount: "15K",
    publishedAt: "2024-01-05T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "KoZ83cnoZyU",
    title: "The Life of Prophet Muhammad (PBUH)",
    description: "A comprehensive overview of the Prophet's life",
    thumbnail: "/prophet-muhammad-biography.jpg",
    duration: "67:20",
    viewCount: "25K",
    publishedAt: "2024-01-01T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "hTWKbfoikeg",
    title: "Islamic Finance - Interest-Free Banking",
    description: "Understanding the principles of Islamic finance",
    thumbnail: "/islamic-finance-money.jpg",
    duration: "41:10",
    viewCount: "9K",
    publishedAt: "2023-12-28T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "2Vv-BfVoq4g",
    title: "Women in Islam - Rights and Responsibilities",
    description: "Exploring the status of women in Islamic teachings",
    thumbnail: "/muslim-women-education.jpg",
    duration: "38:55",
    viewCount: "18K",
    publishedAt: "2023-12-25T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "eIho2S0ZahI",
    title: "The Quran - A Source of Guidance",
    description: "Understanding the miraculous nature of the Quran",
    thumbnail: "/holy-quran-scripture.jpg",
    duration: "52:30",
    viewCount: "22K",
    publishedAt: "2023-12-20T10:00:00Z",
    channelTitle: "Islamic Lectures"
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Islamic Art and Architecture",
    description: "Appreciating the beauty of Islamic civilization",
    thumbnail: "/islamic-art-architecture.jpg",
    duration: "35:40",
    viewCount: "11K",
    publishedAt: "2023-12-15T10:00:00Z",
    channelTitle: "Islamic Lectures"
  }
]

export default function VideosPage() {
  return (
    <Suspense fallback={null}>
      <VideosClient initialVideos={fallbackVideos} />
    </Suspense>
  )
}
