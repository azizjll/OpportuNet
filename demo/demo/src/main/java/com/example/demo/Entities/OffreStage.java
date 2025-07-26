package com.example.demo.Entities;



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

    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL)
    private List<Question> questions;

    // Getters and Setters
    // ...
}
