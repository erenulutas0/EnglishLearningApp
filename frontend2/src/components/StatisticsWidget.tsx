import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  BarChart3, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Target,
  Award
} from "lucide-react";
import { apiService } from "../services/api";

interface StatisticsWidgetProps {
  selectedDate: Date | undefined;
  refreshTrigger?: number;
}

interface DailyStats {
  wordCount: number;
  sentenceCount: number;
}

interface MonthlyStats {
  totalWords: number;
  totalSentences: number;
  workingDays: number;
  averageWordsPerDay: number;
  averageSentencesPerDay: number;
}

export function StatisticsWidget({ selectedDate, refreshTrigger }: StatisticsWidgetProps) {
  const [dailyStats, setDailyStats] = useState<DailyStats>({ wordCount: 0, sentenceCount: 0 });
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalWords: 0,
    totalSentences: 0,
    workingDays: 0,
    averageWordsPerDay: 0,
    averageSentencesPerDay: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setDailyStats({ wordCount: 0, sentenceCount: 0 });
      return;
    }

    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // Get all words to calculate statistics
        const allWords = await apiService.getAllWords();
        
        // Format selected date for comparison (use local date to avoid timezone issues)
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const selectedDateStr = `${year}-${month}-${day}`;
        
        // Calculate daily stats for selected date
        const dailyWords = allWords.filter(word => word.learnedDate === selectedDateStr);
        const dailyWordCount = dailyWords.length;
        const dailySentenceCount = dailyWords.reduce((total, word) => {
          return total + (word.sentences ? word.sentences.length : 0);
        }, 0);

        setDailyStats({
          wordCount: dailyWordCount,
          sentenceCount: dailySentenceCount
        });

        // Calculate monthly stats
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        
        // Get all words from current month
        const monthlyWords = allWords.filter(word => {
          // Parse the date string directly to avoid timezone issues
          const [year, month, day] = word.learnedDate.split('-').map(Number);
          const wordDate = new Date(year, month - 1, day); // month is 0-indexed
          return wordDate.getMonth() === currentMonth && wordDate.getFullYear() === currentYear;
        });

        // Get unique working days (days when words were added)
        const workingDays = new Set(monthlyWords.map(word => word.learnedDate));
        const workingDaysCount = workingDays.size;

        const totalWords = monthlyWords.length;
        const totalSentences = monthlyWords.reduce((total, word) => {
          return total + (word.sentences ? word.sentences.length : 0);
        }, 0);

        const averageWordsPerDay = workingDaysCount > 0 ? totalWords / workingDaysCount : 0;
        const averageSentencesPerDay = workingDaysCount > 0 ? totalSentences / workingDaysCount : 0;

        setMonthlyStats({
          totalWords,
          totalSentences,
          workingDays: workingDaysCount,
          averageWordsPerDay: Math.round(averageWordsPerDay * 10) / 10,
          averageSentencesPerDay: Math.round(averageSentencesPerDay * 10) / 10
        });

      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedDate, refreshTrigger]);

  if (!selectedDate) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-indigo-100 dark:border-gray-700 p-4">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>İstatistikleri görmek için</p>
          <p>bir tarih seçin</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-indigo-100 dark:border-gray-700 p-4">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50 animate-pulse" />
          <p>İstatistikler yükleniyor...</p>
        </div>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-indigo-100 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
            İstatistikler
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(selectedDate)}
        </p>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {/* Daily Stats */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-medium text-indigo-900 dark:text-indigo-100">
                Seçilen Gün
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Kelimeler</span>
                </div>
                <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {dailyStats.wordCount}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cümleler</span>
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {dailyStats.sentenceCount}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h4 className="font-medium text-green-900 dark:text-green-100">
                Bu Ay Ortalaması
              </h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Çalışılan Gün:</span>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100">
                  {monthlyStats.workingDays} gün
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Kelime:</span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  {monthlyStats.totalWords}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Cümle:</span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  {monthlyStats.totalSentences}
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Günlük Ort. Kelime:</span>
                  <span className="font-bold text-green-900 dark:text-green-100">
                    {monthlyStats.averageWordsPerDay}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Günlük Ort. Cümle:</span>
                  <span className="font-bold text-green-900 dark:text-green-100">
                    {monthlyStats.averageSentencesPerDay}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          {monthlyStats.workingDays >= 20 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  Başarı Rozeti
                </h4>
              </div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                🏆 Bu ay {monthlyStats.workingDays} gün çalıştınız! Harika bir performans!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
