package com.example.demo.Repository;


import com.example.demo.Entities.ParcoursAcademique;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParcoursAcademiqueRepository extends JpaRepository<ParcoursAcademique, Long> {
    List<ParcoursAcademique> findByUserId(Long userId);
}
