package com.example.demo.Entities;



import jakarta.persistence.*;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenu; // contenu de la question posée par l'entreprise

    private String reponse; // réponse donnée par le candidat (optionnelle au début)

    @ManyToOne
    @JoinColumn(name = "offre_id")
    private OffreStage offre;

    @ManyToOne
    @JoinColumn(name = "candidature_id")
    private Candidature candidature; // la réponse est associée à une candidature

    // Getters and Setters


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

    public String getReponse() {
        return reponse;
    }

    public void setReponse(String reponse) {
        this.reponse = reponse;
    }

    public OffreStage getOffre() {
        return offre;
    }

    public void setOffre(OffreStage offre) {
        this.offre = offre;
    }

    public Candidature getCandidature() {
        return candidature;
    }

    public void setCandidature(Candidature candidature) {
        this.candidature = candidature;
    }
}
