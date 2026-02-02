"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Clock, ChevronRight, Tag, X } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { articles } from "@/lib/articles"

const categories = ["All", "Evidence Islam is Truth", "The Benefits of Islam", "Beliefs of Islam", "How to Convert to Islam", "Worship and Practice", "The Hereafter", "Stories of New Muslims", "Comparative Religion", "The Holy Quran", "The Prophet Muhammad", "Current Issues", "Islamic History", "Systems in Islam", "General"]

export default function SearchArticlesClient() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [initialLoad, setInitialLoad] = useState(true)

  // Immediate search on mount if query exists
  useEffect(() => {
    const query = searchParams.get('q')
    if (query && initialLoad) {
      setSearch(query)
      performSearch(query)
      setInitialLoad(false)
    }
  }, [searchParams, initialLoad])

  const performSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search/articles?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      } else {
        // Fallback to client-side search
        const filtered = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
      }
    } catch (error) {
      // Fallback to client-side search
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    if (query) {
      await performSearch(query)
      // Update URL with search parameter
      window.history.replaceState({}, '', `/search/articles?q=${encodeURIComponent(query)}`)
    }
  }
        window.history.replaceState({}, '', `/search/articles?q=${encodeURIComponent(query)}`)
      } catch (error) {
        // Fallback to client-side search
        const filtered = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
        // Update URL with search parameter
        window.history.replaceState({}, '', `/search/articles?q=${encodeURIComponent(query)}`)
      } finally {
        setLoading(false)
      }
    } else {
      // Redirect immediately when search is empty
      window.location.href = '/articles'
    }
  }

  const clearSearch = () => {
    setSearch("")
    setSearchResults([])
    // Redirect to articles list page
    window.location.href = '/articles'
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
            Search Articles
          </h1>
          <p className="text-muted-foreground">
            {searchResults.length > 0
              ? `Found ${searchResults.length} article${searchResults.length !== 1 ? 's' : ''} for "${search}"`
              : search
                ? `Searching for "${search}"...`
                : "Search our collection of Islamic articles"
            }
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                const value = e.target.value
                setSearch(value)
                // Redirect immediately when search becomes empty
                if (!value.trim()) {
                  window.location.href = '/articles'
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
                No articles found for "{search}"
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((article, index) => (
                <CardWrapper key={article.id} delay={index * 0.05}>
                  <Link href={`/articles/${article.id}`} className="block h-full">
                    {/* Feature Image */}
                    {article.featureImage && (
                      <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                        <img
                          src={article.featureImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-xs font-medium">
                          {article.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {article.readTime} min read
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center text-emerald font-medium text-sm">
                        Read more
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </CardWrapper>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}