import { Home, BookOpen, FileText, Wand2, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  currentPage: "home" | "words" | "sentences" | "generate";
  onPageChange: (page: "home" | "words" | "sentences" | "generate") => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function Navigation({ currentPage, onPageChange, isDarkMode, onToggleTheme }: NavigationProps) {
  const navItems = [
    { id: "home" as const, label: "Anasayfa", icon: Home },
    { id: "words" as const, label: "Kelimeler", icon: BookOpen },
    { id: "sentences" as const, label: "Cümleler", icon: FileText },
    { id: "generate" as const, label: "Cümle Üret", icon: Wand2 },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-indigo-100 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-indigo-900 dark:text-indigo-100">VocabMaster</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-900 dark:hover:text-indigo-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="ml-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 flex-shrink-0"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}