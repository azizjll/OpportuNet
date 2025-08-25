package com.example.demo.controller;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO chatMessage) {
        chatService.sendMessage(chatMessage);
        return chatMessage;
    }
    
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessageDTO addUser(@Payload ChatMessageDTO chatMessage, 
                                 SimpMessageHeaderAccessor headerAccessor) {
        // Ajouter le nom d'utilisateur dans la session WebSocket
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSenderId());
        return chatMessage;
    }
    
    @MessageMapping("/chat.typing")
    public void sendTypingNotification(@Payload Map<String, Object> payload) {
        String chatRoomId = (String) payload.get("chatRoomId");
        String userId = (String) payload.get("userId");
        Boolean isTyping = (Boolean) payload.get("isTyping");
        
        chatService.sendTypingNotification(chatRoomId, userId, isTyping);
    }
    
    @MessageMapping("/chat.join")
    public void joinChatRoom(@Payload Map<String, String> payload) {
        String chatRoomId = payload.get("chatRoomId");
        String userId = payload.get("userId");
        
        // Logique pour rejoindre une salle de chat
    }
    
    @MessageMapping("/chat.leave")
    public void leaveChatRoom(@Payload Map<String, String> payload) {
        String chatRoomId = payload.get("chatRoomId");
        String userId = payload.get("userId");
        
        // Logique pour quitter une salle de chat
    }
}
