import { useState, useEffect } from "react";
import { Calendar } from "./Calendar";
import { WordList } from "./WordList";
import { SentencePanel } from "./SentencePanel";
import { SentenceAdder } from "./SentenceAdder";
import { WordAdder } from "./WordAdder";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { apiService } from "../services/api";

export function WordsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<{ id: number; english: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteClick = (wordId: number, wordEnglish: string) => {
    setWordToDelete({ id: wordId, english: wordEnglish });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!wordToDelete) return;

    setDeletingId(wordToDelete.id);
    try {
      await apiService.deleteWord(wordToDelete.id);
      // Trigger refresh for both word list and calendar
      setRefreshTrigger(prev => prev + 1);
      // If the deleted word was selected, clear selection
      if (selectedWord === wordToDelete.english) {
        setSelectedWord(null);
      }
    } catch (err) {
      console.error('Error deleting word:', err);
      alert(`Kelime silinirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setDeletingId(null);
      setWordToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-indigo-900 dark:text-indigo-100 mb-2">Kelime Öğrenme Takviminiz</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tarihe tıklayarak o gün öğrendiğiniz kelimeleri görüntüleyin
          </p>
        </div>

        {/* Calendar and Word Adder Row */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Button */}
          <div>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setSelectedWord(null);
              }}
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Word Adder Section */}
          <div>
          <WordAdder 
            selectedDate={selectedDate}
            onWordAdded={() => {
              // Trigger word list refresh
              setRefreshTrigger(prev => prev + 1);
              console.log('Word added successfully');
            }}
          />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Word List Section */}
          <div>
            <WordList
              selectedDate={selectedDate}
              selectedWord={selectedWord}
              onWordSelect={setSelectedWord}
              refreshTrigger={refreshTrigger}
              onWordDeleted={() => {
                // Trigger refresh for both word list and calendar
                setRefreshTrigger(prev => prev + 1);
              }}
              onDeleteClick={handleDeleteClick}
            />
          </div>

          {/* Sentence Panel Section */}
          <div>
            <SentencePanel selectedWord={selectedWord} />
          </div>
        </div>

      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Kelime Sil"
        message={`"${wordToDelete?.english}" kelimesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        variant="destructive"
      />
    </div>
  );
}