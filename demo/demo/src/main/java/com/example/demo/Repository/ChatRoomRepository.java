package com.example.demo.repository;

import com.example.demo.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // Trouver une salle de chat par son ID
    Optional<ChatRoom> findByChatRoomId(String chatRoomId);

    // Trouver toutes les salles de chat d'un utilisateur
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.candidateId = :userId OR cr.organizationId = :userId ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findByUserId(@Param("userId") String userId);

    // Trouver une salle de chat pour un candidat et une organisation sur une offre spécifique
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.candidateId = :candidateId AND cr.organizationId = :organizationId AND cr.offerId = :offerId")
    Optional<ChatRoom> findByCandidateAndOrganizationAndOffer(@Param("candidateId") String candidateId, 
                                                             @Param("organizationId") String organizationId, 
                                                             @Param("offerId") Long offerId);

    // Trouver toutes les salles de chat liées à une offre
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.offerId = :offerId ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findByOfferId(@Param("offerId") Long offerId);

    // Trouver les salles de chat d'un candidat
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.candidateId = :candidateId ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findByCandidateId(@Param("candidateId") String candidateId);

    // Trouver les salles de chat d'une organisation
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.organizationId = :organizationId ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findByOrganizationId(@Param("organizationId") String organizationId);

    // Trouver les salles de chat actives
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.isActive = true ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findActiveChatRooms();

    // Vérifier si une salle de chat existe pour une offre et des utilisateurs
    @Query("SELECT COUNT(cr) > 0 FROM ChatRoom cr WHERE cr.candidateId = :candidateId AND cr.organizationId = :organizationId AND cr.offerId = :offerId")
    boolean existsByCandidateAndOrganizationAndOffer(@Param("candidateId") String candidateId, 
                                                    @Param("organizationId") String organizationId, 
                                                    @Param("offerId") Long offerId);
}
