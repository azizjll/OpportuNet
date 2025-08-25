package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chat_room_id", nullable = false, unique = true)
    private String chatRoomId;

    @Column(name = "candidate_id", nullable = false)
    private String candidateId;

    @Column(name = "organization_id", nullable = false)
    private String organizationId;

    @Column(name = "offer_id", nullable = false)
    private Long offerId; // Référence à l'offre d'emploi/stage

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "offer_title")
    private String offerTitle; // Titre de l'offre pour affichage

    // Constructeurs
    public ChatRoom() {
        this.createdAt = LocalDateTime.now();
    }

    public ChatRoom(String chatRoomId, String candidateId, String organizationId, 
                   Long offerId, String offerTitle) {
        this();
        this.chatRoomId = chatRoomId;
        this.candidateId = candidateId;
        this.organizationId = organizationId;
        this.offerId = offerId;
        this.offerTitle = offerTitle;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(String chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(String candidateId) {
        this.candidateId = candidateId;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Long getOfferId() {
        return offerId;
    }

    public void setOfferId(Long offerId) {
        this.offerId = offerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getOfferTitle() {
        return offerTitle;
    }

    public void setOfferTitle(String offerTitle) {
        this.offerTitle = offerTitle;
    }
}
