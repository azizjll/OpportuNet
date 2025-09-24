package com.example.demo.Entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Entretien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private LocalDateTime dateEntretien;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateEntretien() {
        return dateEntretien;
    }

    public void setDateEntretien(LocalDateTime dateEntretien) {
        this.dateEntretien = dateEntretien;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
