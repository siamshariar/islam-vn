"use client"

import { SegmentVideoList } from "@/components/segment/segment-video-list"
import { newMuslimVideos } from "@/lib/new-muslim-videos"

export default function NewMuslimVideosPage() {
  return (
    <SegmentVideoList
      videos={newMuslimVideos}
      title="Essential Videos for New Muslims"
      backHref="/new-muslim"
      backLabel="Back to New Muslim"
      accent="emerald"
      modalBaseUrl="/new-muslim/videos/"
      modalCloseUrl="/new-muslim/videos"
    />
  )
}
