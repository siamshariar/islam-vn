export interface NonMuslimQA {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory: string;
  keywords: string[];
  websiteSource: string;
  url: string;
  relatedTopics: string[];
  difficultyLevel: string;
  qualityScore: string;
  beginnerFriendly: boolean;
  contentType: string;
  language: string;
  detailedExplanation: string;
  quranReferences: string;
  hadithReferences: string;
  dateAdded: string;
  wordCount: number;
  characterCount: number;
}

import nonMuslimQAData from './non-muslim-qa-data.json' assert { type: 'json' };

export const nonMuslimQA: NonMuslimQA[] = nonMuslimQAData;