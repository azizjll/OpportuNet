package com.example.demo.Serivce;

import com.example.demo.Entities.Remise;
import com.example.demo.Entities.Task;
import com.example.demo.Entities.TaskStatus;
import com.example.demo.Repository.RemiseRepository;
import com.example.demo.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RemiseService {

    @Autowired
    private RemiseRepository remiseRepository;

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Soumettre une remise pour une tâche par un candidat
     * @param taskId : ID de la tâche
     * @param candidatId : ID du candidat
     * @param contenu : Contenu de la remise
     * @return Remise créée
     */
    public Remise soumettreRemise(Long taskId, Long candidatId, String contenu) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche introuvable"));

        // Vérifier que la tâche est bien affectée à ce candidat
        if (!task.getCandidat().getId().equals(candidatId)) {
            throw new RuntimeException("Cette tâche n'appartient pas à ce candidat !");
        }

        // Vérifier si une remise existe déjà pour cette tâche et ce candidat
        boolean exists = remiseRepository.existsByTaskIdAndCandidatId(taskId, candidatId);
        if (exists) {
            throw new RuntimeException("Vous avez déjà soumis une remise pour cette tâche !");
        }

        // Créer et sauvegarder la remise
        Remise remise = new Remise();
        remise.setTask(task);
        remise.setCandidat(task.getCandidat());
        remise.setContenu(contenu);
        Remise savedRemise = remiseRepository.save(remise);

        // ✅ Mettre à jour le statut de la tâche
        task.setStatus(TaskStatus.TERMINEE);
        taskRepository.save(task);

        return savedRemise;
    }
    /**
     * Récupérer toutes les remises d’un candidat
     * @param candidatId : ID du candidat
     * @return Liste des remises
     */
    public List<Remise> getRemisesByCandidat(Long candidatId) {
        return remiseRepository.findByCandidatId(candidatId);
    }

    /**
     * Récupérer toutes les remises pour une tâche
     * @param taskId : ID de la tâche
     * @return Liste des remises
     */
    public List<Remise> getRemisesByTask(Long taskId) {
        return remiseRepository.findByTaskId(taskId);
    }
}
