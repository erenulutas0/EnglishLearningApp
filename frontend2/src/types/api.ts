export interface Word {
  id: number;
  englishWord: string;
  turkishMeaning: string;
  learnedDate: string;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'difficult';
  sentences: Sentence[];
}

export interface Sentence {
  id: number;
  sentence: string;
  translation: string;
  wordId: number;
}

export interface WordReview {
  id: number;
  wordId: number;
  reviewDate: string;
  reviewType: string;
  notes?: string;
}

export interface SentencePractice {
  id: number;
  english: string;
  turkish: string;
  difficulty: DifficultyLevel;
  addedDate: string;
  wordId?: number;
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface SentenceWithSource {
  id: number;
  english: string;
  turkish: string;
  difficulty: DifficultyLevel;
  addedDate: string;
  wordId?: number;
  word?: Word;
}

export interface ReviewStats {
  totalWords: number;
  totalSentences: number;
  totalReviews: number;
  averageDifficulty: number;
}

export interface CreateWordRequest {
  english: string;
  turkish: string;
  addedDate: string;
  difficulty?: 'easy' | 'medium' | 'difficult';
  notes?: string;
}

export interface CreateSentenceRequest {
  english: string;
  turkish: string;
}

export interface CreateReviewRequest {
  reviewDate: string;
  reviewType?: string;
  notes?: string;
}

export interface CreateSentencePracticeRequest {
  english: string;
  turkish: string;
  difficulty: DifficultyLevel;
  addedDate: string;
  wordId?: number;
}
