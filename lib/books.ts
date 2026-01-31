import booksData from './books-data.json' assert { type: 'json' };

export const books = booksData
  .map((book: any, index: number) => ({
    id: book.id,
    title: book.Title,
    author: book.Author || 'Unknown Author',
    translator: book.Translator || '',
    category: book.category,
    pages: book.pages,
    color: book.color,
    thumbnail: book.thumb_img_url || null,
    description: book.Description,
    url: book.Url,
    pdfUrl: book.Pdf_url,
  }))
  .sort((a, b) => {
    // Books with thumbnails come first
    if (a.thumbnail && !b.thumbnail) return -1;
    if (!a.thumbnail && b.thumbnail) return 1;
    return 0;
  });


