"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronUp, HelpCircle } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button"

interface SegmentQA {
  id: string
  question: string
  answer: string
}

interface SegmentQAListProps {
  items: SegmentQA[]
  title: string
  backHref: string
  backLabel: string
  accent: "emerald" | "gold"
}

export function SegmentQAList({ items, title, backHref, backLabel, accent }: SegmentQAListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {items.map((item) => {
          const isExpanded = expandedId === item.id
          return (
            <CardWrapper key={item.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      accent === "emerald" ? "bg-emerald/10" : "bg-gold/10"
                    }`}
                  >
                    <HelpCircle className={`w-5 h-5 ${accent === "emerald" ? "text-emerald" : "text-gold"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 pr-6">{item.question}</h3>
                  </div>
                  <div className="flex-shrink-0 -mt-0.5">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="pt-4 ml-14">
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
                  </div>
                )}
              </button>
            </CardWrapper>
          )
        })}
      </div>

      <ScrollToTopButton accent={accent} />
    </div>
  )
}
