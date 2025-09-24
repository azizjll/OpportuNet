package com.example.demo.Repository;

import com.example.demo.Entities.Remise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RemiseRepository extends JpaRepository<Remise, Long> {
    List<Remise> findByTaskId(Long taskId);
    List<Remise> findByCandidatId(Long candidatId);
    boolean existsByTaskIdAndCandidatId(Long taskId, Long candidatId);

}