export interface Article {
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

import articlesData from './articles-data.json' assert { type: 'json' };

// Remove duplicate articles based on ID
const uniqueArticles = (articlesData as Article[]).filter((article: Article, index: number, self: Article[]) =>
  index === self.findIndex((a: Article) => a.id === article.id)
);

export const articles: Article[] = uniqueArticles;
