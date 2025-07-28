package com.example.demo.Controller;



import com.example.demo.Entities.Candidature;
import com.example.demo.Entities.OffreStage;
import com.example.demo.Entities.Role;
import com.example.demo.Entities.User;
import com.example.demo.Serivce.CandidatureService;
import com.example.demo.Serivce.OffreStageService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@CrossOrigin(origins = "*")
public class CandidatureController {

    @Autowired
    private CandidatureService candidatureService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private OffreStageService offreStageService;

    private static final Logger logger = LoggerFactory.getLogger(CandidatureController.class);


    // ✅ Postuler à une offre
    @PreAuthorize("hasRole('CANDIDAT')")
    @PostMapping("/{offreId}")
    public ResponseEntity<?> postuler(@RequestHeader("Authorization") String authHeader,
                                      @PathVariable Long offreId,
                                      @RequestBody Candidature candidature) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("Token manquant ou mal formaté");
                return ResponseEntity.status(401).body("Token JWT manquant ou invalide.");
            }

            String token = authHeader.replace("Bearer ", "");
            logger.info("Received token: {}", token);

            String email = jwtService.extractEmail(token);
            logger.info("Extracted email from token: {}", email);

            User candidat = userService.getUserByEmail(email);
            if (candidat == null) {
                logger.warn("Aucun utilisateur trouvé avec l'email: {}", email);
                return ResponseEntity.status(404).body("Utilisateur non trouvé.");
            }

            OffreStage offre = offreStageService.getOffreById(offreId)
                    .orElse(null);

            if (offre == null) {
                logger.warn("Offre avec ID {} non trouvée", offreId);
                return ResponseEntity.status(404).body("Offre non trouvée.");
            }

            // 💥 Vérification de doublon
            if (candidatureService.existeDeja(candidat, offre)) {
                logger.warn("Candidat {} a déjà postulé à l'offre {}", candidat.getEmail(), offre.getTitre());
                return ResponseEntity.status(400).body("Vous avez déjà postulé à cette offre.");
            }

            candidature.setUser(candidat);
            candidature.setOffre(offre);

            Candidature saved = candidatureService.postuler(candidature);
            logger.info("Candidature enregistrée avec ID {}", saved.getId());

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            logger.error("Erreur lors de la candidature : {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Erreur interne du serveur : " + e.getMessage());
        }
    }




    // ✅ Voir mes candidatures
    @PreAuthorize("hasRole('CANDIDAT')")
    @GetMapping("/mes")
    public List<Candidature> getMesCandidatures(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User candidat = userService.getUserByEmail(email);

        return candidatureService.getCandidaturesByUser(candidat);
    }

    // ✅ Voir toutes les candidatures (ADMIN ou ORGANISATION)
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION')")
    @GetMapping
    public List<Candidature> getAllCandidatures() {
        return candidatureService.getAllCandidatures();
    }

    // ✅ (optionnel) Voir les candidatures d’une offre précise
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANISATION')")
    @GetMapping("/offre/{offreId}")
    public List<Candidature> getCandidaturesByOffre(@PathVariable Long offreId) {
        OffreStage offre = offreStageService.getOffreById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        return candidatureService.getCandidaturesByOffre(offre);
    }



    @PreAuthorize("hasRole('ORGANISATION')")
    @GetMapping("/mes-offres")
    public ResponseEntity<?> getCandidaturesDeMesOffres(@RequestHeader("Authorization") String authHeader) {
        Logger logger = LoggerFactory.getLogger(getClass());

        try {
            logger.info("Requête reçue pour récupérer les candidatures de l'organisation via l'en-tête Authorization.");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("Token JWT manquant ou mal formé : {}", authHeader);
                return ResponseEntity.status(401).body("Token JWT manquant ou invalide.");
            }

            String token = authHeader.replace("Bearer ", "");
            logger.info("Token extrait avec succès.");

            String email = jwtService.extractEmail(token);
            logger.info("Email extrait du token : {}", email);

            User organisation = userService.getUserByEmail(email);

            if (organisation == null) {
                logger.warn("Aucun utilisateur trouvé avec l'email : {}", email);
                return ResponseEntity.status(404).body("Utilisateur introuvable.");
            }

            logger.info("Utilisateur récupéré : {} avec rôle {}", organisation.getEmail(), organisation.getRole());

            if (organisation.getRole() != Role.ORGANISATION) {
                logger.warn("Accès refusé : rôle actuel = {}", organisation.getRole());
                return ResponseEntity.status(403).body("Accès refusé. Vous devez être une organisation.");
            }


            List<Candidature> candidatures = candidatureService.getCandidaturesDeMesOffres(organisation);
            logger.info("Nombre de candidatures récupérées : {}", candidatures.size());

            return ResponseEntity.ok(candidatures);

        } catch (Exception e) {
            logger.error("Erreur interne lors de la récupération des candidatures : {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Erreur interne : " + e.getMessage());
        }
    }


}
