package com.example.demo.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.EN_ATTENTE; // EN_ATTENTE, EN_COURS, TERMINEE

    // L'offre de stage concernée
    @ManyToOne
    @JoinColumn(name = "offre_stage_id")
    private OffreStage offreStage;

    // L'encadrant qui assigne
    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    private User encadrant;

    // Le candidat qui reçoit
    @ManyToOne
    @JoinColumn(name = "candidat_id")
    private User candidat;

    // Optionnel : pour historique des modifications
    private LocalDateTime creeLe = LocalDateTime.now();
    private LocalDateTime misAJourLe;

    @PreUpdate
    public void setMisAJourLe() {
        this.misAJourLe = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public OffreStage getOffreStage() {
        return offreStage;
    }

    public void setOffreStage(OffreStage offreStage) {
        this.offreStage = offreStage;
    }

    public User getCandidat() {
        return candidat;
    }

    public void setCandidat(User candidat) {
        this.candidat = candidat;
    }

    public User getEncadrant() {
        return encadrant;
    }

    public void setEncadrant(User encadrant) {
        this.encadrant = encadrant;
    }

    public LocalDateTime getCreeLe() {
        return creeLe;
    }

    public void setCreeLe(LocalDateTime creeLe) {
        this.creeLe = creeLe;
    }

    public LocalDateTime getMisAJourLe() {
        return misAJourLe;
    }

    public void setMisAJourLe(LocalDateTime misAJourLe) {
        this.misAJourLe = misAJourLe;
    }

    // Getters et Setters
}
