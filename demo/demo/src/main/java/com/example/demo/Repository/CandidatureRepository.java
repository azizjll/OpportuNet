package com.example.demo.Repository;



import com.example.demo.Entities.Candidature;
import com.example.demo.Entities.OffreStage;
import com.example.demo.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    List<Candidature> findByUser(User user);
    List<Candidature> findByOffre(OffreStage offre);
    boolean existsByUserAndOffre(User user, OffreStage offre);
    List<Candidature> findByOffre_Createur(User createur);

}
