package com.example.demo.Serivce;


import com.example.demo.Entities.Experience;

import java.util.List;

public interface ExperienceService {
    Experience addExperience(Long userId, Experience experience);
    List<Experience> getExperiencesByUser(Long userId);
}
