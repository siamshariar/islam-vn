import newMuslimArticlesData from './new-muslim-articles-data.json'

export interface NewMuslimArticle {
  id: string
  title: string
  category: string
  readTime: string
  publishedDate: string
  excerpt: string
  featureImage: string
  content: string
  author: string
  language: string
  pdfUrls: string[]
  audioUrls: string[]
  videoUrls: string[]
  docUrls: string[]
}

export const newMuslimArticles: NewMuslimArticle[] = newMuslimArticlesData

export const getNewMuslimArticleById = (id: string): NewMuslimArticle | undefined => {
  return newMuslimArticles.find(article => article.id === id)
}

export const getNewMuslimArticlesByCategory = (category: string): NewMuslimArticle[] => {
  return newMuslimArticles.filter(article => article.category === category)
}

export const getNewMuslimArticleCategories = (): string[] => {
  return [...new Set(newMuslimArticles.map(article => article.category))]
}