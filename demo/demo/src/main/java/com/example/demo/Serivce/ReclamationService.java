package com.example.demo.Serivce;

import com.example.demo.Entities.Reclamation;
import com.example.demo.Entities.StatutReclamation;
import com.example.demo.Entities.User;
import com.example.demo.Repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    public Reclamation creerReclamation(Reclamation reclamation, User user) {
        reclamation.setUser(user);
        reclamation.setStatut(StatutReclamation.EN_ATTENTE);
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public List<Reclamation> getReclamationsParStatut(StatutReclamation statut) {
        return reclamationRepository.findByStatut(statut);
    }

    public Reclamation getReclamationById(Long id) {
        return reclamationRepository.findById(id).orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
    }

    public Reclamation updateReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }
    public List<Reclamation> getReclamationsByUser(User user) {
        return reclamationRepository.findByUser(user);
    }

}
