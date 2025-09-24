package com.example.demo.Controller;

import com.example.demo.Entities.AuthResponse;
import com.example.demo.Entities.LoginRequest;
import com.example.demo.Entities.RegisterRequest;
import com.example.demo.Entities.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Serivce.AuthService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;


    @PostMapping("/signup")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/signin")
    public AuthResponse authenticate(@RequestBody LoginRequest request) {
        return authService.authenticate(request);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        Optional<User> optionalUser = userRepo.findByVerificationToken(token);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Token invalide");
        }

        User user = optionalUser.get();
        user.setVerified(true);
        user.setVerificationToken(null); // Supprimer le token une fois vérifié
        userRepo.save(user);

        return ResponseEntity.ok("Compte vérifié avec succès. En attente d'acceptation.");
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Invalider le contexte de sécurité (géré par SecurityConfig, ici pour confirmation)
        SecurityContextHolder.clearContext();
        // Optionnel : Si vous gérez une liste de tokens révoqués, ajoutez la logique ici
        return ResponseEntity.ok("Déconnexion réussie");
    }


    @PutMapping("/user/{id}/payment")
    public ResponseEntity<String> setPayment(@PathVariable Long id, @RequestParam boolean payment) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setIsPayment(payment);
        userRepo.save(user);
        return ResponseEntity.ok("Statut paiement mis à jour !");
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token); // <-- UTILISER EMAIL
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(user);
    }


    @PostMapping("/signup-encadrant")
    public AuthResponse signupEncadrant(@RequestParam String nom,
                                        @RequestParam String prenom,
                                        @RequestParam String email) {
        return authService.signupEncadrant(nom, prenom, email);
    }








}
