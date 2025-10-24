import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { BookOpen, CheckCircle2, Trash2 } from "lucide-react";
import { apiService } from "../services/api";
import { Word } from "../types/api";

interface WordListProps {
  selectedDate: Date | undefined;
  selectedWord: string | null;
  onWordSelect: (word: string) => void;
  refreshTrigger?: number;
  onWordDeleted?: () => void;
  onDeleteClick?: (wordId: number, wordEnglish: string) => void;
}

export function WordList({ selectedDate, selectedWord, onWordSelect, refreshTrigger, onWordDeleted, onDeleteClick }: WordListProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedDate) {
      setWords([]);
      return;
    }

    const fetchWords = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use local date instead of ISO to avoid timezone issues
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        console.log('Selected date:', selectedDate);
        console.log('Date string:', dateStr);
        console.log('API URL:', `http://localhost:8082/api/words/date/${dateStr}`);
        
        const fetchedWords = await apiService.getWordsByDate(dateStr);
        console.log('Fetched words:', fetchedWords);
        console.log('Number of words fetched:', fetchedWords.length);
        console.log('First word structure:', fetchedWords[0]);
        setWords(fetchedWords);
      } catch (err) {
        console.error('Error fetching words:', err);
        console.error('Error details:', err);
        setError(`Kelimeler yüklenirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
        setWords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [selectedDate, refreshTrigger]);

  const handleDeleteClick = (wordId: number, wordEnglish: string) => {
    if (onDeleteClick) {
      onDeleteClick(wordId, wordEnglish);
    }
  };


  if (!selectedDate) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Kelimelerinizi görmek için</p>
          <p>bir tarih seçin</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Kelimeler yükleniyor...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (words.length === 0) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Bu tarihte öğrenilen</p>
          <p>kelime bulunmuyor</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-indigo-900 dark:text-indigo-100 mb-1">Kelimeler</h2>
        <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100">
          {words.length} kelime
        </Badge>
      </div>

      <ScrollArea className="h-[350px] pr-4">
        <div className="space-y-2">
          {words.map((word) => (
            <div
              key={word.id}
              className={`w-full p-4 rounded-lg transition-all duration-200 ${
                selectedWord === word.englishWord
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white dark:bg-gray-700 border border-indigo-100 dark:border-gray-600"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() => onWordSelect(word.englishWord)}
                  className="flex-1 text-left cursor-pointer"
                >
                  <p className={`mb-1 ${selectedWord === word.englishWord ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
                    {word.englishWord}
                  </p>
                  <p className={`${selectedWord === word.englishWord ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"}`}>
                    {word.turkishMeaning}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedWord === word.englishWord && (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Delete button clicked for word:', word.englishWord);
                      handleDeleteClick(word.id, word.englishWord);
                    }}
                    disabled={deletingId === word.id}
                    className={`h-10 w-10 p-2 rounded-md transition-colors flex items-center justify-center ${
                      deletingId === word.id 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-red-100 dark:hover:bg-red-900/20"
                    } ${
                      selectedWord === word.englishWord 
                        ? "text-white hover:bg-red-600 hover:text-white" 
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    {deletingId === word.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
    </Card>
  );
}