package com.example.demo.Controller;

import com.example.demo.Entities.Task;
import com.example.demo.Entities.TaskStatus;
import com.example.demo.Entities.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Serivce.TaskService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // autorise tout front (Angular, etc.)
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    // Vérifie si le token correspond bien à un ENCADRANT
    private void checkEncadrantRole(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ENCADRANT".equals(role)) {
            throw new RuntimeException("Access denied: ENCADRANT role required");
        }
    }

    @PostMapping
    public List<Task> createTasksAutomatically(@RequestHeader("Authorization") String authHeader,
                                               @RequestParam String titre,
                                               @RequestParam String description,
                                               @RequestParam String dateDebut,
                                               @RequestParam String dateFin) {
        checkEncadrantRole(authHeader);

        String token = authHeader.substring(7);
        String email  = jwtService.extractEmail(token); // méthode pour récupérer l'id de l'utilisateur
        // Récupérer l'utilisateur ENCADRANT par email
        User encadrant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // ✅ Convertir les Strings en LocalDate
        LocalDate debut = LocalDate.parse(dateDebut);
        LocalDate fin = LocalDate.parse(dateFin);
        
        return taskService.createTasksForEncadrant(encadrant.getId(), titre, description,  debut, fin);
        }

    @GetMapping("/encadrant/{email}")
    public List<Task> getTasksByEncadrant(@RequestHeader("Authorization") String authHeader,
                                          @PathVariable String email) {
        checkEncadrantRole(authHeader);

        User encadrant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));

        return taskService.getTasksByEncadrant(encadrant.getId());
    }


    @GetMapping("/candidat/me")
    public List<Task> getMyTasks(@RequestHeader("Authorization") String authHeader) {
        // Vérification du token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);

        // Seuls les candidats ont le droit d'accéder
        if (!"CANDIDAT".equals(role)) {
            throw new RuntimeException("Access denied: CANDIDAT role required");
        }

        // Récupérer le candidat connecté à partir de l'email dans le token
        String email = jwtService.extractEmail(token);
        User candidat = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Retourner uniquement les tâches du candidat connecté
        return taskService.getTasksByCandidat(candidat.getId());
    }


    @GetMapping("/offre/{id}")
    public List<Task> getTasksByOffreStage(@RequestHeader("Authorization") String authHeader,
                                           @PathVariable Long id) {
        checkEncadrantRole(authHeader);
        return taskService.getTasksByOffreStage(id);
    }

    @PutMapping("/{taskId}/status")
    public Task updateStatus(@RequestHeader("Authorization") String authHeader,
                             @PathVariable Long taskId,
                             @RequestParam TaskStatus status) {
        checkEncadrantRole(authHeader);
        return taskService.updateTaskStatus(taskId, status);
    }
}
