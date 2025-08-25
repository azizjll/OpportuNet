package com.example.demo.Controller;


import com.example.demo.Entities.User;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // Récupérer tous les utilisateurs (ADMIN uniquement)
    @GetMapping("/all")
    public List<User> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.getAllUsers();
    }

    // Accepter un utilisateur
    @PutMapping("/{id}/accept")
    public User acceptUser(@RequestHeader("Authorization") String authHeader,
                           @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.acceptUser(id);
    }

    // Vérifier un utilisateur
    @PutMapping("/{id}/verify")
    public User verifyUser(@RequestHeader("Authorization") String authHeader,
                           @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.verifyUser(id);
    }

    // Bloquer un utilisateur
    @PutMapping("/{id}/block")
    public User blockUser(@RequestHeader("Authorization") String authHeader,
                          @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.blockUser(id);
    }

    // Endpoint pour mettre à jour l'image
    @PostMapping("/{id}/upload-image")
    public User uploadUserImage(@PathVariable Long id,
                                @RequestParam("file") MultipartFile file,
                                @RequestHeader("Authorization") String authHeader) {
        // Tu peux ajouter ici une vérification avec JwtService si besoin
        return userService.updateUserImage(id, file);
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@RequestHeader("Authorization") String authHeader,
                           @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        userService.deleteUser(id);
    }
}
