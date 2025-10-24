import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, BookOpen, Sparkles, Filter, Calendar } from "lucide-react";
import { apiService } from "../services/api";
import { Word } from "../types/api";

interface SentenceWithWord {
  id: number;
  sentence: string;
  translation: string;
}

export function SentencesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allSentences, setAllSentences] = useState<SentenceWithWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");

  useEffect(() => {
    const fetchSentences = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Starting to fetch words from API...');
        const words = await apiService.getAllWords();
        console.log('Fetched words:', words);
        console.log('Number of words fetched:', words.length);
        console.log('First word structure:', words[0]);
        console.log('First word keys:', Object.keys(words[0] || {}));
        
        const sentencesWithWords: SentenceWithWord[] = words.flatMap(word => {
          console.log('Processing word:', word.englishWord, 'with sentences:', word.sentences);
          console.log('Word object:', word);
          
          // Use the correct field names from backend
          const wordText = word.englishWord || word.id?.toString() || 'Unknown';
          const wordTranslation = word.turkishMeaning || '';
          
          console.log('Extracted word text:', wordText);
          console.log('Extracted translation:', wordTranslation);
          
          if (!word.sentences || word.sentences.length === 0) {
            console.log('No sentences for word:', wordText);
            return [];
          }
          return word.sentences.map(sentence => ({
            id: sentence.id,
            sentence: sentence.sentence || '',
            translation: sentence.translation || '',
            word: wordText,
            wordTranslation: wordTranslation,
            learnedDate: word.learnedDate || '',
            difficulty: word.difficulty || 'easy'
          }));
        });
        
        console.log('Processed sentences:', sentencesWithWords);
        console.log('Number of sentences processed:', sentencesWithWords.length);
        setAllSentences(sentencesWithWords);
      } catch (err) {
        console.error('Error fetching sentences:', err);
        console.error('Error details:', err);
        setError(`Cümleler yüklenirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
        setAllSentences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSentences();
  }, []);

  // Filter and sort sentences
  const filteredSentences = allSentences
    .filter((sentence) => {
      // Search filter
      const matchesSearch = 
        sentence.sentence?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sentence.translation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sentence.word?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Difficulty filter
      const matchesDifficulty = 
        difficultyFilter === "all" || 
        sentence.difficulty === difficultyFilter;
      
      // Month filter
      const matchesMonth = 
        monthFilter === "all" || 
        (sentence.learnedDate && sentence.learnedDate.startsWith(monthFilter));
      
      return matchesSearch && matchesDifficulty && matchesMonth;
    })
    .sort((a, b) => {
      // Sort by learned date (newest first)
      const dateA = new Date(a.learnedDate);
      const dateB = new Date(b.learnedDate);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-indigo-900 dark:text-indigo-100">Örnek Cümleler</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Öğrendiğiniz tüm kelimelerin gerçek kullanım örnekleri. 
            Kelimeleri bağlamında görüp pekiştirin.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Kelime veya cümle ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-200 dark:border-gray-700 focus:border-indigo-400 dark:focus:border-indigo-500 dark:text-gray-100"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Zorluk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="easy">Kolay</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="difficult">Zor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Ay" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="2025-01">Ocak 2025</SelectItem>
                  <SelectItem value="2025-02">Şubat 2025</SelectItem>
                  <SelectItem value="2025-03">Mart 2025</SelectItem>
                  <SelectItem value="2025-04">Nisan 2025</SelectItem>
                  <SelectItem value="2025-05">Mayıs 2025</SelectItem>
                  <SelectItem value="2025-06">Haziran 2025</SelectItem>
                  <SelectItem value="2025-07">Temmuz 2025</SelectItem>
                  <SelectItem value="2025-08">Ağustos 2025</SelectItem>
                  <SelectItem value="2025-09">Eylül 2025</SelectItem>
                  <SelectItem value="2025-10">Ekim 2025</SelectItem>
                  <SelectItem value="2025-11">Kasım 2025</SelectItem>
                  <SelectItem value="2025-12">Aralık 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-center">
            {filteredSentences.length} cümle bulundu
          </p>
        </div>

        {/* Sentences Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">Cümleler Yükleniyor...</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Lütfen bekleyin.
              </p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-red-900 dark:text-red-100 mb-2">Hata Oluştu</h3>
              <p className="text-red-600 dark:text-red-400">
                {error}
              </p>
            </Card>
          ) : filteredSentences.length === 0 ? (
            <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">Cümle Bulunamadı</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Arama kriterlerinize uygun cümle bulunamadı.
              </p>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {filteredSentences.map((sentence, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          {sentence.word}
                        </Badge>
                        <span className="text-gray-500 dark:text-gray-400">
                          {sentence.wordTranslation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            sentence.difficulty === 'easy' 
                              ? 'border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-900/20'
                              : sentence.difficulty === 'medium'
                              ? 'border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:bg-orange-900/20'
                              : 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-900/20'
                          }`}
                        >
                          {sentence.difficulty === 'easy' ? 'Kolay' : sentence.difficulty === 'medium' ? 'Orta' : 'Zor'}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(sentence.learnedDate).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                        <p className="text-gray-900 dark:text-gray-100">
                          {sentence.sentence}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          {sentence.translation}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}