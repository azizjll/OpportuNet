import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id?: number;
  content: string;
  senderId: string;
  senderType: 'CANDIDATE' | 'ORGANIZATION';
  receiverId: string;
  receiverType: 'CANDIDATE' | 'ORGANIZATION';
  timestamp?: Date;
  chatRoomId: string;
  offerId: number;
  offerTitle?: string;
  messageType?: 'CHAT' | 'JOIN' | 'LEAVE';
  status?: 'SENT' | 'READ' | 'REPLIED';
  readAt?: Date;
  repliedAt?: Date;
  senderName?: string;
  receiverName?: string;
}

export interface ChatRoom {
  id?: number;
  chatRoomId: string;
  candidateId: string;
  organizationId: string;
  offerId: number;
  offerTitle: string;
  createdAt?: Date;
  lastMessageAt?: Date;
  isActive?: boolean;
}

export interface TypingNotification {
  userId: string;
  isTyping: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$!: WebSocketSubject<any>;
  private messageSubject = new Subject<ChatMessage>();
  private typingSubject = new Subject<TypingNotification>();
  private onlineStatusSubject = new Subject<{userId: string, isOnline: boolean}>();

  public messages$ = this.messageSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public onlineStatus$ = this.onlineStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    this.socket$ = webSocket(`${environment.wsUrl}/ws`);
    
    this.socket$.subscribe({
      next: (message) => {
        if (message.type === 'CHAT') {
          this.messageSubject.next(message);
        } else if (message.type === 'TYPING') {
          this.typingSubject.next(message);
        } else if (message.type === 'STATUS') {
          this.onlineStatusSubject.next(message);
        }
      },
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed')
    });
  }

  // REST API calls - Offres liées
  createChatRoomForOffer(candidateId: string, organizationId: string, offerId: number, offerTitle: string): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${environment.apiUrl}/api/chat/rooms/offer`, null, {
      params: { candidateId, organizationId, offerId: offerId.toString(), offerTitle }
    });
  }

  getUserChatRooms(userId: string): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${environment.apiUrl}/api/chat/rooms/user/${userId}`);
  }

  getCandidateChatRooms(candidateId: string): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${environment.apiUrl}/api/chat/rooms/candidate/${candidateId}`);
  }

  getOrganizationChatRooms(organizationId: string): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${environment.apiUrl}/api/chat/rooms/organization/${organizationId}`);
  }

  getChatHistory(chatRoomId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${environment.apiUrl}/api/chat/messages/${chatRoomId}`);
  }

  getChatHistoryForOffer(offerId: number, candidateId: string, organizationId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${environment.apiUrl}/api/chat/messages/offer/${offerId}`, {
      params: { candidateId, organizationId }
    });
  }

  sendMessage(message: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${environment.apiUrl}/api/chat/messages`, message);
  }

  markMessagesAsRead(chatRoomId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/chat/messages/read/${chatRoomId}`, null, {
      params: { userId }
    });
  }

  markMessageAsReplied(messageId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/chat/messages/${messageId}/replied`, {});
  }

  getUnreadMessageCount(userId: string): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${environment.apiUrl}/api/chat/unread/count/${userId}`);
  }

  canUserSendMessageForOffer(offerId: number, userId: string): Observable<{canSend: boolean}> {
    return this.http.get<{canSend: boolean}>(`${environment.apiUrl}/api/chat/can-send/${offerId}`, {
      params: { userId }
    });
  }

  getOrganizationForOffer(offerId: number): Observable<{organizationId: string}> {
    return this.http.get<{organizationId: string}>(`${environment.apiUrl}/api/chat/organization/${offerId}`);
  }

  // WebSocket methods
  joinChatRoom(chatRoomId: string, userId: string): void {
    this.socket$.next({
      type: 'JOIN',
      chatRoomId,
      userId
    });
  }

  leaveChatRoom(chatRoomId: string, userId: string): void {
    this.socket$.next({
      type: 'LEAVE',
      chatRoomId,
      userId
    });
  }

  sendChatMessage(message: ChatMessage): void {
    this.socket$.next({
      type: 'CHAT',
      ...message
    });
  }

  sendTypingNotification(chatRoomId: string, userId: string, isTyping: boolean): void {
    this.socket$.next({
      type: 'TYPING',
      chatRoomId,
      userId,
      isTyping
    });
  }

  sendOnlineStatus(userId: string, isOnline: boolean): void {
    this.socket$.next({
      type: 'STATUS',
      userId,
      isOnline
    });
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
