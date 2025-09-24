package com.example.demo.Repository;

import com.example.demo.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByEncadrantId(Long encadrantId);
    List<Task> findByCandidatId(Long candidatId);
    List<Task> findByOffreStageId(Long offreStageId);
}
