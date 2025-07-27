package com.example.demo.Repository;


import com.example.demo.Entities.OffreStage;
import com.example.demo.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {
    // Tu peux ajouter des méthodes personnalisées ici si besoin
    List<OffreStage> findByCreateur(User user);

}
