"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, HelpCircle, ChevronDown, ChevronUp, X } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type QAItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function QAClient({ qaItems }: { qaItems: QAItem[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [inputValue, setInputValue] = useState(searchParams.get('q') || "")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Set search and input from URL on mount
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearch(query)
      setInputValue(query)
    } else {
      setSearch("")
      setInputValue("")
    }
  }, [searchParams])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = inputValue.trim()
    if (query) {
      setSearch(query)
      // Update URL with search parameter on the same page
      router.replace(`/qa?q=${encodeURIComponent(query)}`)
    } else {
      setSearch("")
      // Clear search
      router.replace('/qa')
    }
  }

  const categories = ["All", ...new Set(qaItems.map(item => item.category))]

  const formatCategory = (category: string) => {
    if (category === "All") return category
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const filteredQA = qaItems.filter(
    (item: any) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (!search || 
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase()))
  )

  const displayQA = filteredQA

  return (
    <div className="px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald mb-2">
              Questions & Answers
            </h1>
            <p className="text-muted-foreground">
              {search
                ? `Found ${filteredQA.length} Q&A${filteredQA.length !== 1 ? 's' : ''} for "${search}"`
                : "Find answers to common questions about Islam"
              }
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions and answers..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-9 pr-9 rounded-xl"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("")
                    setSearch("")
                    router.replace('/qa')
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-emerald text-white"
                  : "bg-muted text-muted-foreground hover:bg-emerald/10 hover:text-emerald"
              }`}
            >
              {formatCategory(category)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {displayQA.map((item, index) => (
            <CardWrapper key={item.id} delay={index * 0.05}>
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
                    <h3 className="font-semibold text-lg">{item.question}</h3>
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
                      <p className="mt-4 ml-14 text-muted-foreground leading-relaxed">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </CardWrapper>
          ))}
        </div>
      </div>
    )
  }