package com.example.demo.Serivce;

import com.example.demo.Entities.*;
import com.example.demo.Repository.UserRepository;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setNom(request.nom);
        user.setPrenom(request.prenom);
        user.setEmail(request.email);
        user.setMotDePasse(passwordEncoder.encode(request.motDePasse));
        user.setRole(Role.CANDIDAT);
        userRepo.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse authenticate(LoginRequest request) {
        User user = userRepo.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(request.motDePasse, user.getMotDePasse())) {
            throw new RuntimeException("Mot de passe invalide");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }
}
