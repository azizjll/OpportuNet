package com.example.demo.Entities;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class OffreStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;

    @Enumerated(EnumType.STRING)
    private TypeOffre type;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private EtatOffre etat;

    @ManyToOne
    @JoinColumn(name = "createur_id")
    private User createur;

    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    private User encadrant;

    @OneToMany(mappedBy = "offreStage", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> taches;

    public List<Task> getTaches() {
        return taches;
    }

    public void setTaches(List<Task> taches) {
        this.taches = taches;
    }

    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL)
    private List<Question> questions;

    // Getters and Setters

    public User getEncadrant() {
        return encadrant;
    }

    public void setEncadrant(User encadrant) {
        this.encadrant = encadrant;
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

    public TypeOffre getType() {
        return type;
    }

    public void setType(TypeOffre type) {
        this.type = type;
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

    public EtatOffre getEtat() {
        return etat;
    }

    public void setEtat(EtatOffre etat) {
        this.etat = etat;
    }

    public User getCreateur() {
        return createur;
    }

    public void setCreateur(User createur) {
        this.createur = createur;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
