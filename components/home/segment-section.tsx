"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, UserPlus, Users, Play, FileText, Sparkles } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Button } from "@/components/ui/button"
import VideoModalHome from "@/components/modal/VideoModalHome"

interface ContentCard {
  id: string
  title: string
  description: string
  type: "video" | "article"
  thumbnail?: string
}

const newMuslimContent: ContentCard[] = [
  {
    id: "1",
    title: "Your First Steps in Islam",
    description: "A complete guide for new converts",
    type: "video",
    thumbnail: "/islamic-prayer-guide.jpg",
  },
  {
    id: "2",
    title: "Learning to Pray",
    description: "Step by step Salah tutorial",
    type: "video",
    thumbnail: "/muslim-prayer-tutorial.jpg",
  },
  { id: "3", title: "Understanding the Quran", description: "Introduction to the Holy Book", type: "article" },
  { id: "4", title: "Building Your Faith", description: "Strengthening your connection with Allah", type: "article" },
]

const nonMuslimContent: ContentCard[] = [
  {
    id: "76vanFKw664",
    title: "What is Islam? An Introduction",
    description: "A comprehensive introduction to Islam for beginners",
    type: "video",
    thumbnail: `https://img.youtube.com/vi/76vanFKw664/mqdefault.jpg`,
  },
  {
    id: "DdWxCVYAOCk",
    title: "Who was Prophet Muhammad?",
    description: "Learn about the life and teachings of Prophet Muhammad (PBUH)",
    type: "video",
    thumbnail: `https://img.youtube.com/vi/DdWxCVYAOCk/mqdefault.jpg`,
  },
  {
    id: "1563",
    title: "The Victory of the Romans and the Lowest Point on Earth",
    description: "The Quran lays light on the lowest place of earth.",
    type: "article",
    thumbnail: "https://de44dj20p4alh.cloudfront.net/articles/The_Victory_of_the_Romans_and_the_Lowest_Point_on_Earth_001.jpg",
  },
  {
    id: "1",
    title: "The Earth's Atmosphere",
    description: "Modern science has discovered facts about the atmosphere mentioned in the Quran over 1400 years ago.",
    type: "article",
    thumbnail: "https://de44dj20p4alh.cloudfront.net/articles/The_Earth_s_Atmosphere_001.jpg",
  },
]

interface SegmentProps {
  title: string
  description: string
  icon: React.ElementType
  content: ContentCard[]
  href: string
  accentColor: "emerald" | "gold"
  onVideoClick?: (videoId: string, title: string, description: string) => void
}

function Segment({ title, description, icon: Icon, content, href, accentColor, onVideoClick }: SegmentProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const bgGradient = accentColor === "emerald" ? "from-emerald/5 to-emerald/10" : "from-gold/5 to-orange/10"

  return (
    <motion.section
      className={`relative py-12 px-4 lg:px-8 bg-gradient-to-br ${bgGradient} rounded-3xl mx-4 lg:mx-8 mb-8`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating decorative element */}
      <div className="absolute top-4 right-4 opacity-10">
        <Sparkles className={`w-20 h-20 ${accentColor === "emerald" ? "text-emerald" : "text-gold"}`} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-2xl ${accentColor === "emerald" ? "bg-emerald/20" : "bg-gold/20"}`}>
          <Icon className={`w-8 h-8 ${accentColor === "emerald" ? "text-emerald" : "text-gold"}`} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${accentColor === "emerald" ? "text-emerald" : "text-gold"}`}>{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="icon" className="rounded-xl bg-transparent" onClick={() => scroll("left")}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-xl bg-transparent" onClick={() => scroll("right")}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {content.map((item, index) => (
          <CardWrapper key={item.id} className="flex-shrink-0 w-[280px] snap-start" delay={index * 0.1}>
            {item.type === "video" ? (
              <>
                <button
                  onClick={() => onVideoClick?.(item.id, item.title, item.description)}
                  className="w-full text-left cursor-pointer"
                >
                  <div className="relative aspect-video">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-emerald fill-emerald" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                </button>
              </>
            ) : (
              <Link href={href} className="block">
                {item.thumbnail ? (
                  <>
                    <div className="relative aspect-video">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded-lg text-xs text-white">
                        Article
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${accentColor === "emerald" ? "bg-emerald/10" : "bg-gold/10"} flex items-center justify-center mb-3`}
                    >
                      <FileText className={`w-5 h-5 ${accentColor === "emerald" ? "text-emerald" : "text-gold"}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                )}
              </Link>
            )}
          </CardWrapper>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Button
          asChild
          variant="outline"
          className={`rounded-xl ${accentColor === "emerald" ? "border-emerald text-emerald hover:bg-emerald/10" : "border-gold text-gold hover:bg-gold/10"}`}
        >
          <Link href={href}>View All Resources</Link>
        </Button>
      </div>
    </motion.section>
  )
}

export function SegmentSection() {
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null)

  // Handle URL params for modal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const videoId = urlParams.get('video')
    if (videoId) {
      // Find the video in nonMuslimContent
      const video = nonMuslimContent.find(v => v.id === videoId)
      if (video && video.type === 'video') {
        setSelectedVideo({ id: video.id, title: video.title, description: video.description })
      }
    } else {
      setSelectedVideo(null)
    }
  }, [])

  const handleVideoClick = (videoId: string, title: string, description: string) => {
    setSelectedVideo({ id: videoId, title, description })
    // Update URL with video ID
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('video', videoId)
    window.history.replaceState({}, '', newUrl.toString())
  }

  return (
    <>
      <div className="py-8">
        <Segment
          title="For New Muslims"
          description="Start your beautiful journey with Islam"
          icon={UserPlus}
          content={newMuslimContent}
          href="/new-muslim"
          accentColor="emerald"
          onVideoClick={handleVideoClick}
        />
        <Segment
          title="For Non-Muslims"
          description="Explore and understand Islam"
          icon={Users}
          content={nonMuslimContent}
          href="/non-muslim"
          accentColor="gold"
          onVideoClick={handleVideoClick}
        />
      </div>

      {selectedVideo && (
        <VideoModalHome
          isOpen={true}
          onClose={() => {
            setSelectedVideo(null)
            // Remove video param from URL
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('video')
            window.history.replaceState({}, '', newUrl.toString())
          }}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
          playlistId="PLnfYS3rBXoKSDiGuqF_UIDfItqyw"
        />
      )}
    </>
  )
}
