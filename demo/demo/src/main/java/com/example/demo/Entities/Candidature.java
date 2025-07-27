package com.example.demo.Entities;


import jakarta.persistence.*;

import java.util.List;

@Entity
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cv; // chemin ou contenu
    private String lettreMotivation;
    private String remarque;

    @Enumerated(EnumType.STRING)
    private StatutCandidature statut;

    // Lien vers le candidat
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Lien vers l'offre
    @ManyToOne
    @JoinColumn(name = "offre_id")
    private OffreStage offre;

    // Liste des réponses (via la même entité `Question`)
    @OneToMany(mappedBy = "candidature", cascade = CascadeType.ALL)
    private List<Question> reponsesAuxQuestions;

    // Getters & Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCv() {
        return cv;
    }

    public void setCv(String cv) {
        this.cv = cv;
    }

    public String getLettreMotivation() {
        return lettreMotivation;
    }

    public void setLettreMotivation(String lettreMotivation) {
        this.lettreMotivation = lettreMotivation;
    }

    public String getRemarque() {
        return remarque;
    }

    public void setRemarque(String remarque) {
        this.remarque = remarque;
    }

    public StatutCandidature getStatut() {
        return statut;
    }

    public void setStatut(StatutCandidature statut) {
        this.statut = statut;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OffreStage getOffre() {
        return offre;
    }

    public void setOffre(OffreStage offre) {
        this.offre = offre;
    }

    public List<Question> getReponsesAuxQuestions() {
        return reponsesAuxQuestions;
    }

    public void setReponsesAuxQuestions(List<Question> reponsesAuxQuestions) {
        this.reponsesAuxQuestions = reponsesAuxQuestions;
    }
}
