"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Play } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import VideoModalHome from "@/components/modal/VideoModalHome"
import type { SegmentVideo } from "@/lib/new-muslim-videos"

interface SegmentVideoListProps {
  videos: SegmentVideo[]
  title: string
  backHref: string
  backLabel: string
  accent: "emerald" | "gold"
  modalBaseUrl: string
  modalCloseUrl: string
}

export function SegmentVideoList({
  videos,
  title,
  backHref,
  backLabel,
  accent,
  modalBaseUrl,
  modalCloseUrl,
}: SegmentVideoListProps) {
  const [selectedVideo, setSelectedVideo] = useState<SegmentVideo | null>(null)
  const prevUrlRef = useRef<string | null>(null)

  const openVideo = (video: SegmentVideo) => {
    try {
      prevUrlRef.current = window.location.pathname + window.location.search
    } catch (e) {}

    try {
      window.history.pushState({ modal: true, videoId: video.id }, "", `${modalBaseUrl}?v=${video.id}`)
    } catch (e) {}

    try {
      document.body.style.overflow = "hidden"
    } catch (e) {}

    try {
      window.onpopstate = () => handleClose()
    } catch (e) {}

    setSelectedVideo(video)
  }

  const handleClose = () => {
    try {
      document.body.style.overflow = "auto"
    } catch (e) {}

    const prev = prevUrlRef.current
    try {
      if (prev) window.history.replaceState({}, "", prev)
      else window.history.replaceState({}, "", modalCloseUrl)
    } catch (e) {}

    setSelectedVideo(null)
    try {
      window.onpopstate = null
    } catch (e) {}
  }

  return (
    <>
      <div className="px-4 lg:px-8 py-8">
        <Link
          href={backHref}
          className={`inline-flex items-center gap-2 mb-8 text-sm font-medium hover:underline ${
            accent === "emerald" ? "text-emerald" : "text-gold"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        <h1 className={`text-3xl font-bold mb-8 ${accent === "emerald" ? "text-emerald" : "text-gold"}`}>{title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <CardWrapper key={video.id}>
              <button type="button" onClick={() => openVideo(video)} className="w-full text-left cursor-pointer">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (target.src.includes("mqdefault.jpg")) {
                        target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
                      } else if (target.src.includes("hqdefault.jpg")) {
                        target.src = `https://img.youtube.com/vi/${video.id}/default.jpg`
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play
                        className={`w-5 h-5 ml-0.5 ${accent === "emerald" ? "text-emerald fill-emerald" : "text-gold fill-gold"}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-1">{video.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                </div>
              </button>
            </CardWrapper>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <VideoModalHome
          isOpen={true}
          onClose={handleClose}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
          playlistId="PLnfYS3rBXoKSDiGuqF_DUgsfUIDfItqyw"
          baseUrl={modalBaseUrl}
        />
      )}
    </>
  )
}
