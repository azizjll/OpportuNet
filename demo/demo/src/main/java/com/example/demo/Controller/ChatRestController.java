package com.example.demo.controller;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.model.ChatRoom;
import com.example.demo.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    // Créer une salle de chat pour une offre
    @PostMapping("/rooms/offer")
    public ResponseEntity<ChatRoom> createChatRoomForOffer(
            @RequestParam String candidateId,
            @RequestParam String organizationId,
            @RequestParam Long offerId,
            @RequestParam String offerTitle) {
        
        ChatRoom chatRoom = chatService.createChatRoom(candidateId, organizationId, offerId, offerTitle);
        return ResponseEntity.ok(chatRoom);
    }

    // Récupérer les salles de chat d'un utilisateur
    @GetMapping("/rooms/user/{userId}")
    public ResponseEntity<List<ChatRoom>> getUserChatRooms(@PathVariable String userId) {
        List<ChatRoom> chatRooms = chatService.getUserChatRooms(userId);
        return ResponseEntity.ok(chatRooms);
    }

    // Récupérer les salles de chat d'un candidat
    @GetMapping("/rooms/candidate/{candidateId}")
    public ResponseEntity<List<ChatRoom>> getCandidateChatRooms(@PathVariable String candidateId) {
        List<ChatRoom> chatRooms = chatService.getCandidateChatRooms(candidateId);
        return ResponseEntity.ok(chatRooms);
    }

    // Récupérer les salles de chat d'une organisation
    @GetMapping("/rooms/organization/{organizationId}")
    public ResponseEntity<List<ChatRoom>> getOrganizationChatRooms(@PathVariable String organizationId) {
        List<ChatRoom> chatRooms = chatService.getOrganizationChatRooms(organizationId);
        return ResponseEntity.ok(chatRooms);
    }

    // Récupérer l'historique des messages pour une salle de chat
    @GetMapping("/messages/{chatRoomId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable String chatRoomId) {
        List<ChatMessageDTO> messages = chatService.getChatHistory(chatRoomId);
        return ResponseEntity.ok(messages);
    }

    // Récupérer l'historique des messages pour une offre spécifique
    @GetMapping("/messages/offer/{offerId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistoryForOffer(
            @PathVariable Long offerId,
            @RequestParam String candidateId,
            @RequestParam String organizationId) {
        
        List<ChatMessageDTO> messages = chatService.getChatHistoryForOffer(offerId, candidateId, organizationId);
        return ResponseEntity.ok(messages);
    }

    // Envoyer un message
    @PostMapping("/messages")
    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO messageDTO) {
        try {
            chatService.sendMessage(messageDTO);
            return ResponseEntity.ok(messageDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Marquer les messages comme lus
    @PostMapping("/messages/read/{chatRoomId}")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable String chatRoomId,
            @RequestParam String userId) {
        
        chatService.markMessagesAsRead(chatRoomId, userId);
        return ResponseEntity.ok().build();
    }

    // Marquer un message comme répondu
    @PostMapping("/messages/{messageId}/replied")
    public ResponseEntity<Void> markMessageAsReplied(@PathVariable Long messageId) {
        chatService.markMessageAsReplied(messageId);
        return ResponseEntity.ok().build();
    }

    // Compter les messages non lus pour un utilisateur
    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Map<String, Long>> getUnreadMessageCount(@PathVariable String userId) {
        long count = chatService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Vérifier si un utilisateur peut envoyer un message pour une offre
    @GetMapping("/can-send/{offerId}")
    public ResponseEntity<Map<String, Boolean>> canUserSendMessageForOffer(
            @PathVariable Long offerId,
            @RequestParam String userId) {
        
        boolean canSend = chatService.canUserSendMessageForOffer(userId, offerId);
        return ResponseEntity.ok(Map.of("canSend", canSend));
    }

    // Récupérer l'organisation responsable d'une offre
    @GetMapping("/organization/{offerId}")
    public ResponseEntity<Map<String, String>> getOrganizationForOffer(@PathVariable Long offerId) {
        String organizationId = chatService.getOrganizationForOffer(offerId);
        return ResponseEntity.ok(Map.of("organizationId", organizationId));
    }

    // Méthode utilitaire pour créer une Map
    private Map<String, Object> Map(String key, Object value) {
        return java.util.Map.of(key, value);
    }
}
