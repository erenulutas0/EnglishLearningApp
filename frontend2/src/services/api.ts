import { 
  Word, 
  WordReview, 
  SentencePractice, 
  SentenceWithSource, 
  ReviewStats,
  CreateWordRequest,
  CreateSentenceRequest,
  CreateReviewRequest,
  CreateSentencePracticeRequest
} from '../types/api';

const API_BASE_URL = 'http://localhost:8082/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (like DELETE requests)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Word API methods
  async getAllWords(): Promise<Word[]> {
    console.log('API Service: getAllWords called');
    const result = await this.request<Word[]>('/words');
    console.log('API Service: getAllWords result length:', result.length);
    console.log('API Service: getAllWords first word:', result[0]);
    return result;
  }

  async getWordById(id: number): Promise<Word> {
    return this.request<Word>(`/words/${id}`);
  }

  async getWordsByDate(date: string): Promise<Word[]> {
    console.log('API Service: getWordsByDate called with date:', date);
    const result = await this.request<Word[]>(`/words/date/${date}`);
    console.log('API Service: getWordsByDate result:', result);
    return result;
  }

  async getAllDistinctDates(): Promise<string[]> {
    return this.request<string[]>('/words/dates');
  }

  async getWordsByDateRange(startDate: string, endDate: string): Promise<Word[]> {
    return this.request<Word[]>(`/words/range?startDate=${startDate}&endDate=${endDate}`);
  }

  async createWord(word: CreateWordRequest): Promise<Word> {
    // Convert frontend format to backend format
    const backendWord = {
      englishWord: word.english,
      turkishMeaning: word.turkish,
      learnedDate: word.addedDate,
      notes: word.notes || '',
      difficulty: word.difficulty || 'easy'
    };
    
    return this.request<Word>('/words', {
      method: 'POST',
      body: JSON.stringify(backendWord),
    });
  }

  async updateWord(id: number, word: Partial<Word>): Promise<Word> {
    return this.request<Word>(`/words/${id}`, {
      method: 'PUT',
      body: JSON.stringify(word),
    });
  }

  async deleteWord(id: number): Promise<void> {
    return this.request<void>(`/words/${id}`, {
      method: 'DELETE',
    });
  }

  async addSentenceToWord(wordId: number, sentence: CreateSentenceRequest): Promise<Word> {
    return this.request<Word>(`/words/${wordId}/sentences`, {
      method: 'POST',
      body: JSON.stringify(sentence),
    });
  }

  async deleteSentenceFromWord(wordId: number, sentenceId: number): Promise<Word> {
    return this.request<Word>(`/words/${wordId}/sentences/${sentenceId}`, {
      method: 'DELETE',
    });
  }

  // Word Review API methods
  async addReview(wordId: number, review: CreateReviewRequest): Promise<WordReview> {
    const params = new URLSearchParams({
      reviewDate: review.reviewDate,
      ...(review.reviewType && { reviewType: review.reviewType }),
      ...(review.notes && { notes: review.notes }),
    });

    return this.request<WordReview>(`/reviews/words/${wordId}?${params}`);
  }

  async getWordReviews(wordId: number): Promise<WordReview[]> {
    return this.request<WordReview[]>(`/reviews/words/${wordId}`);
  }

  async getReviewsByDate(date: string): Promise<WordReview[]> {
    return this.request<WordReview[]>(`/reviews/date/${date}`);
  }

  async isWordReviewedOnDate(wordId: number, date: string): Promise<boolean> {
    return this.request<boolean>(`/reviews/words/${wordId}/check/${date}`);
  }

  async getReviewCount(wordId: number): Promise<number> {
    return this.request<number>(`/reviews/words/${wordId}/count`);
  }

  async getReviewDates(wordId: number): Promise<string[]> {
    return this.request<string[]>(`/reviews/words/${wordId}/dates`);
  }

  async getReviewSummary(wordId: number): Promise<Record<string, WordReview>> {
    return this.request<Record<string, WordReview>>(`/reviews/words/${wordId}/summary`);
  }

  async deleteReview(reviewId: number): Promise<void> {
    return this.request<void>(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async deleteReviewByWordAndDate(wordId: number, date: string): Promise<void> {
    return this.request<void>(`/reviews/words/${wordId}/date/${date}`, {
      method: 'DELETE',
    });
  }

  // Sentence Practice API methods
  async getAllSentences(): Promise<SentenceWithSource[]> {
    return this.request<SentenceWithSource[]>('/sentences');
  }

  async getSentenceById(id: number): Promise<SentencePractice> {
    return this.request<SentencePractice>(`/sentences/${id}`);
  }

  async createSentence(sentence: CreateSentencePracticeRequest): Promise<SentencePractice> {
    return this.request<SentencePractice>('/sentences', {
      method: 'POST',
      body: JSON.stringify(sentence),
    });
  }

  async updateSentence(id: number, sentence: Partial<SentencePractice>): Promise<SentencePractice> {
    return this.request<SentencePractice>(`/sentences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sentence),
    });
  }

  async deleteSentence(id: number): Promise<void> {
    return this.request<void>(`/sentences/${id}`, {
      method: 'DELETE',
    });
  }

  async getSentencesByDifficulty(difficulty: string): Promise<SentencePractice[]> {
    return this.request<SentencePractice[]>(`/sentences/difficulty/${difficulty}`);
  }

  async getSentencesByDate(date: string): Promise<SentencePractice[]> {
    return this.request<SentencePractice[]>(`/sentences/date/${date}`);
  }

  async getAllDistinctDates(): Promise<string[]> {
    return this.request<string[]>('/sentences/dates');
  }

  async getWordDates(): Promise<string[]> {
    return this.request<string[]>('/words/dates');
  }

  async getSentencesByDateRange(startDate: string, endDate: string): Promise<SentencePractice[]> {
    return this.request<SentencePractice[]>(`/sentences/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  async getSentenceStats(): Promise<ReviewStats> {
    return this.request<ReviewStats>('/sentences/stats');
  }
}

export const apiService = new ApiService();
