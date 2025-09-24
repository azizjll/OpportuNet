package com.example.demo.Serivce;

import com.example.demo.Entities.*;
import com.example.demo.Repository.CandidatureRepository;
import com.example.demo.Repository.OffreStageRepository;
import com.example.demo.Repository.TaskRepository;
import com.example.demo.ServiceAvancé.EmailService;
import com.example.demo.dto.TaskDTO;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {


    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private OffreStageRepository offreStageRepository;

    @Autowired
    private EmailService emailService;


    public List<Task> createTasksForEncadrant(Long encadrantId, String titre, String description, LocalDate dateDebut, LocalDate dateFin) {
        // 1. Récupérer toutes les offres assignées à cet encadrant
        List<OffreStage> offres = offreStageRepository.findByEncadrantId(encadrantId);

        List<Task> tasks = new ArrayList<>();

        // 2. Pour chaque offre, récupérer les candidatures acceptées
        for (OffreStage offre : offres) {
            List<Candidature> candidaturesAcceptees = candidatureRepository
                    .findByOffreAndStatut(offre, StatutCandidature.ACCEPTEE);

            // 3. Créer une tâche pour chaque candidat
            for (Candidature c : candidaturesAcceptees) {
                Task task = new Task();
                task.setTitre(titre);
                task.setDescription(description);
                task.setStatus(TaskStatus.EN_ATTENTE);
                task.setCandidat(c.getUser());
                task.setEncadrant(offre.getEncadrant());
                task.setOffreStage(offre);

                task.setDateDebut(dateDebut);
                task.setDateFin(dateFin);

                tasks.add(taskRepository.save(task));
                // Envoi email au candidat
                emailService.sendTaskNotification(
                        c.getUser().getEmail(),
                        titre,
                        description,
                        dateFin);
            }
        }

        return tasks;
    }
    public List<Task> getTasksByEncadrant(Long encadrantId) {
        return taskRepository.findByEncadrantId(encadrantId);
    }

    public List<Task> getTasksByCandidat(Long candidatId) {
        return taskRepository.findByCandidatId(candidatId);
    }

    public List<Task> getTasksByOffreStage(Long offreStageId) {
        return taskRepository.findByOffreStageId(offreStageId);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }
}
