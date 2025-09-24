package com.example.demo.Serivce;

import com.example.demo.Entities.*;
import com.example.demo.Repository.UserRepository;
import com.example.demo.ServiceAvancé.EmailService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public AuthResponse register(RegisterRequest request) {

        // Vérifier si l'email existe déjà
        if (userRepo.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("Un compte avec cet email existe déjà.");
        }


        User user = new User();
        user.setNom(request.nom);
        user.setPrenom(request.prenom);
        user.setEmail(request.email);
        user.setMotDePasse(passwordEncoder.encode(request.motDePasse));
        user.setRole(request.role != null ? request.role : Role.CANDIDAT);
        user.setIsPayment(false);
        user.setVerified(false);
        user.setAccepted(false);

        // Générer un token de vérification
        String verificationToken = java.util.UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);

        userRepo.save(user);

        // Envoyer l'email
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        return new AuthResponse("Un email de vérification a été envoyé à " + user.getEmail());
    }

    public AuthResponse authenticate(LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email invalide ou inexistant"));

        if (!user.getVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Veuillez vérifier votre email.");
        }

        if (!user.getAccepted()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Votre compte n'est pas encore accepté par un administrateur.");
        }

        if (!passwordEncoder.matches(request.getMotDePasse(), user.getMotDePasse())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe invalide");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }


    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
        StringBuilder sb = new StringBuilder();
        java.security.SecureRandom random = new java.security.SecureRandom();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public AuthResponse signupEncadrant(String nom, String prenom, String email) {
        // Vérifier si l'email existe déjà
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Un compte avec cet email existe déjà.");
        }

        // Générer mot de passe aléatoire
        String rawPassword = generateRandomPassword(10);

        User encadrant = new User();
        encadrant.setNom(nom);
        encadrant.setPrenom(prenom);
        encadrant.setEmail(email);
        encadrant.setMotDePasse(passwordEncoder.encode(rawPassword));
        encadrant.setRole(Role.ENCADRANT);
        encadrant.setIsPayment(false);
        encadrant.setVerified(true);   // On considère l'encadrant directement validé
        encadrant.setAccepted(true);   // Et accepté par l'admin par défaut

        userRepo.save(encadrant);

        // Envoyer email avec mot de passe
        String subject = "Votre compte encadrant a été créé";
        String body = "Bonjour " + prenom + " " + nom + ",\n\n" +
                "Un compte encadrant vient d'être créé pour vous sur la plateforme.\n" +
                "Identifiant : " + email + "\n" +
                "Mot de passe : " + rawPassword + "\n\n" +
                "Vous pouvez vous connecter et le modifier après connexion.\n\n" +
                "Cordialement,\nL'équipe plateforme.";

        emailService.sendSimpleMessage(email, subject, body);

        return new AuthResponse("Compte encadrant créé et email envoyé à " + email);
    }



}
