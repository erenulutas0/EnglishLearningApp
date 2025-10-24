import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, X, MessageSquare } from "lucide-react";
import { apiService } from "../services/api";

interface SentenceAdderProps {
  selectedWord: string | null;
  onSentenceAdded?: () => void;
}

interface SentenceInput {
  english: string;
  turkish: string;
}

export function SentenceAdder({ selectedWord, onSentenceAdded }: SentenceAdderProps) {
  const [sentences, setSentences] = useState<SentenceInput[]>([
    { english: "", turkish: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addSentence = () => {
    setSentences([...sentences, { english: "", turkish: "" }]);
  };

  const removeSentence = (index: number) => {
    if (sentences.length > 1) {
      setSentences(sentences.filter((_, i) => i !== index));
    }
  };

  const updateSentence = (index: number, field: keyof SentenceInput, value: string) => {
    const updated = sentences.map((sentence, i) => 
      i === index ? { ...sentence, [field]: value } : sentence
    );
    setSentences(updated);
  };

  const handleSubmit = async () => {
    if (!selectedWord) {
      setError("Lütfen önce bir kelime seçin");
      return;
    }

    const validSentences = sentences.filter(s => s.english.trim() && s.turkish.trim());
    if (validSentences.length === 0) {
      setError("En az bir cümle eklemelisiniz");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Find the word ID first
      const allWords = await apiService.getAllWords();
      const word = allWords.find(w => w.englishWord === selectedWord);
      
      if (!word) {
        throw new Error("Kelime bulunamadı");
      }

      // Add each sentence
      for (const sentence of validSentences) {
        await apiService.addSentenceToWord(word.id, {
          english: sentence.english.trim(),
          turkish: sentence.turkish.trim()
        });
      }

      setSuccess(`${validSentences.length} cümle başarıyla eklendi`);
      setSentences([{ english: "", turkish: "" }]);
      
      if (onSentenceAdded) {
        onSentenceAdded();
      }
    } catch (err) {
      console.error('Error adding sentences:', err);
      setError(`Cümleler eklenirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedWord) {
    return (
      <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Cümle eklemek için</p>
          <p>bir kelime seçin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-indigo-900 dark:text-indigo-100">Cümle Ekle</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <strong>{selectedWord}</strong> kelimesi için yeni cümleler ekleyin
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Sentence Inputs */}
      <div className="space-y-4 mb-6">
        {sentences.map((sentence, index) => (
          <div key={index} className="p-4 border border-indigo-100 dark:border-gray-600 rounded-lg bg-indigo-50/50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Cümle {index + 1}
              </h4>
              {sentences.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSentence(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İngilizce Cümle
                </label>
                <Input
                  value={sentence.english}
                  onChange={(e) => updateSentence(index, 'english', e.target.value)}
                  placeholder="Enter English sentence..."
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Türkçe Çeviri
                </label>
                <Input
                  value={sentence.turkish}
                  onChange={(e) => updateSentence(index, 'turkish', e.target.value)}
                  placeholder="Türkçe çevirisini girin..."
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Sentence Button */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          onClick={addSentence}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Cümle Ekle
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sentences.length} cümle
        </span>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Ekleniyor..." : "Cümleleri Kaydet"}
      </Button>
    </Card>
  );
}
