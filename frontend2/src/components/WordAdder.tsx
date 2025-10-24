import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, BookOpen } from "lucide-react";
import { apiService } from "../services/api";
import { SentenceModal } from "./ui/sentence-modal";

interface WordAdderProps {
  selectedDate: Date | undefined;
  onWordAdded?: () => void;
}

interface Sentence {
  id: number;
  english: string;
  turkish: string;
}

export function WordAdder({ selectedDate, onWordAdded }: WordAdderProps) {
  const [englishWord, setEnglishWord] = useState("");
  const [turkishMeaning, setTurkishMeaning] = useState("");
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'difficult'>('easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [showSentenceModal, setShowSentenceModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setError("Lütfen önce bir tarih seçin");
      return;
    }

    if (!englishWord.trim() || !turkishMeaning.trim()) {
      setError("İngilizce kelime ve Türkçe anlamı zorunludur");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use local date formatting to avoid timezone issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('Selected date:', selectedDate);
      console.log('Date string being sent:', dateStr);
      
      const savedWord = await apiService.createWord({
        english: englishWord.trim(),
        turkish: turkishMeaning.trim(),
        addedDate: dateStr,
        difficulty: difficulty
      });

      // Save sentences to database
      if (sentences.length > 0 && savedWord.id) {
        for (const sentence of sentences) {
          await apiService.addSentence(savedWord.id, sentence.english, sentence.turkish);
        }
      }

      setEnglishWord("");
      setTurkishMeaning("");
      setSentences([]);
      
      if (onWordAdded) {
        onWordAdded();
      }
    } catch (err) {
      console.error('Error adding word:', err);
      setError(`Kelime eklenirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSentence = () => {
    setShowSentenceModal(true);
  };

  const handleSaveSentences = (newSentences: Sentence[]) => {
    setSentences(newSentences);
  };

  if (!selectedDate) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Kelime eklemek için</p>
          <p>bir tarih seçin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-indigo-900 dark:text-indigo-100">Kelime Ekle</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <strong>{selectedDate.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}</strong> tarihi için yeni kelime ekleyin
        </p>
      </div>


      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Word Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            İngilizce Kelime *
          </label>
          <Input
            value={englishWord}
            onChange={(e) => setEnglishWord(e.target.value)}
            placeholder="Enter English word..."
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Türkçe Anlamı *
          </label>
          <Input
            value={turkishMeaning}
            onChange={(e) => setTurkishMeaning(e.target.value)}
            placeholder="Türkçe anlamını girin..."
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Zorluk Seviyesi
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'difficult')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="easy">Kolay</option>
            <option value="medium">Orta</option>
            <option value="difficult">Zor</option>
          </select>
        </div>
        
        {/* Add Sentence Button */}
        <div className="flex items-center justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSentence}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-indigo-300 dark:border-indigo-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cümle Ekle
          </Button>
        </div>


        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Ekleniyor..." : "Kelimeyi Kaydet"}
        </Button>
      </form>

      {/* Sentence Modal */}
      <SentenceModal
        isOpen={showSentenceModal}
        onClose={() => setShowSentenceModal(false)}
        onSave={handleSaveSentences}
        existingSentences={sentences}
      />
    </Card>
  );
}
