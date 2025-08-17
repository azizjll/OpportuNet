package com.example.demo.Controller;


import com.example.demo.Entities.RendezVous;
import com.example.demo.Entities.User;
import com.example.demo.Serivce.RendezVousService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rendezvous")
public class RendezVousController {

    private final RendezVousService rendezVousService;
    private final JwtService jwtService;
    private final UserService userService;

    public RendezVousController(RendezVousService rendezVousService,
                                JwtService jwtService,
                                UserService userService) {
        this.rendezVousService = rendezVousService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    // 📌 Récupérer tous les rendez-vous de l'utilisateur connecté
    @GetMapping
    public List<RendezVous> getAllRendezVous(@RequestHeader("Authorization") String authHeader) {
        User user = getAuthenticatedUser(authHeader);
        return rendezVousService.getRendezVousByUser(user);
    }

    // 📌 Créer un rendez-vous pour l'utilisateur connecté
    @PostMapping
    public RendezVous createRendezVous(@RequestHeader("Authorization") String authHeader,
                                       @RequestBody RendezVous rendezVous) {
        User user = getAuthenticatedUser(authHeader);
        rendezVous.setUser(user); // Lier le rendez-vous à l'utilisateur connecté
        return rendezVousService.createRendezVous(rendezVous);
    }

    // 📌 Modifier un rendez-vous (seulement si c'est le tien)
    @PutMapping("/{id}")
    public ResponseEntity<RendezVous> updateRendezVous(@RequestHeader("Authorization") String authHeader,
                                                       @PathVariable Long id,
                                                       @RequestBody RendezVous rendezVous) {
        User user = getAuthenticatedUser(authHeader);
        return rendezVousService.updateRendezVousForUser(id, rendezVous, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build()); // 403 si pas autorisé
    }

    // 📌 Supprimer un rendez-vous (seulement si c'est le tien)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@RequestHeader("Authorization") String authHeader,
                                                 @PathVariable Long id) {
        User user = getAuthenticatedUser(authHeader);
        if (rendezVousService.deleteRendezVousForUser(id, user)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    // Méthode utilitaire pour extraire l'utilisateur connecté depuis le JWT
    private User getAuthenticatedUser(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        return userService.getUserByEmail(email);
    }
}
