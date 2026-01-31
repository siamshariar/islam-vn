"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, HelpCircle, ChevronDown, ChevronUp, X } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { qaItems } from "@/lib/qa"

export default function SearchQAClient() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(!!searchParams.get('q')) // Set loading to true if there's a query

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    if (query) {
      setLoading(true)
      try {
        const response = await fetch(`/api/search/qa?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.results || [])
        } else {
          // Fallback to client-side search
          const filtered = qaItems.filter(
            (item: any) =>
              item.question.toLowerCase().includes(query.toLowerCase()) ||
              item.answer.toLowerCase().includes(query.toLowerCase()) ||
              item.category.toLowerCase().includes(query.toLowerCase())
          )
          setSearchResults(filtered)
        }
        // Update URL with search parameter
        window.history.replaceState({}, '', `/search/qa?q=${encodeURIComponent(query)}`)
      } catch (error) {
        // Fallback to client-side search
        const filtered = qaItems.filter(
          (item: any) =>
            item.question.toLowerCase().includes(query.toLowerCase()) ||
            item.answer.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
        // Update URL with search parameter
        window.history.replaceState({}, '', `/search/qa?q=${encodeURIComponent(query)}`)
      } finally {
        setLoading(false)
      }
    } else {
      // Redirect immediately when search is empty
      window.location.href = '/qa'
    }
  }

  const clearSearch = () => {
    setSearch("")
    setSearchResults([])
    // Redirect to qa list page
    window.location.href = '/qa'
  }

  // Handle URL search params on mount
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearch(query)
      // Trigger search for direct URL access
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
      handleSearch(syntheticEvent)
    }
  }, [])

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald mb-2">
            Search Q&A
          </h1>
          <p className="text-muted-foreground">
            {searchResults.length > 0
              ? `Found ${searchResults.length} Q&A${searchResults.length !== 1 ? 's' : ''} for "${search}"`
              : search
                ? `Searching for "${search}"...`
                : "Search our Q&A collection"
            }
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search Q&A..."
              value={search}
              onChange={(e) => {
                const value = e.target.value
                setSearch(value)
                // Redirect immediately when search becomes empty
                if (!value.trim()) {
                  window.location.href = '/qa'
                }
              }}
              className="pl-9 pr-9 rounded-xl"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald"></div>
        </div>
      ) : (
        <>
          {search && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No Q&A found for "{search}"
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((item, index) => (
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
                            {item.category.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
          ) : null}
        </>
      )}
    </div>
  )
}