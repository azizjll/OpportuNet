package com.example.demo.Serivce;


import com.example.demo.Entities.OffreStage;
import com.example.demo.Entities.Role;
import com.example.demo.Entities.User;
import com.example.demo.Repository.OffreStageRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OffreStageService {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OffreStageRepository offreStageRepository;

    public OffreStage createOffre(OffreStage offre) {
        return offreStageRepository.save(offre);
    }

    public List<OffreStage> getAllOffres() {
        return offreStageRepository.findAll();
    }

    public Optional<OffreStage> getOffreById(Long id) {
        return offreStageRepository.findById(id);
    }

    public OffreStage updateOffre(Long id, OffreStage newOffre) {
        return offreStageRepository.findById(id).map(offre -> {
            offre.setTitre(newOffre.getTitre());
            offre.setDescription(newOffre.getDescription());
            offre.setType(newOffre.getType());
            offre.setDateDebut(newOffre.getDateDebut());
            offre.setDateFin(newOffre.getDateFin());
            offre.setEtat(newOffre.getEtat());
            return offreStageRepository.save(offre);
        }).orElseThrow(() -> new RuntimeException("Offre non trouvée"));
    }

    public void deleteOffre(Long id) {
        offreStageRepository.deleteById(id);
    }

    public List<OffreStage> getOffresByCreateur(User user) {
        return offreStageRepository.findByCreateur(user);
    }

    public OffreStage affecterEncadrant(Long offreId, String nom, String prenom, String email) {
        // 1. Récupérer l'offre
        OffreStage offre = offreStageRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // 2. Vérifier si l'encadrant existe déjà
        User encadrant = userRepo.findByEmail(email).orElse(null);

        if (encadrant == null) {
            // ⚡ Passer par signupEncadrant pour générer mot de passe et envoyer email
            authService.signupEncadrant(nom, prenom, email);
            encadrant = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Erreur lors de la création de l'encadrant"));
        }

        // 3. Affecter encadrant à l’offre
        offre.setEncadrant(encadrant);

        // 4. Sauvegarder l’offre
        return offreStageRepository.save(offre);
    }


}
