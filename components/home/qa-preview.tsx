"use client"

import { useState } from "react"
import Link from "next/link"
import { HelpCircle, ChevronDown, ChevronUp, ChevronRight, MessageCircle } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { motion, AnimatePresence } from "framer-motion"
import { qaItems } from "@/lib/qa"

// Deduplicate and get first 4 Q&A items
const latestQA = (() => {
  const seen = new Set<string>()
  return qaItems.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  }).slice(0, 4)
})()

const formatCategory = (category: string) => {
  return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function QAPreview() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section className="px-4 lg:px-8 py-12 bg-muted/30">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald mb-2">Questions & Answers</h2>
          <p className="text-muted-foreground">Find answers to common questions about Islam</p>
        </div>
        <Link
          href="/qa"
          className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 font-medium transition-colors"
        >
          View All Q&A
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {latestQA.map((item) => (
          <CardWrapper key={item.id}>
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full text-left p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-emerald" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full font-medium">
                      {formatCategory(item.category)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base line-clamp-2">{item.question}</h3>
                </div>
                {expandedId === item.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </div>
              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 ml-14 text-muted-foreground leading-relaxed text-sm">
                      {item.answer.length > 300 ? item.answer.slice(0, 300) + "..." : item.answer}
                    </p>
                    <Link
                      href={`/qa?q=${encodeURIComponent(item.question.slice(0, 50))}`}
                      className="inline-flex items-center gap-1 mt-3 ml-14 text-emerald text-sm font-medium hover:underline"
                    >
                      Read full answer
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </CardWrapper>
        ))}
      </div>
    </section>
  )
}