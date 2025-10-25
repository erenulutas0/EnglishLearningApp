import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, BookOpen, Sparkles, Filter, Calendar, Plus, X } from "lucide-react";
import { apiService } from "../services/api";
import { Word } from "../types/api";

interface SentenceWithWord {
  id: number;
  sentence: string;
  translation: string;
  difficulty?: string;
  createdDate?: string;
  learnedDate?: string;
  word?: string;
  wordTranslation?: string;
  source?: string;
}

export function SentencesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allSentences, setAllSentences] = useState<SentenceWithWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [showWordModal, setShowWordModal] = useState(false);
  const [newWord, setNewWord] = useState({ english: "", turkish: "", difficulty: "easy" });
  const [addingWord, setAddingWord] = useState(false);

  useEffect(() => {
    const fetchSentences = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Starting to fetch all sentences from API...');
        const allSentencesData = await apiService.getAllSentences();
        console.log('Fetched all sentences:', allSentencesData);
        console.log('Number of sentences fetched:', allSentencesData.length);
        
        const sentencesWithWords: SentenceWithWord[] = allSentencesData.map((sentenceData: any, index: number) => {
          console.log('Processing sentence:', sentenceData);
          
          return {
            id: sentenceData.id || index,
            sentence: sentenceData.englishSentence || sentenceData.sentence || '',
            translation: sentenceData.turkishTranslation || sentenceData.translation || '',
            difficulty: sentenceData.difficulty || 'easy',
            createdDate: sentenceData.createdDate,
            learnedDate: sentenceData.learnedDate,
            word: sentenceData.word,
            wordTranslation: sentenceData.wordTranslation,
            source: sentenceData.source
          };
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

  const handleAddWord = async () => {
    if (!newWord.english.trim() || !newWord.turkish.trim()) {
      alert("Lütfen İngilizce cümle ve Türkçe çevirisini girin.");
      return;
    }

    setAddingWord(true);
    try {
      await apiService.addSentencePractice(
        newWord.english.trim(),
        newWord.turkish.trim(),
        newWord.difficulty
      );
      
      // Reset form
      setNewWord({ english: "", turkish: "", difficulty: "easy" });
      setShowWordModal(false);
      
      // Refresh sentences
      const allSentencesData = await apiService.getAllSentences();
      const sentencesWithWords: SentenceWithWord[] = allSentencesData.map((sentenceData: any, index: number) => {
        return {
          id: sentenceData.id || index,
          sentence: sentenceData.englishSentence || sentenceData.sentence || '',
          translation: sentenceData.turkishTranslation || sentenceData.translation || '',
          difficulty: sentenceData.difficulty || 'easy',
          createdDate: sentenceData.createdDate,
          learnedDate: sentenceData.learnedDate,
          word: sentenceData.word,
          wordTranslation: sentenceData.wordTranslation,
          source: sentenceData.source
        };
      });
      setAllSentences(sentencesWithWords);
      
      alert("Cümle başarıyla eklendi!");
    } catch (err) {
      console.error('Error adding sentence:', err);
      alert(`Cümle eklenirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setAddingWord(false);
    }
  };

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
          {/* Search Input and Add Word Button */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Kelime veya cümle ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-200 dark:border-gray-700 focus:border-indigo-400 dark:focus:border-indigo-500 dark:text-gray-100"
              />
            </div>
            <button
              onClick={() => setShowWordModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Cümle Ekle
            </button>
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
            <ScrollArea className="h-[calc(100vh-320px)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-purple-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-purple-600 dark:[&::-webkit-scrollbar-track]:bg-gray-700 dark:[&::-webkit-scrollbar-thumb]:bg-purple-500 dark:[&::-webkit-scrollbar-thumb:hover]:bg-purple-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {filteredSentences.map((sentence, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-indigo-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-3">
                      {/* Word information - only show for word-related sentences */}
                      {sentence.source === 'word' && sentence.word && (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                            {sentence.word}
                          </Badge>
                          <span className="text-gray-500 dark:text-gray-400">
                            {sentence.wordTranslation}
                          </span>
                        </div>
                      )}
                      
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
                          {sentence.createdDate ? 
                            new Date(sentence.createdDate).toLocaleDateString('tr-TR') :
                            sentence.learnedDate ? 
                              new Date(sentence.learnedDate).toLocaleDateString('tr-TR') :
                              'Tarih yok'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            (EN)
                          </span>
                          <p className="text-gray-900 dark:text-gray-100 flex-1">
                            {sentence.sentence}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            (TR)
                          </span>
                          <p className="text-gray-700 dark:text-gray-300 italic flex-1">
                            {sentence.translation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Word Addition Modal */}
      {showWordModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowWordModal(false)}
        >
          <div 
            style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e5e7eb',
              maxWidth: '28rem',
              width: '90%',
              maxHeight: '80vh',
              margin: '1rem',
              zIndex: 10000,
              animation: 'fade-in-zoom-in 0.2s ease-out',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                Yeni Cümle Ekle
              </h3>
              <button
                onClick={() => setShowWordModal(false)}
                style={{ padding: '0.25rem', borderRadius: '9999px', transitionProperty: 'background-color', transitionDuration: '200ms', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                <X style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1rem', flex: 1, overflow: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* English Word Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    İngilizce Cümle *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter English sentence..."
                    value={newWord.english}
                    onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Turkish Meaning Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Türkçe Çevirisi *
                  </label>
                  <Input
                    type="text"
                    placeholder="Türkçe çevirisini girin..."
                    value={newWord.turkish}
                    onChange={(e) => setNewWord({ ...newWord, turkish: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Difficulty Level */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Zorluk Seviyesi
                  </label>
                  <select
                    value={newWord.difficulty}
                    onChange={(e) => setNewWord({ ...newWord, difficulty: e.target.value as 'easy' | 'medium' | 'difficult' })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="easy">Kolay</option>
                    <option value="medium">Orta</option>
                    <option value="difficult">Zor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setShowWordModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 200ms'
                }}
              >
                İptal
              </button>
              <button
                onClick={handleAddWord}
                disabled={addingWord}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: addingWord ? '#9ca3af' : '#4f46e5',
                  color: 'white',
                  cursor: addingWord ? 'not-allowed' : 'pointer',
                  transition: 'all 200ms',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {addingWord ? (
                  <>
                    <div style={{ width: '1rem', height: '1rem', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Ekleniyor...
                  </>
                ) : (
                  'Kaydet'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}