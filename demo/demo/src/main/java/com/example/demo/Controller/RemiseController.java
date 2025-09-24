package com.example.demo.Controller;

import com.example.demo.Entities.Remise;
import com.example.demo.Entities.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Serivce.RemiseService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/remises")
@CrossOrigin(origins = "*")
public class RemiseController {

    @Autowired
    private RemiseService remiseService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/task/{taskId}")
    public ResponseEntity<?> soumettreRemise(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long taskId,
            @RequestParam String contenu) {

        try {
            // Extraire l'email du JWT
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);

            // Trouver le candidat par email
            User candidat = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Soumettre la remise
            remiseService.soumettreRemise(taskId, candidat.getId(), contenu);

            // Retour succès
            return ResponseEntity.ok(Map.of("message", "Remise soumise avec succès ✅"));

        } catch (RuntimeException ex) {
            // Retour erreur avec message spécifique
            return ResponseEntity.status(400).body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/myremises")
    public List<Remise> getMyRemises(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User candidat = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return remiseService.getRemisesByCandidat(candidat.getId());
    }

    @GetMapping("/task/{taskId}")
    public List<Remise> getRemises(@RequestHeader("Authorization") String authHeader,
                                   @PathVariable Long taskId) {
        return remiseService.getRemisesByTask(taskId);
    }

    /*Bonjour encadrant Encadrant, Un compte encadrant vient d'être créé pour vous sur la plateforme. Identifiant : uncomfortable.swallow.qnxf@rapidletter.net Mot de passe : LfYINrSIJB Vous pouvez vous connecter et le modifier après connexion. Cordialement, L'équipe plateforme.*/
}
