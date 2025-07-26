package com.example.demo.Serivce;


import com.example.demo.Entities.Experience;
import com.example.demo.Entities.User;
import com.example.demo.Repository.ExperienceRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceServiceImpl implements ExperienceService {

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Experience addExperience(Long userId, Experience experience) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        experience.setUser(user);
        return experienceRepository.save(experience);
    }

    @Override
    public List<Experience> getExperiencesByUser(Long userId) {
        return experienceRepository.findByUserId(userId);
    }

    public Experience updateExperience(Long experienceId, Experience updatedExperience) {
        Experience exp = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found"));
        exp.setSociete(updatedExperience.getSociete());
        exp.setTitrePoste(updatedExperience.getTitrePoste());
        exp.setMission(updatedExperience.getMission());
        exp.setDateDebut(updatedExperience.getDateDebut());
        exp.setDateFin(updatedExperience.getDateFin());
        return experienceRepository.save(exp);
    }

}
