package com.example.demo.Serivce;


import com.example.demo.Entities.Entretien;
import com.example.demo.Entities.User;
import com.example.demo.Repository.EntretienRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EntretienService {

    @Autowired
    private EntretienRepository entretienRepository;

    @Autowired
    private UserRepository userRepository;

    // Créer ou mettre à jour un entretien pour un utilisateur
    public Entretien fixerEntretien(Long userId, String description, LocalDateTime date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Entretien entretien = entretienRepository.findByUser(user)
                .orElse(new Entretien());

        entretien.setUser(user);
        entretien.setDescription(description);
        entretien.setDateEntretien(date);

        return entretienRepository.save(entretien);
    }

    public List<Entretien> getAllEntretiens() {
        return entretienRepository.findAll();
    }

    public Entretien getEntretienByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return entretienRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Entretien non trouvé pour cet utilisateur"));
    }

    public void deleteEntretien(Long id) {
        entretienRepository.deleteById(id);
    }
}
