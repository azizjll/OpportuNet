package com.example.demo.repository;

import com.example.demo.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Trouver tous les messages d'une salle de chat
    List<ChatMessage> findByChatRoomIdOrderByTimestampAsc(String chatRoomId);

    // Trouver tous les messages d'un utilisateur
    @Query("SELECT m FROM ChatMessage m WHERE m.senderId = :userId OR m.receiverId = :userId ORDER BY m.timestamp DESC")
    List<ChatMessage> findByUserId(@Param("userId") String userId);

    // Trouver tous les messages liés à une offre spécifique
    @Query("SELECT m FROM ChatMessage m WHERE m.offerId = :offerId ORDER BY m.timestamp ASC")
    List<ChatMessage> findByOfferId(@Param("offerId") Long offerId);

    // Trouver les messages non lus pour un utilisateur dans une salle de chat
    @Query("SELECT m FROM ChatMessage m WHERE m.chatRoomId = :chatRoomId AND m.receiverId = :userId AND m.status = 'SENT'")
    List<ChatMessage> findUnreadMessagesByChatRoomAndUser(@Param("chatRoomId") String chatRoomId, @Param("userId") String userId);

    // Compter les messages non lus pour un utilisateur
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.receiverId = :userId AND m.status = 'SENT'")
    long countUnreadMessagesByUser(@Param("userId") String userId);

    // Trouver les messages entre un candidat et une organisation pour une offre spécifique
    @Query("SELECT m FROM ChatMessage m WHERE m.offerId = :offerId AND " +
           "((m.senderId = :candidateId AND m.receiverId = :organizationId) OR " +
           "(m.senderId = :organizationId AND m.receiverId = :candidateId)) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findByOfferAndUsers(@Param("offerId") Long offerId, 
                                        @Param("candidateId") String candidateId, 
                                        @Param("organizationId") String organizationId);

    // Trouver les dernières conversations d'un utilisateur
    @Query("SELECT DISTINCT m.chatRoomId FROM ChatMessage m WHERE m.senderId = :userId OR m.receiverId = :userId")
    List<String> findChatRoomsByUser(@Param("userId") String userId);

    // Trouver les messages récents pour une salle de chat
    @Query("SELECT m FROM ChatMessage m WHERE m.chatRoomId = :chatRoomId ORDER BY m.timestamp DESC LIMIT 50")
    List<ChatMessage> findRecentMessagesByChatRoom(@Param("chatRoomId") String chatRoomId);
}
