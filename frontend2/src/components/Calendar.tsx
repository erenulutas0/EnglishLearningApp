import { useState, useEffect } from "react";
import { Calendar as CalendarUI } from "./ui/calendar";
import { Loader2 } from "lucide-react";
import { apiService } from "../services/api";

interface CalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  refreshTrigger?: number;
}

export function Calendar({ selectedDate, onDateSelect, refreshTrigger }: CalendarProps) {
  const [datesWithWords, setDatesWithWords] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true);
      try {
        // Get all words and extract unique dates from them
        console.log('Fetching all words to extract dates...');
        const allWords = await apiService.getAllWords();
        console.log('Fetched all words:', allWords.length);
        console.log('Sample word:', allWords[0]);
        
        // Extract unique dates from words
        const uniqueDates = [...new Set(allWords.map(word => word.learnedDate))];
        console.log('Unique dates from words:', uniqueDates);
        
        // Create dates in local timezone to avoid timezone issues
        const dates = uniqueDates.map(dateStr => {
          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day); // month is 0-indexed
          console.log(`Converting ${dateStr} to ${date.toDateString()}`);
          return date;
        });
        
        console.log('Dates with words for calendar:', dates);
        console.log('Total dates with words:', dates.length);
        setDatesWithWords(dates);
      } catch (error) {
        console.error('Error fetching dates:', error);
        console.error('Error details:', error);
        setDatesWithWords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [refreshTrigger]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-indigo-100 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
          Tarih Seçin
        </h3>
        <p className="text-sm text-indigo-900 dark:text-indigo-100">
          İşaretli günler kelime öğrendiğiniz günlerdir
        </p>
      </div>

      {/* Calendar Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : (
        <CalendarUI
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onDateSelect(date);
          }}
          className="rounded-md dark:text-gray-200"
          modifiers={{
            hasWords: datesWithWords,
          }}
          modifiersClassNames={{
            hasWords: "bg-indigo-100 dark:bg-indigo-900 font-bold text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800 relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-indigo-600 dark:after:bg-indigo-400 after:rounded-full",
          }}
        />
      )}
    </div>
  );
}