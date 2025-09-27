package com.example.demo.Repository;

import com.example.demo.Entities.Reclamation;
import com.example.demo.Entities.StatutReclamation;
import com.example.demo.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByStatut(StatutReclamation statut);
    List<Reclamation> findByUser(User user);

}
