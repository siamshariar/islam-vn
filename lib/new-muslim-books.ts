import newMuslimBooksData from './new-muslim-books-data.json'

export interface NewMuslimBook {
  id: string
  title: string
  author: string
  category: string
  description: string
  publishedDate: string
  pages: number
  language: string
  thumbnail: string
  color: string
  pdfUrl: string
  audioUrl: string
  rating: number
  ratingCount: number
  downloadCount: number
}

export const newMuslimBooks: NewMuslimBook[] = newMuslimBooksData

export const getNewMuslimBookById = (id: string): NewMuslimBook | undefined => {
  return newMuslimBooks.find(book => book.id === id)
}

export const getNewMuslimBooksByCategory = (category: string): NewMuslimBook[] => {
  return newMuslimBooks.filter(book => book.category === category)
}

export const getNewMuslimBookCategories = (): string[] => {
  return [...new Set(newMuslimBooks.map(book => book.category))]
}