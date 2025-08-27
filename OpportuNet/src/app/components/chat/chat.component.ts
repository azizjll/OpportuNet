import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatService, ChatMessage, ChatRoom, TypingNotification } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  chatRooms: ChatRoom[] = [];
  selectedChatRoom: ChatRoom | null = null;
  newMessage = '';
  currentUserId = 'user123'; // ID de test
  currentUserType: 'CANDIDATE' | 'ORGANIZATION' = 'CANDIDATE';
  isTyping = false;
  typingUsers: string[] = [];
  
  // Données de test pour les offres
  testOffers = [
    { id: 1, title: 'Développeur Full Stack', organizationId: 'org456' },
    { id: 2, title: 'Stagiaire Marketing', organizationId: 'org789' }
  ];
  
  // Données de test
  testUsers = [
    { id: 'user123', name: 'Candidat Test', type: 'CANDIDATE' },
    { id: 'org456', name: 'Organisation Test', type: 'ORGANIZATION' }
  ];
  
  private subscriptions: Subscription[] = [];
  private typingTimeout: any;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.detectUserType();
    this.createTestData();
    this.loadChatRooms();
    this.subscribeToMessages();
    this.subscribeToTyping();
    this.subscribeToOnlineStatus();
  }

  // Détecter le type d'utilisateur basé sur l'URL ou les données de session
  detectUserType(): void {
    // Vérifier si on est dans la partie admin ou frontoffice
    const isAdminRoute = window.location.pathname.includes('/admin');
    
    if (isAdminRoute) {
      // Dans la partie admin, on suppose que c'est une organisation
      this.currentUserType = 'ORGANIZATION';
      this.currentUserId = 'org456';
    } else {
      // Dans la partie frontoffice, on suppose que c'est un candidat
      this.currentUserType = 'CANDIDATE';
      this.currentUserId = 'user123';
    }
    
    console.log('Type d\'utilisateur détecté:', this.currentUserType);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.chatService.disconnect();
  }

  // Créer des données de test liées aux offres
  createTestData(): void {
    // Créer des salles de chat de test liées aux offres
    const testChatRooms: ChatRoom[] = [
      {
        chatRoomId: 'test-room-1',
        candidateId: 'user123',
        organizationId: 'org456',
        offerId: 1,
        offerTitle: 'Développeur Full Stack',
        createdAt: new Date(),
        isActive: true
      },
      {
        chatRoomId: 'test-room-2',
        candidateId: 'user123',
        organizationId: 'org789',
        offerId: 2,
        offerTitle: 'Stagiaire Marketing',
        createdAt: new Date(),
        isActive: true
      }
    ];

    this.chatRooms = testChatRooms;
    this.selectedChatRoom = testChatRooms[0];

    // Ajouter quelques messages de test
    this.messages = [
      {
        id: 1,
        content: 'Bonjour ! Je suis intéressé par votre offre de développeur Full Stack.',
        senderId: 'user123',
        senderType: 'CANDIDATE',
        receiverId: 'org456',
        receiverType: 'ORGANIZATION',
        timestamp: new Date(Date.now() - 60000),
        chatRoomId: 'test-room-1',
        offerId: 1,
        offerTitle: 'Développeur Full Stack',
        status: 'READ',
        senderName: 'Candidat Test'
      },
      {
        id: 2,
        content: 'Bonjour ! Merci pour votre intérêt. Pouvez-vous nous en dire plus sur votre expérience en React et Spring Boot ?',
        senderId: 'org456',
        senderType: 'ORGANIZATION',
        receiverId: 'user123',
        receiverType: 'CANDIDATE',
        timestamp: new Date(Date.now() - 30000),
        chatRoomId: 'test-room-1',
        offerId: 1,
        offerTitle: 'Développeur Full Stack',
        status: 'SENT',
        senderName: 'Organisation Test'
      }
    ];
  }

  loadChatRooms(): void {
    // Pour le test, on utilise les données simulées
    console.log('Chargement des salles de chat...');
    
    // En production, on utiliserait :
    // if (this.currentUserType === 'CANDIDATE') {
    //   this.chatService.getCandidateChatRooms(this.currentUserId).subscribe(rooms => {
    //     this.chatRooms = rooms;
    //   });
    // } else {
    //   this.chatService.getOrganizationChatRooms(this.currentUserId).subscribe(rooms => {
    //     this.chatRooms = rooms;
    //   });
    // }
  }

  selectChatRoom(chatRoom: ChatRoom): void {
    this.selectedChatRoom = chatRoom;
    this.loadChatHistory(chatRoom.chatRoomId);
    this.joinChatRoom(chatRoom.chatRoomId);
  }

  loadChatHistory(chatRoomId: string): void {
    // Pour le test, on utilise les messages simulés
    console.log('Chargement de l\'historique pour:', chatRoomId);
    
    // En production, on utiliserait :
    // this.chatService.getChatHistory(chatRoomId).subscribe(messages => {
    //   this.messages = messages;
    //   this.scrollToBottom();
    // });
    
    this.scrollToBottom();
  }

  joinChatRoom(chatRoomId: string): void {
    console.log('Rejoindre la salle:', chatRoomId);
    this.chatService.joinChatRoom(chatRoomId, this.currentUserId);
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedChatRoom) return;

    const message: ChatMessage = {
      content: this.newMessage,
      senderId: this.currentUserId,
      senderType: this.currentUserType,
      receiverId: this.getReceiverId(),
      receiverType: this.getReceiverType(),
      chatRoomId: this.selectedChatRoom.chatRoomId,
      offerId: this.selectedChatRoom.offerId,
      offerTitle: this.selectedChatRoom.offerTitle,
      timestamp: new Date(),
      status: 'SENT',
      senderName: this.getCurrentUserName()
    };

    // Ajouter le message à la liste locale pour le test
    this.messages.push(message);

    // Envoyer via le service
    this.chatService.sendChatMessage(message);
    this.newMessage = '';
    this.stopTyping();
    this.scrollToBottom();
  }

  onTyping(): void {
    if (!this.isTyping) {
      this.isTyping = true;
      this.sendTypingNotification(true);
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
      this.sendTypingNotification(false);
    }, 1000);
  }

  private sendTypingNotification(isTyping: boolean): void {
    if (this.selectedChatRoom) {
      this.chatService.sendTypingNotification(
        this.selectedChatRoom.chatRoomId,
        this.currentUserId,
        isTyping
      );
    }
  }

  private stopTyping(): void {
    this.isTyping = false;
    this.sendTypingNotification(false);
  }

  private getReceiverId(): string {
    if (!this.selectedChatRoom) return '';
    return this.currentUserType === 'CANDIDATE' 
      ? this.selectedChatRoom.organizationId 
      : this.selectedChatRoom.candidateId;
  }

  private getReceiverType(): 'CANDIDATE' | 'ORGANIZATION' {
    return this.currentUserType === 'CANDIDATE' ? 'ORGANIZATION' : 'CANDIDATE';
  }

  private getCurrentUserName(): string {
    const user = this.testUsers.find(u => u.id === this.currentUserId);
    return user ? user.name : this.currentUserId;
  }

  // Changer le type d'utilisateur pour tester
  switchUserType(): void {
    this.currentUserType = this.currentUserType === 'CANDIDATE' ? 'ORGANIZATION' : 'CANDIDATE';
    this.currentUserId = this.currentUserType === 'CANDIDATE' ? 'user123' : 'org456';
  }

  // Obtenir le titre de l'offre pour une salle de chat
  getOfferTitle(chatRoom: ChatRoom): string {
    return chatRoom.offerTitle || `Offre #${chatRoom.offerId}`;
  }

  // Vérifier si un message est lu
  isMessageRead(message: ChatMessage): boolean {
    return message.status === 'READ' || message.status === 'REPLIED';
  }

  // Vérifier si un message est répondu
  isMessageReplied(message: ChatMessage): boolean {
    return message.status === 'REPLIED';
  }

  private subscribeToMessages(): void {
    this.subscriptions.push(
      this.chatService.messages$.subscribe(message => {
        if (this.selectedChatRoom && message.chatRoomId === this.selectedChatRoom.chatRoomId) {
          this.messages.push(message);
          this.scrollToBottom();
        }
      })
    );
  }

  private subscribeToTyping(): void {
    this.subscriptions.push(
      this.chatService.typing$.subscribe(notification => {
        if (this.selectedChatRoom && notification.userId !== this.currentUserId) {
          if (notification.isTyping) {
            if (!this.typingUsers.includes(notification.userId)) {
              this.typingUsers.push(notification.userId);
            }
          } else {
            this.typingUsers = this.typingUsers.filter(id => id !== notification.userId);
          }
        }
      })
    );
  }

  private subscribeToOnlineStatus(): void {
    this.subscriptions.push(
      this.chatService.onlineStatus$.subscribe(status => {
        console.log('User status:', status);
      })
    );
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  isOwnMessage(message: ChatMessage): boolean {
    return message.senderId === this.currentUserId;
  }

  formatTimestamp(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
