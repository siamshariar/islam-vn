export interface NonMuslimCategory {
  id: string;
  title: string;
  description: string;
  url: string;
  level: string;
  publishedDate: string;
  statistics: string;
  parentCategory: string;
  objectives: string[];
  arabicTerms: string[];
  fullText: string;
}

import nonMuslimCategoriesData from './non-muslim-categories-data.json' assert { type: 'json' };

export const nonMuslimCategories: NonMuslimCategory[] = nonMuslimCategoriesData;