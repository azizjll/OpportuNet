package com.example.demo.dto;

public class TaskDTO {
    private String titre;
    private String description;
    private Long offreId;// juste l'offre pour laquelle créer les tâches

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

    public Long getOffreId() {
        return offreId;
    }

    public void setOffreId(Long offreId) {
        this.offreId = offreId;
    }
}
