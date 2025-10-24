import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { apiService } from "../services/api";
import { Word } from "../types/api";

interface SentencePanelProps {
  selectedWord: string | null;
}

export function SentencePanel({ selectedWord }: SentencePanelProps) {
  const [wordData, setWordData] = useState<Word | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMeaningExpanded, setIsMeaningExpanded] = useState(false);

  useEffect(() => {
    if (!selectedWord) {
      setWordData(null);
      return;
    }

    const fetchWordData = async () => {
      setLoading(true);
      setError(null);
      try {
        // First get all words to find the one with matching english text
        const allWords = await apiService.getAllWords();
        const word = allWords.find(w => w.englishWord === selectedWord);
        setWordData(word || null);
      } catch (err) {
        console.error('Error fetching word data:', err);
        setError('Kelime verisi yüklenirken hata oluştu');
        setWordData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWordData();
  }, [selectedWord]);

  if (!selectedWord) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Örnek cümleleri görmek için</p>
          <p>bir kelime seçin</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Kelime verisi yükleniyor...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  const sentences = wordData?.sentences || [];

  return (
    <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-indigo-900 dark:text-indigo-100">Kelime Anlamı</h2>
        </div>
        <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 mb-4">
          {selectedWord}
        </Badge>
        
        {/* Word Translation - Collapsible */}
        {wordData?.turkishMeaning && (
          <div className="mb-4">
            <button
              onClick={() => setIsMeaningExpanded(!isMeaningExpanded)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-gray-700 border border-indigo-100 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Anlamı
              </span>
              {isMeaningExpanded ? (
                <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>
            
            {isMeaningExpanded && (
              <div className="mt-2 p-3 rounded-lg bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-600">
                <p className="text-gray-900 dark:text-gray-100">
                  {wordData.turkishMeaning}
                </p>
              </div>
            )}
          </div>
        )}

        <h3 className="text-indigo-900 dark:text-indigo-100 mt-6 mb-3">Örnek Cümleler</h3>
      </div>

      <ScrollArea className="h-[350px] pr-4">
        {sentences.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Bu kelime için örnek cümle bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentences.map((sentence, index) => (
              <div key={sentence.id || index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-gray-600">
                <p className="text-gray-900 dark:text-gray-100 mb-3 leading-relaxed">
                  {sentence.sentence}
                </p>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  {sentence.translation}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}