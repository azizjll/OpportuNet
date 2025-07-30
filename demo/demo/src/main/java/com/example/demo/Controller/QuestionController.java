package com.example.demo.Controller;

import com.example.demo.Entities.Candidature;
import com.example.demo.Entities.OffreStage;
import com.example.demo.Entities.Question;
import com.example.demo.Repository.QuestionRepository;
import com.example.demo.Serivce.CandidatureService;
import com.example.demo.Serivce.OffreStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/question")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    public QuestionRepository questionRepository;

    @Autowired
    public OffreStageService offreStageService;

    @Autowired
    public CandidatureService candidatureService;


    @PostMapping("/offres/{offreId}/questions")
    @PreAuthorize("hasRole('ORGANISATION')")
    public ResponseEntity<?> ajouterQuestions(
            @PathVariable Long offreId,
            @RequestBody List<Question> questions) {
        OffreStage offre = offreStageService.getOffreById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        for (Question q : questions) {
            q.setOffre(offre);
            questionRepository.save(q);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Questions ajoutées avec succès");

        return ResponseEntity.ok(response);
    }


    @GetMapping("/offres/{offreId}/questions")
    @PreAuthorize("hasRole('CANDIDAT')")
    public List<Question> getQuestionsPourOffre(@PathVariable Long offreId) {
        return questionRepository.findByOffreIdAndCandidatureIsNull(offreId);
    }

    @PostMapping("/candidatures/{candidatureId}/reponses")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<?> soumettreReponses(
            @PathVariable Long candidatureId,
            @RequestBody List<Question> reponses) {

        Candidature candidature = candidatureService.getCandidatureById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        for (Question rep : reponses) {
            Question original = questionRepository.findById(rep.getId())
                    .orElseThrow(() -> new RuntimeException("Question non trouvée"));

            original.setReponse(rep.getReponse());
            original.setCandidature(candidature);
            original.setOffre(candidature.getOffre());

            questionRepository.save(original);
        }

        return ResponseEntity.ok("Réponses enregistrées avec succès.");
    }


    @GetMapping("/offres/{offreId}/candidatures/{candidatureId}/reponses")
    @PreAuthorize("hasAnyRole('ORGANISATION', 'ADMIN')")
    public List<Question> getReponsesPourOffreEtCandidature(
            @PathVariable Long offreId,
            @PathVariable Long candidatureId) {
        return questionRepository.findByOffreIdAndCandidatureId(offreId, candidatureId);
    }



}
