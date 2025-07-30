package com.example.demo.Repository;

import com.example.demo.Entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByOffreIdAndCandidatureIsNull(Long offreId); // pour modèle

    List<Question> findByOffreIdAndCandidatureId(Long offreId, Long candidatureId); // réponses d’un candidat
}
