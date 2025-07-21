package com.example.demo.Serivce;


import com.example.demo.Entities.ParcoursAcademique;

import java.util.List;

public interface ParcoursAcademiqueService {
    ParcoursAcademique addParcours(Long userId, ParcoursAcademique parcours);
    List<ParcoursAcademique> getParcoursByUser(Long userId);
}
