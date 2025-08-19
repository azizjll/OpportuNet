package com.example.demo.Serivce;


import com.example.demo.Entities.User;
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
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    /*public User getUserById(Long id) {
        Optional<User> optionalUser = userRepo.findById(id);
        return optionalUser.orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }*/

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

        // Créer le répertoire s'il n'existe pas
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        try {
            // Nom de fichier unique
            String filename = userId + "_" + file.getOriginalFilename();
            Path filepath = Paths.get(uploadDir, filename);

            // Sauvegarde du fichier
            Files.write(filepath, file.getBytes());

            // Mettre à jour l'URL de l'image dans la base
            user.setImageUrl("/" + uploadDir + filename);  // chemin relatif
            return userRepo.save(user);

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'upload de l'image", e);
        }
    }






}
