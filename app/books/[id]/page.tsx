"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Download, ChevronLeft, User, Languages, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { books } from "@/lib/books"
import { nonMuslimBooks } from "@/lib/non-muslim-books"
import { newMuslimBooks } from "@/lib/new-muslim-books"

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const book = books.find((b) => b.id === id) || nonMuslimBooks.find((b) => b.id === id) || newMuslimBooks.find((b) => b.id === id) || newMuslimBooks.find((b) => b.id === id)

  // Type guard to check if book has translator property
  const hasTranslator = (book: any): book is typeof books[0] => 'translator' in book
  const hasDetailUrl = (book: any): book is typeof nonMuslimBooks[0] => 'detailUrl' in book

  if (!book) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">Book Not Found</h1>
          <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="px-4 lg:px-8 py-8"
    >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald transition-colors cursor-pointer mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Books
        </button>

        <div className="grid lg:grid-cols-[350px_1fr] gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="sticky top-8">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full aspect-[3/4] object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div
                  className={`w-full aspect-[3/4] bg-gradient-to-br ${book.color} p-6 rounded-xl shadow-lg relative overflow-hidden`}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-2 bg-white/40 rounded-full mb-5" />
                      <BookOpen className="w-12 h-12 text-white/60 mb-4" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl leading-tight mb-3">{book.title}</h3>
                      <p className="text-white/90 text-base">{book.author}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Metadata and Content */}
          <div
            className="space-y-8"
          >
            {/* Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-emerald mb-3 font-serif">{book.title}</h1>
              <p className="text-xl text-muted-foreground">{book.author}</p>
            </div>

            {/* Metadata */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <User className="w-5 h-5 text-emerald" />
                <div>
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="font-semibold">{book.author}</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              {hasTranslator(book) && (
                <>
                  <div className="flex items-center gap-3 text-foreground">
                    <Languages className="w-5 h-5 text-emerald" />
                    <div>
                      <p className="text-sm text-muted-foreground">Translator</p>
                      <p className="font-semibold">{book.translator}</p>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                </>
              )}
              <div className="flex items-center gap-3 text-foreground">
                <Tag className="w-5 h-5 text-emerald" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{book.category}</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3 text-foreground">
                <BookOpen className="w-5 h-5 text-emerald" />
                <div>
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-semibold">{book.pages.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {book.pdfUrl ? (
                <>
                  <Button
                    size="lg"
                    className="flex-1 rounded-xl bg-emerald hover:bg-emerald/90 text-white"
                    asChild
                  >
                    <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Read Now (PDF)
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 rounded-xl border-emerald text-emerald hover:bg-emerald/10 bg-transparent"
                    asChild
                  >
                    <a href={book.pdfUrl} download>
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </a>
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  className="w-full rounded-xl bg-emerald hover:bg-emerald/90 text-white"
                  asChild
                >
                  <a href={hasDetailUrl(book) ? book.detailUrl : '#'} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-5 h-5 mr-2" />
                    View Details
                  </a>
                </Button>
              )}
            </div>

            {/* About Section */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-emerald mb-4">About this Book</h2>
              <div className="prose prose-emerald max-w-none">
                <p className="text-foreground leading-relaxed text-base">{book.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
