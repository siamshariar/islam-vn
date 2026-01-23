"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, BookOpen, Download } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const books = [
  {
    id: "1",
    title: "The Sealed Nectar",
    author: "Safiur Rahman Mubarakpuri",
    translator: "Translated by Issam Diab",
    category: "Biography",
    pages: 600,
    color: "from-emerald to-emerald-light",
    thumbnail: null,
    description: "The Sealed Nectar is an award-winning biography of Prophet Muhammad (peace be upon him). It provides a comprehensive account of his life, from his birth in Mecca to his death in Medina. This book offers detailed insights into the Prophet's character, his struggles, and the establishment of Islam. Winner of the first prize in a competition organized by the Muslim World League, this biography is considered one of the most authentic and detailed accounts of the Prophet's life available in English.",
  },
  {
    id: "2",
    title: "Fortress of the Muslim",
    author: "Sa'id Al-Qahtani",
    translator: "Translated by Abdul Karim",
    category: "Supplications",
    pages: 200,
    color: "from-gold to-orange",
    thumbnail: null,
    description: "A comprehensive collection of authentic supplications and remembrances from the Quran and Sunnah. This pocket-sized book is an essential companion for every Muslim, containing prayers for various occasions and situations in daily life. From morning and evening remembrances to prayers for travel, illness, and success, this book serves as a spiritual fortress protecting the believer through the power of sincere supplication.",
  },
  {
    id: "3",
    title: "Riyad us-Saliheen",
    author: "Imam An-Nawawi",
    translator: "Translated by Muhammad Amin",
    category: "Hadith Collection",
    pages: 1500,
    color: "from-emerald-light to-emerald",
    thumbnail: null,
    description: "Gardens of the Righteous is one of the most celebrated collections of hadith in Islamic literature. Compiled by Imam An-Nawawi, this masterpiece organizes authentic hadiths thematically, covering topics such as sincerity, repentance, patience, truthfulness, and much more. Each chapter begins with relevant Quranic verses followed by hadiths, making it an invaluable resource for understanding Islamic teachings and developing good character.",
  },
  {
    id: "4",
    title: "The Book of Tawheed",
    author: "Muhammad ibn Abdul Wahhab",
    translator: "Translated by Sameh Strauch",
    category: "Theology",
    pages: 300,
    color: "from-orange to-gold",
    thumbnail: null,
    description: "This fundamental text explores the Islamic concept of monotheism (Tawheed) in depth. Written by Muhammad ibn Abdul Wahhab, the book clarifies the different categories of Tawheed and explains common misconceptions. Each chapter addresses a specific aspect of Islamic monotheism with supporting evidence from the Quran and authentic hadith, making it essential reading for understanding the core principle of Islamic faith.",
  },
  {
    id: "5",
    title: "Sahih Al-Bukhari",
    author: "Imam Al-Bukhari",
    translator: "Translated by Muhammad Muhsin Khan",
    category: "Hadith Collection",
    pages: 9000,
    color: "from-emerald to-gold",
    thumbnail: null,
    description: "Sahih Al-Bukhari is the most authentic collection of hadith in Islamic literature. Compiled by Imam Muhammad ibn Ismail al-Bukhari over 16 years, this monumental work contains over 7,000 authentic hadiths selected from 600,000 narrations. Organized into books and chapters covering all aspects of Islamic life, it remains the primary source for understanding the teachings and practices of Prophet Muhammad (peace be upon him).",
  },
  {
    id: "6",
    title: "Sahih Muslim",
    author: "Imam Muslim",
    translator: "Translated by Abdul Hamid Siddiqui",
    category: "Hadith Collection",
    pages: 7000,
    color: "from-gold to-emerald",
    thumbnail: null,
    description: "Sahih Muslim is the second most authentic collection of hadith after Sahih Al-Bukhari. Compiled by Imam Muslim ibn al-Hajjaj, this collection contains approximately 7,500 hadiths organized thematically. Known for its meticulous methodology and chain of narration, Sahih Muslim is considered an indispensable reference for Islamic jurisprudence, theology, and daily practice.",
  },
  {
    id: "7",
    title: "Tafsir Ibn Kathir",
    author: "Ibn Kathir",
    translator: "Translated by Ali Al-Halawani",
    category: "Quranic Commentary",
    pages: 10000,
    color: "from-emerald-light to-gold",
    thumbnail: null,
    description: "Tafsir Ibn Kathir is one of the most respected and widely used commentaries on the Quran. Written by the renowned Islamic scholar Ismail ibn Kathir, this comprehensive work explains the meanings of Quranic verses using authentic hadiths, statements of the companions, and linguistic analysis. Spanning ten volumes, it provides historical context and detailed explanations that help readers understand the profound wisdom of the Quran.",
  },
  {
    id: "8",
    title: "Stories of the Prophets",
    author: "Ibn Kathir",
    translator: "Translated by Muhammad Mustafa",
    category: "History",
    pages: 500,
    color: "from-orange to-emerald",
    thumbnail: null,
    description: "Stories of the Prophets presents the lives and missions of all the prophets mentioned in the Quran, from Adam to Muhammad (peace be upon them all). Written by Ibn Kathir, this engaging compilation draws from authentic Islamic sources to narrate the challenges, miracles, and teachings of these noble messengers. Each story offers valuable lessons and demonstrates the consistent message of monotheism throughout human history.",
  },
]

function BookCover({ title, author, color }: { title: string; author: string; color: string }) {
  return (
    <div
      className={`aspect-[3/4] bg-gradient-to-br ${color} p-5 flex flex-col justify-between rounded-t-2xl relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8" />

      <div className="relative z-10">
        <div className="w-10 h-1.5 bg-white/40 rounded-full mb-4" />
        <BookOpen className="w-8 h-8 text-white/60 mb-3" />
      </div>
      <div className="relative z-10">
        <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-3">{title}</h3>
        <p className="text-white/80 text-sm line-clamp-1">{author}</p>
      </div>
    </div>
  )
}

export default function BooksPage() {
  const [search, setSearch] = useState("")

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald mb-2">Books</h1>
            <p className="text-muted-foreground">Explore our collection of Islamic literature</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book, index) => (
            <CardWrapper key={book.id} delay={index * 0.05}>
              <Link href={`/books/${book.id}`}>
                <BookCover title={book.title} author={book.author} color={book.color} />
              </Link>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{book.pages} pages</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-xl text-emerald hover:text-emerald hover:bg-emerald/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardWrapper>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
