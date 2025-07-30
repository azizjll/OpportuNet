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

}
