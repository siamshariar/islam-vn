import newMuslimQAData from './new-muslim-qa-data.json'

export interface NewMuslimQA {
  id: string
  question: string
  answer: string
  category: string
  publishedDate: string
  views: number
  helpful: number
}

export const newMuslimQA: NewMuslimQA[] = newMuslimQAData

export const getNewMuslimQAById = (id: string): NewMuslimQA | undefined => {
  return newMuslimQA.find(qa => qa.id === id)
}

export const getNewMuslimQAByCategory = (category: string): NewMuslimQA[] => {
  return newMuslimQA.filter(qa => qa.category === category)
}

export const getNewMuslimQACategories = (): string[] => {
  return [...new Set(newMuslimQA.map(qa => qa.category))]
}