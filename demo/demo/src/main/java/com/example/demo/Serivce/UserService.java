package com.example.demo.Serivce;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.Entities.Candidature;
import com.example.demo.Entities.StatutCandidature;
import com.example.demo.Entities.User;
import com.example.demo.Repository.CandidatureRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CandidatureRepository candidatureRepository;
    @Autowired
    private Cloudinary cloudinary;

    public List<User> getCandidatsEncadres(Long encadrantId) {
        return candidatureRepository.findByOffre_Encadrant_IdAndStatut(encadrantId, StatutCandidature.ACCEPTEE)
                .stream()
                .map(Candidature::getUser)
                .collect(Collectors.toList());
    }


    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
   

    public User updateUserProfile(String email, User updatedUser) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setNom(updatedUser.getNom());
        user.setPrenom(updatedUser.getPrenom());
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User acceptUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccepted(true);
        return userRepo.save(user);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id); // ← bien utiliser l’instance
    }

    public User verifyUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerified(true);
        return userRepo.save(user);
    }

    public User blockUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccepted(false);   // ou user.setVerified(false) si tu veux le bloquer aussi
        return userRepo.save(user);
    }

    private final String uploadDir = "uploads/profile-images/";

    public User updateUserImage(Long userId, MultipartFile file) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // Upload sur Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "profile-images"));

            // Récupérer l'URL de l'image
            String imageUrl = (String) uploadResult.get("secure_url");
            user.setImageUrl(imageUrl);

            return userRepo.save(user);

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'upload de l'image sur Cloudinary", e);
        }
    }
    @Autowired
    private UserRepository userRepository;

    public User save(User user) {
        return userRepository.save(user);
    }



    /*public User getUserById(Long id) {
        Optional<User> optionalUser = userRepo.findById(id);
        return optionalUser.orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }*/

}
