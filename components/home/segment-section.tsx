"use client"

import type React from "react"

import { useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, UserPlus, Users, Play, FileText, Sparkles } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Button } from "@/components/ui/button"

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
    id: "1",
    title: "What is Islam?",
    description: "An introduction to the religion of peace",
    type: "video",
    thumbnail: "/mosque-beautiful.jpg",
  },
  {
    id: "2",
    title: "Who is Prophet Muhammad?",
    description: "Learn about the final messenger",
    type: "video",
    thumbnail: "/islamic-calligraphy.png",
  },
  {
    id: "3",
    title: "Common Misconceptions",
    description: "Clearing up misunderstandings about Islam",
    type: "article",
  },
  {
    id: "4",
    title: "Islam and Science",
    description: "Discovering the harmony between faith and knowledge",
    type: "article",
  },
]

interface SegmentProps {
  title: string
  description: string
  icon: React.ElementType
  content: ContentCard[]
  href: string
  accentColor: "emerald" | "gold"
}

function Segment({ title, description, icon: Icon, content, href, accentColor }: SegmentProps) {
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
  return (
    <div className="py-8">
      <Segment
        title="For New Muslims"
        description="Start your beautiful journey with Islam"
        icon={UserPlus}
        content={newMuslimContent}
        href="/new-muslim"
        accentColor="emerald"
      />
      <Segment
        title="For Non-Muslims"
        description="Explore and understand Islam"
        icon={Users}
        content={nonMuslimContent}
        href="/non-muslim"
        accentColor="gold"
      />
    </div>
  )
}
