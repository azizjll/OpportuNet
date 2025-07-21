package com.example.demo.Serivce;



import com.example.demo.Entities.ParcoursAcademique;
import com.example.demo.Entities.User;
import com.example.demo.Repository.ParcoursAcademiqueRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParcoursAcademiqueServiceImpl implements ParcoursAcademiqueService {

    @Autowired
    private ParcoursAcademiqueRepository parcoursRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ParcoursAcademique addParcours(Long userId, ParcoursAcademique parcours) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        parcours.setUser(user);
        return parcoursRepository.save(parcours);
    }

    @Override
    public List<ParcoursAcademique> getParcoursByUser(Long userId) {
        return parcoursRepository.findByUserId(userId);
    }
}
