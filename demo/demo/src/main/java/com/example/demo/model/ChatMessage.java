package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "sender_id", nullable = false)
    private String senderId;

    @Column(name = "sender_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserType senderType;

    @Column(name = "receiver_id", nullable = false)
    private String receiverId;

    @Column(name = "receiver_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserType receiverType;

    @Column(name = "chat_room_id", nullable = false)
    private String chatRoomId;

    @Column(name = "offer_id", nullable = false)
    private Long offerId; // Référence à l'offre d'emploi/stage

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "message_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private MessageStatus status = MessageStatus.SENT;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    public enum UserType {
        CANDIDATE, ORGANIZATION
    }

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public enum MessageStatus {
        SENT, READ, REPLIED
    }

    // Constructeurs
    public ChatMessage() {}

    public ChatMessage(String content, String senderId, UserType senderType, 
                      String receiverId, UserType receiverType, String chatRoomId, 
                      Long offerId, MessageType messageType) {
        this.content = content;
        this.senderId = senderId;
        this.senderType = senderType;
        this.receiverId = receiverId;
        this.receiverType = receiverType;
        this.chatRoomId = chatRoomId;
        this.offerId = offerId;
        this.messageType = messageType;
        this.timestamp = LocalDateTime.now();
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public UserType getSenderType() {
        return senderType;
    }

    public void setSenderType(UserType senderType) {
        this.senderType = senderType;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public UserType getReceiverType() {
        return receiverType;
    }

    public void setReceiverType(UserType receiverType) {
        this.receiverType = receiverType;
    }

    public String getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(String chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public Long getOfferId() {
        return offerId;
    }

    public void setOfferId(Long offerId) {
        this.offerId = offerId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public MessageStatus getStatus() {
        return status;
    }

    public void setStatus(MessageStatus status) {
        this.status = status;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public LocalDateTime getRepliedAt() {
        return repliedAt;
    }

    public void setRepliedAt(LocalDateTime repliedAt) {
        this.repliedAt = repliedAt;
    }
}
