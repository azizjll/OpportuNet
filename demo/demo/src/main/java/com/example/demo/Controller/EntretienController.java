package com.example.demo.Controller;


import com.example.demo.Entities.Entretien;
import com.example.demo.Entities.User;
import com.example.demo.Serivce.EntretienService;
import com.example.demo.ServiceAvancé.EmailService;
import com.example.demo.ServiceAvancé.JwtService;
import com.example.demo.Serivce.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/entretiens")
@CrossOrigin(origins = "*")
public class EntretienController {

    @Autowired
    private EntretienService entretienService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    // Créer / Mettre à jour un entretien pour l'utilisateur connecté
    @PreAuthorize("hasAnyRole('CANDIDAT','ORGANISATION','ADMIN')")
    @PostMapping("/fixer")
    public ResponseEntity<Entretien> fixerEntretien(@RequestHeader("Authorization") String authHeader,
                                                    @RequestParam String description,
                                                    @RequestParam String date) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);

        LocalDateTime dateEntretien = LocalDateTime.parse(date);

        // ✅ Utiliser la méthode existante du service
        Entretien entretien = entretienService.fixerEntretien(user.getId(), description, dateEntretien);

        // ✅ Envoyer l'email
        emailService.sendSimpleMessage(
                entretien.getUser().getEmail(),
                "Entretien fixé",
                "Bonjour " + entretien.getUser().getNom() +
                        ", votre entretien est fixé le " + entretien.getDateEntretien() +
                        ". Description : " + entretien.getDescription()
        );

        return ResponseEntity.ok(entretien);
    }

    // Liste de tous les entretiens
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Entretien> getAllEntretiens() {
        return entretienService.getAllEntretiens();
    }

    // Obtenir entretien de l'utilisateur connecté
    @PreAuthorize("hasAnyRole('CANDIDAT','ORGANISATION','ADMIN')")
    @GetMapping("/mon-entretien")
    public Entretien getMonEntretien(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);

        return entretienService.getEntretienByUser(user.getId());
    }

    // Supprimer un entretien (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteEntretien(@PathVariable Long id) {
        entretienService.deleteEntretien(id);
    }
}
