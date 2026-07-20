"use client"

import { SegmentQAList } from "@/components/segment/segment-qa-list"
import { nonMuslimQA } from "@/lib/non-muslim-qa"

export default function NonMuslimQAPage() {
  return (
    <SegmentQAList
      items={nonMuslimQA.map((qa) => ({ id: qa.id, question: qa.question, answer: qa.answer }))}
      title="Quick Answers About Islam"
      backHref="/non-muslim"
      backLabel="Back to Discover Islam"
      accent="gold"
    />
  )
}
