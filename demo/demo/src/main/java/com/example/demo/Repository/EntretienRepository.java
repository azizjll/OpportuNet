package com.example.demo.Repository;


import com.example.demo.Entities.Entretien;
import com.example.demo.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntretienRepository extends JpaRepository<Entretien, Long> {
    Optional<Entretien> findByUser(User user);
}
