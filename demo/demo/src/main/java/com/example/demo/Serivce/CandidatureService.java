package com.example.demo.Serivce;


import com.example.demo.Entities.Candidature;
import com.example.demo.Entities.OffreStage;
import com.example.demo.Entities.User;
import com.example.demo.Repository.CandidatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidatureService {

    @Autowired
    private CandidatureRepository candidatureRepository;

    public Candidature postuler(Candidature candidature) {
        return candidatureRepository.save(candidature);
    }

    public List<Candidature> getCandidaturesByUser(User user) {
        return candidatureRepository.findByUser(user);
    }

    public List<Candidature> getAllCandidatures() {
        return candidatureRepository.findAll();
    }

    public List<Candidature> getCandidaturesByOffre(OffreStage offre) {
        return candidatureRepository.findByOffre(offre);
    }

    public boolean existeDeja(User user, OffreStage offre) {
        return candidatureRepository.existsByUserAndOffre(user, offre);
    }

    public List<Candidature> getCandidaturesDeMesOffres(User organisation) {
        return candidatureRepository.findByOffre_Createur(organisation);
    }

    public Optional<Candidature> getCandidatureById(Long id) {
        return candidatureRepository.findById(id);
    }


}
