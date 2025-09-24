package com.example.demo.Entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Remise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenu; // URL, texte ou chemin du fichier
    private LocalDateTime dateSoumission = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "candidat_id")
    private User candidat;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public LocalDateTime getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(LocalDateTime dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getCandidat() {
        return candidat;
    }

    public void setCandidat(User candidat) {
        this.candidat = candidat;
    }
}
