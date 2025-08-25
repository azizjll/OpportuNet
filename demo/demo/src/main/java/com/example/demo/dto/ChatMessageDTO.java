package com.example.demo.dto;

import com.example.demo.model.ChatMessage;
import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Long id;
    private String content;
    private String senderId;
    private String senderType;
    private String receiverId;
    private String receiverType;
    private String chatRoomId;
    private Long offerId;
    private String offerTitle;
    private LocalDateTime timestamp;
    private String messageType;
    private String status;
    private LocalDateTime readAt;
    private LocalDateTime repliedAt;
    private String senderName;
    private String receiverName;

    // Constructeurs
    public ChatMessageDTO() {}

    public ChatMessageDTO(ChatMessage message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.senderId = message.getSenderId();
        this.senderType = message.getSenderType().name();
        this.receiverId = message.getReceiverId();
        this.receiverType = message.getReceiverType().name();
        this.chatRoomId = message.getChatRoomId();
        this.offerId = message.getOfferId();
        this.timestamp = message.getTimestamp();
        this.messageType = message.getMessageType().name();
        this.status = message.getStatus().name();
        this.readAt = message.getReadAt();
        this.repliedAt = message.getRepliedAt();
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

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverType() {
        return receiverType;
    }

    public void setReceiverType(String receiverType) {
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

    public String getOfferTitle() {
        return offerTitle;
    }

    public void setOfferTitle(String offerTitle) {
        this.offerTitle = offerTitle;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }
}
