package com.example.demo.service;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.model.ChatMessage;
import com.example.demo.model.ChatRoom;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Créer une salle de chat pour une offre spécifique
    public ChatRoom createChatRoom(String candidateId, String organizationId, Long offerId, String offerTitle) {
        // Vérifier si une salle existe déjà
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByCandidateAndOrganizationAndOffer(
            candidateId, organizationId, offerId);
        
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }

        // Créer une nouvelle salle
        String chatRoomId = generateChatRoomId();
        ChatRoom chatRoom = new ChatRoom(chatRoomId, candidateId, organizationId, offerId, offerTitle);
        
        return chatRoomRepository.save(chatRoom);
    }

    // Envoyer un message
    public ChatMessage sendMessage(ChatMessageDTO messageDTO) {
        // Vérifier que la salle de chat existe
        Optional<ChatRoom> chatRoom = chatRoomRepository.findByChatRoomId(messageDTO.getChatRoomId());
        if (!chatRoom.isPresent()) {
            throw new RuntimeException("Salle de chat non trouvée");
        }

        // Vérifier que l'utilisateur a le droit d'envoyer un message dans cette salle
        ChatRoom room = chatRoom.get();
        if (!messageDTO.getSenderId().equals(room.getCandidateId()) && 
            !messageDTO.getSenderId().equals(room.getOrganizationId())) {
            throw new RuntimeException("Utilisateur non autorisé à envoyer un message dans cette salle");
        }

        // Créer le message
        ChatMessage message = new ChatMessage(
            messageDTO.getContent(),
            messageDTO.getSenderId(),
            ChatMessage.UserType.valueOf(messageDTO.getSenderType()),
            messageDTO.getReceiverId(),
            ChatMessage.UserType.valueOf(messageDTO.getReceiverType()),
            messageDTO.getChatRoomId(),
            messageDTO.getOfferId(),
            ChatMessage.MessageType.valueOf(messageDTO.getMessageType())
        );

        // Sauvegarder le message
        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Mettre à jour la date du dernier message dans la salle
        room.setLastMessageAt(LocalDateTime.now());
        chatRoomRepository.save(room);

        // Envoyer via WebSocket
        messagingTemplate.convertAndSend("/topic/chat/" + messageDTO.getChatRoomId(), 
            convertToDTO(savedMessage));

        return savedMessage;
    }

    // Récupérer l'historique des messages pour une offre
    public List<ChatMessageDTO> getChatHistoryForOffer(Long offerId, String candidateId, String organizationId) {
        List<ChatMessage> messages = chatMessageRepository.findByOfferAndUsers(offerId, candidateId, organizationId);
        return messages.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Récupérer l'historique des messages pour une salle de chat
    public List<ChatMessageDTO> getChatHistory(String chatRoomId) {
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
        return messages.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Récupérer les salles de chat d'un utilisateur
    public List<ChatRoom> getUserChatRooms(String userId) {
        return chatRoomRepository.findByUserId(userId);
    }

    // Récupérer les salles de chat d'un candidat
    public List<ChatRoom> getCandidateChatRooms(String candidateId) {
        return chatRoomRepository.findByCandidateId(candidateId);
    }

    // Récupérer les salles de chat d'une organisation
    public List<ChatRoom> getOrganizationChatRooms(String organizationId) {
        return chatRoomRepository.findByOrganizationId(organizationId);
    }

    // Marquer les messages comme lus
    public void markMessagesAsRead(String chatRoomId, String userId) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findUnreadMessagesByChatRoomAndUser(chatRoomId, userId);
        
        for (ChatMessage message : unreadMessages) {
            message.setStatus(ChatMessage.MessageStatus.READ);
            message.setReadAt(LocalDateTime.now());
            chatMessageRepository.save(message);
        }

        // Notifier via WebSocket
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId + "/read", 
            Map.of("userId", userId, "timestamp", LocalDateTime.now()));
    }

    // Marquer un message comme répondu
    public void markMessageAsReplied(Long messageId) {
        Optional<ChatMessage> messageOpt = chatMessageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            ChatMessage message = messageOpt.get();
            message.setStatus(ChatMessage.MessageStatus.REPLIED);
            message.setRepliedAt(LocalDateTime.now());
            chatMessageRepository.save(message);

            // Notifier via WebSocket
            messagingTemplate.convertAndSend("/topic/chat/" + message.getChatRoomId() + "/replied", 
                convertToDTO(message));
        }
    }

    // Compter les messages non lus pour un utilisateur
    public long getUnreadMessageCount(String userId) {
        return chatMessageRepository.countUnreadMessagesByUser(userId);
    }

    // Vérifier si un utilisateur peut envoyer un message pour une offre
    public boolean canUserSendMessageForOffer(String userId, Long offerId) {
        // Cette méthode devrait vérifier si l'utilisateur a postulé à l'offre
        // ou si c'est l'organisation qui a créé l'offre
        // Pour l'instant, on retourne true (à implémenter selon votre logique métier)
        return true;
    }

    // Récupérer l'organisation responsable d'une offre
    public String getOrganizationForOffer(Long offerId) {
        // Cette méthode devrait récupérer l'organisation depuis la base de données
        // Pour l'instant, on retourne une valeur par défaut
        return "org_" + offerId;
    }

    // Méthodes privées
    private String generateChatRoomId() {
        return "room_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    private ChatMessageDTO convertToDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO(message);
        
        // Ajouter les noms des utilisateurs (à implémenter selon votre logique)
        dto.setSenderName("Utilisateur " + message.getSenderId());
        dto.setReceiverName("Utilisateur " + message.getReceiverId());
        
        return dto;
    }

    // Méthode utilitaire pour créer une Map
    private java.util.Map<String, Object> Map(String key, Object value) {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put(key, value);
        return map;
    }
}
