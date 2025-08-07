package com.example.demo.Controller;



import com.example.demo.Entities.*;
import com.example.demo.Repository.CandidatureRepository;
import com.example.demo.Repository.OffreStageRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Serivce.CandidatureService;
import com.example.demo.Serivce.OffreStageService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    @Autowired
    private CandidatureRepository candidatureRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OffreStageRepository offreStageRepository;


    // ✅ Postuler à une offre
    @PreAuthorize("hasRole('CANDIDAT')")
    @PostMapping(value = "/{offreId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postuler(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long offreId,
            @RequestParam("cv") MultipartFile cv,
            @RequestParam("lettreMotivation") String lettreMotivation,
            @RequestParam(value = "remarque", required = false) String remarque,
            @RequestParam("statut") String statutStr) {

        try {
            String uploadsDirPath = System.getProperty("user.dir") + "/uploads";
            File uploadDir = new File(uploadsDirPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String nomFichier = System.currentTimeMillis() + "_" + cv.getOriginalFilename();
            String cheminComplet = uploadsDirPath + "/" + nomFichier;
            cv.transferTo(new File(cheminComplet));

            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            OffreStage offre = offreStageRepository.findById(offreId)
                    .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

            if (candidatureRepository.existsByUserAndOffre(user, offre)) {
                return ResponseEntity.status(400).body(Map.of("message", "Vous avez déjà postulé à cette offre."));
            }


            Candidature candidature = new Candidature();
            candidature.setCv(cheminComplet);
            candidature.setLettreMotivation(lettreMotivation);
            candidature.setRemarque(remarque);
            candidature.setStatut(StatutCandidature.valueOf(statutStr));
            candidature.setOffre(offre);
            candidature.setUser(user);

            candidatureRepository.save(candidature);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Candidature envoyée avec succès");
            response.put("id", candidature.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/existe/{offreId}")
    public ResponseEntity<Boolean> checkCandidatureExiste(@PathVariable Long offreId, @AuthenticationPrincipal User user) {
        boolean existe = candidatureService.aDejaPostule(offreId, user.getId());
        return ResponseEntity.ok(existe);
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

    @PutMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Candidature> optional = candidatureRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Candidature candidature = optional.get();
        try {
            StatutCandidature nouveauStatut = StatutCandidature.valueOf(request.get("statut"));
            candidature.setStatut(nouveauStatut);
            candidatureRepository.save(candidature);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Statut invalide");
        }
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
