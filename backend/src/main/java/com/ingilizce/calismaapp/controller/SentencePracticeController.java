package com.ingilizce.calismaapp.controller;

import com.ingilizce.calismaapp.entity.SentencePractice;
import com.ingilizce.calismaapp.entity.Sentence;
import com.ingilizce.calismaapp.service.SentencePracticeService;
import com.ingilizce.calismaapp.repository.SentenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/sentences")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SentencePracticeController {
    
    @Autowired
    private SentencePracticeService sentencePracticeService;
    
    @Autowired
    private SentenceRepository sentenceRepository;
    
    // Get all sentences from both tables
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSentences() {
        List<Map<String, Object>> allSentences = new ArrayList<>();
        
        // Get sentences from sentence_practices table
        List<SentencePractice> practiceSentences = sentencePracticeService.getAllSentences();
        for (SentencePractice sp : practiceSentences) {
            Map<String, Object> sentenceMap = new HashMap<>();
            sentenceMap.put("id", "practice_" + sp.getId());
            sentenceMap.put("englishSentence", sp.getEnglishSentence());
            sentenceMap.put("turkishTranslation", sp.getTurkishTranslation());
            sentenceMap.put("difficulty", sp.getDifficulty());
            sentenceMap.put("createdDate", sp.getCreatedDate());
            sentenceMap.put("source", "practice");
            allSentences.add(sentenceMap);
        }
        
        // Get sentences from sentences table
        List<Sentence> wordSentences = sentenceRepository.findAll();
        for (Sentence s : wordSentences) {
            Map<String, Object> sentenceMap = new HashMap<>();
            sentenceMap.put("id", "word_" + s.getId());
            sentenceMap.put("englishSentence", s.getSentence()); // Using 'sentence' column from sentences table
            sentenceMap.put("turkishTranslation", s.getTranslation());
            sentenceMap.put("difficulty", "EASY"); // Default difficulty for word sentences
            sentenceMap.put("createdDate", null);
            sentenceMap.put("source", "word");
            allSentences.add(sentenceMap);
        }
        
        return ResponseEntity.ok(allSentences);
    }
    
    // Get sentence by ID
    @GetMapping("/{id}")
    public ResponseEntity<SentencePractice> getSentenceById(@PathVariable Long id) {
        Optional<SentencePractice> sentence = sentencePracticeService.getSentenceById(id);
        return sentence.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    // Create a new sentence
    @PostMapping
    public ResponseEntity<SentencePractice> createSentence(@RequestBody SentencePractice sentencePractice) {
        SentencePractice savedSentence = sentencePracticeService.saveSentence(sentencePractice);
        return ResponseEntity.ok(savedSentence);
    }
    
    // Update an existing sentence
    @PutMapping("/{id}")
    public ResponseEntity<SentencePractice> updateSentence(@PathVariable Long id, @RequestBody SentencePractice sentencePractice) {
        SentencePractice updatedSentence = sentencePracticeService.updateSentence(id, sentencePractice);
        if (updatedSentence != null) {
            return ResponseEntity.ok(updatedSentence);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Delete a sentence
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSentence(@PathVariable Long id) {
        boolean deleted = sentencePracticeService.deleteSentence(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Get sentences by difficulty
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<SentencePractice>> getSentencesByDifficulty(@PathVariable String difficulty) {
        try {
            SentencePractice.DifficultyLevel difficultyLevel = SentencePractice.DifficultyLevel.valueOf(difficulty.toUpperCase());
            List<SentencePractice> sentences = sentencePracticeService.getSentencesByDifficulty(difficultyLevel);
            return ResponseEntity.ok(sentences);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get sentences by date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<SentencePractice>> getSentencesByDate(@PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<SentencePractice> sentences = sentencePracticeService.getSentencesByDate(localDate);
            return ResponseEntity.ok(sentences);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get all distinct dates
    @GetMapping("/dates")
    public ResponseEntity<List<LocalDate>> getAllDistinctDates() {
        List<LocalDate> dates = sentencePracticeService.getAllDistinctDates();
        return ResponseEntity.ok(dates);
    }
    
    // Get sentences by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<SentencePractice>> getSentencesByDateRange(
            @RequestParam String startDate, 
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            List<SentencePractice> sentences = sentencePracticeService.getSentencesByDateRange(start, end);
            return ResponseEntity.ok(sentences);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Get statistics from both tables
    @GetMapping("/stats")
    public ResponseEntity<Object> getStatistics() {
        // Count from sentence_practices table
        long practiceTotal = sentencePracticeService.getTotalSentenceCount();
        long practiceEasy = sentencePracticeService.getSentenceCountByDifficulty(SentencePractice.DifficultyLevel.EASY);
        long practiceMedium = sentencePracticeService.getSentenceCountByDifficulty(SentencePractice.DifficultyLevel.MEDIUM);
        long practiceHard = sentencePracticeService.getSentenceCountByDifficulty(SentencePractice.DifficultyLevel.HARD);
        
        // Count from sentences table (all are considered EASY)
        long wordTotal = sentenceRepository.count();
        
        // Combine statistics
        long totalCount = practiceTotal + wordTotal;
        long easyCount = practiceEasy + wordTotal; // All word sentences are EASY
        long mediumCount = practiceMedium;
        long hardCount = practiceHard;
        
        return ResponseEntity.ok(new Object() {
            public final long total = totalCount;
            public final long easy = easyCount;
            public final long medium = mediumCount;
            public final long hard = hardCount;
        });
    }
}


