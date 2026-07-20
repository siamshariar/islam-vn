"use client"

import { SegmentQAList } from "@/components/segment/segment-qa-list"
import { newMuslimQA } from "@/lib/new-muslim-qa"

export default function NewMuslimQAPage() {
  return (
    <SegmentQAList
      items={newMuslimQA.map((qa) => ({ id: qa.id, question: qa.question, answer: qa.answer }))}
      title="Quick Answers for New Muslims"
      backHref="/new-muslim"
      backLabel="Back to New Muslim"
      accent="emerald"
    />
  )
}
