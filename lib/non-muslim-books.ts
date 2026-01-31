export interface NonMuslimBook {
  id: string;
  title: string;
  author: string;
  description: string;
  color: string;
  category: string;
  pages: number;
  thumbnail: string;
  pdfUrl: string;
  detailUrl: string;
  language: string;
}

import nonMuslimBooksData from './non-muslim-books-data.json' assert { type: 'json' };

export const nonMuslimBooks: NonMuslimBook[] = nonMuslimBooksData;