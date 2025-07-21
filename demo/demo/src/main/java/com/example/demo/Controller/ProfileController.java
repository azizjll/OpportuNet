package com.example.demo.Controller;


import com.example.demo.Entities.Experience;
import com.example.demo.Entities.ParcoursAcademique;
import com.example.demo.Serivce.ExperienceService;
import com.example.demo.Serivce.ParcoursAcademiqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ExperienceService experienceService;

    @Autowired
    private ParcoursAcademiqueService parcoursService;

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
}
