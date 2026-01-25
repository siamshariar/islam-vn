"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, ChevronRight, Tag } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { articles } from "@/lib/articles"

const categories = ["All", "Basics", "Lifestyle", "Education", "Community", "History", "Worship", "Finance", "Family"]

export default function ArticlesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredArticles = articles.filter(
    (article) =>
      (selectedCategory === "All" || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(search.toLowerCase()) || article.excerpt.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald mb-2">Articles</h1>
          <p className="text-muted-foreground">Read and learn from our collection of Islamic articles</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
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

      <div className="space-y-4">
        {filteredArticles.map((article, index) => (
          <CardWrapper key={article.id} delay={index * 0.05}>
            <Link href={`/articles/${article.id}`} className="block p-5 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald/10 text-emerald rounded-lg text-xs font-medium">
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </Link>
          </CardWrapper>
        ))}
      </div>
    </div>
  )
}
