"use client"

import { SegmentVideoList } from "@/components/segment/segment-video-list"
import { nonMuslimVideos } from "@/lib/non-muslim-videos"

export default function NonMuslimVideosPage() {
  return (
    <SegmentVideoList
      videos={nonMuslimVideos}
      title="Introductory Videos About Islam"
      backHref="/non-muslim"
      backLabel="Back to Discover Islam"
      accent="gold"
      modalBaseUrl="/non-muslim/videos/"
      modalCloseUrl="/non-muslim/videos"
    />
  )
}
