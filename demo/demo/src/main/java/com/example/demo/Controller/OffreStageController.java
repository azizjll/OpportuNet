package com.example.demo.Controller;

import com.example.demo.Entities.OffreStage;
import com.example.demo.Entities.User;
import com.example.demo.Serivce.OffreStageService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offres")
@CrossOrigin(origins = "*") // Si besoin de CORS
public class OffreStageController {

    @Autowired
    private OffreStageService offreStageService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    // ✅ Créer une offre avec authentification
    @PreAuthorize("hasRole('ORGANISATION')")
    @PostMapping
    public OffreStage createOffre(@RequestHeader("Authorization") String authHeader,
                                  @RequestBody OffreStage offre) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);

        offre.setCreateur(user);
        return offreStageService.createOffre(offre);
    }

    // ✅ Liste des offres créées par l'utilisateur connecté
    @PreAuthorize("hasRole('ORGANISATION')")
    @GetMapping("/mesOffres")
    public List<OffreStage> getMyOffres(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);

        return offreStageService.getOffresByCreateur(user);
    }

    // ✅ Tous les utilisateurs peuvent consulter toutes les offres
    @GetMapping
    public List<OffreStage> getAllOffres() {
        return offreStageService.getAllOffres();
    }

    @GetMapping("/{id}")
    public Optional<OffreStage> getOffreById(@PathVariable Long id) {
        return offreStageService.getOffreById(id);
    }

    // ⚠️ Tu peux sécuriser ceci aussi si tu veux restreindre
    @PreAuthorize("hasRole('ORGANISATION')")
    @PutMapping("/{id}")
    public OffreStage updateOffre(@PathVariable Long id, @RequestBody OffreStage newOffre) {
        return offreStageService.updateOffre(id, newOffre);
    }

    @PreAuthorize("hasRole('ORGANISATION')")
    @DeleteMapping("/{id}")
    public void deleteOffre(@PathVariable Long id) {
        offreStageService.deleteOffre(id);
    }
}
