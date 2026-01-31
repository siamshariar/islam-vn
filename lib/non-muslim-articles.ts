export interface NonMuslimArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  featureImage: string;
  content: string;
  author: string;
  language: string;
  pdfUrls: string[];
  audioUrls: string[];
  videoUrls: string[];
  docUrls: string[];
  detailUrl: string;
  scrapedUrl: string;
}

import nonMuslimArticlesData from './non-muslim-articles-data.json' assert { type: 'json' };

export const nonMuslimArticles: NonMuslimArticle[] = nonMuslimArticlesData;