package com.example.demo.Controller;


import com.example.demo.Entities.Experience;
import com.example.demo.Entities.ParcoursAcademique;
import com.example.demo.Entities.User;
import com.example.demo.Serivce.ExperienceService;
import com.example.demo.Serivce.ParcoursAcademiqueService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ExperienceService experienceService;

    @Autowired
    private ParcoursAcademiqueService parcoursService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;


    // Ajouter une expérience
    @PostMapping("/{userId}/experience")
    public Experience addExperience(@PathVariable Long userId, @RequestBody Experience experience) {
        return experienceService.addExperience(userId, experience);
    }

    // Liste des expériences
    @GetMapping("/{userId}/experience")
    public List<Experience> getExperiences(@PathVariable Long userId) {
        return experienceService.getExperiencesByUser(userId);
    }

    // Ajouter un parcours académique
    @PostMapping("/{userId}/parcours")
    public ParcoursAcademique addParcours(@PathVariable Long userId, @RequestBody ParcoursAcademique parcours) {
        return parcoursService.addParcours(userId, parcours);
    }

    // Liste des parcours
    @GetMapping("/{userId}/parcours")
    public List<ParcoursAcademique> getParcours(@PathVariable Long userId) {
        return parcoursService.getParcoursByUser(userId);
    }

    /*@GetMapping("/{userId}")
    public User getUserProfile(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }*/

    @GetMapping("/me")
    public User getUserProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", ""); // Nettoyage
        String email = jwtService.extractEmail(token);
        return userService.getUserByEmail(email);
    }

    @GetMapping("/experience")
    public List<Experience> getExperiences(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);
        return experienceService.getExperiencesByUser(user.getId());
    }

    @GetMapping("/parcours")
    public List<ParcoursAcademique> getParcours(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);
        return parcoursService.getParcoursByUser(user.getId());

    }

    @PostMapping("/experience")
    public Experience addExperience(@RequestHeader("Authorization") String authHeader,
                                    @RequestBody Experience experience) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);
        return experienceService.addExperience(user.getId(), experience);
    }

    @PostMapping("/parcours")
    public ParcoursAcademique addParcours(@RequestHeader("Authorization") String authHeader,
                                          @RequestBody ParcoursAcademique parcours) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);
        return parcoursService.addParcours(user.getId(), parcours);
    }

    @PutMapping("/me")
    public User updateUserProfile(@RequestHeader("Authorization") String authHeader,
                                  @RequestBody User updatedUser) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        return userService.updateUserProfile(email, updatedUser);
    }

    @PutMapping("/experience/{id}")
    public Experience updateExperience(@PathVariable Long id,
                                       @RequestBody Experience updatedExperience) {
        return experienceService.updateExperience(id, updatedExperience);
    }

    @PutMapping("/parcours/{id}")
    public ParcoursAcademique updateParcours(@PathVariable Long id,
                                             @RequestBody ParcoursAcademique updatedParcours) {
        return parcoursService.updateParcours(id, updatedParcours);
    }



    @PostMapping("/upload-photo")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> uploadPhoto(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("photo") MultipartFile file) {

        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);
            User user = userService.getUserByEmail(email);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Fichier vide");
            }

            // Exemple : enregistrer dans un dossier local
            String uploadDir = "uploads/";
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            String fileName = user.getId() + "_" + file.getOriginalFilename();
            File dest = new File(uploadDir + fileName);
            file.transferTo(dest);

            // Sauvegarder le chemin dans la base
            user.setImageUrl("/uploads/" + fileName);
            userService.save(user);

            return ResponseEntity.ok("Image uploadée avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload : " + e.getMessage());
        }
    }





}
