"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Clock, ChevronRight, Tag, X } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Article } from "@/lib/articles"

const categories = ["All", "Evidence Islam is Truth", "The Benefits of Islam", "Beliefs of Islam", "How to Convert to Islam", "Worship and Practice", "The Hereafter", "Stories of New Muslims", "Comparative Religion", "The Holy Quran", "The Prophet Muhammad", "Current Issues", "Islamic History", "Systems in Islam", "General"]

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.get('q') || "")
  const [inputValue, setInputValue] = useState(searchParams.get('q') || "")
  const [selectedCategory, setSelectedCategory] = useState("All")

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
      // Redirect to search page with search parameter
      router.push(`/search/articles?q=${encodeURIComponent(query)}`)
    } else {
      // Clear search and stay on articles page
      setSearch("")
      setInputValue("")
      router.replace('/articles')
    }
  }

  const filteredArticles = articles
    .filter(article => selectedCategory === "All" || article.category === selectedCategory)
    .filter(article => 
      !search || 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      article.content.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald mb-2">
            Articles
          </h1>
          <p className="text-muted-foreground">
            {search
              ? `Found ${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''} for "${search}"`
              : "Read and learn from our collection of Islamic articles"
            }
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value
                setInputValue(value)
                // Clear search when input becomes empty
                if (!value.trim()) {
                  setSearch("")
                  router.replace('/articles')
                }
              }}
              className="pl-9 pr-9 rounded-xl"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue("")
                  setSearch("")
                  router.replace('/articles')
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
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
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
    </div>
  )
}