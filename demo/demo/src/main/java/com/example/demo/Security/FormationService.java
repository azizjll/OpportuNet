package com.example.demo.Security;


import com.example.demo.Entities.Formation;
import com.example.demo.Repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormationService {

    private final FormationRepository formationRepository;

    public FormationService(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    public Formation saveFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    public Optional<Formation> getFormationById(Long id) {
        return formationRepository.findById(id);
    }

    public void deleteFormation(Long id) {
        formationRepository.deleteById(id);
    }
}
