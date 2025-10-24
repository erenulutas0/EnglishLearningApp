package com.ingilizce.calismaapp.repository;

import com.ingilizce.calismaapp.entity.Sentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SentenceRepository extends JpaRepository<Sentence, Long> {
    
    List<Sentence> findByWordId(Long wordId);
    
    void deleteByWordId(Long wordId);
}
