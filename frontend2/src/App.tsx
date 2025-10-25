import React, { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { WordsPage } from "./components/WordsPage";
import { SentencesPage } from "./components/SentencesPage";
import { GeneratePage } from "./components/GeneratePage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "words" | "sentences" | "generate">("home");
  useEffect(() => {
    // Always use dark mode
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
      />
      
      {currentPage === "home" && (
        <HomePage onNavigate={setCurrentPage} />
      )}
      
      {currentPage === "words" && <WordsPage />}
      
      {currentPage === "sentences" && <SentencesPage />}
      
      {currentPage === "generate" && <GeneratePage />}
      
      <Toaster />
    </div>
  );
}