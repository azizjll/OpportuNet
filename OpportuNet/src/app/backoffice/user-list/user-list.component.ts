import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  loading = true;
  error: string | null = null;
  message: string | null = null; // <-- message spécifique

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les utilisateurs.';
        this.loading = false;
      }
    });
  }

  acceptUser(id: number) {
    this.userService.acceptUser(id).subscribe({
      next: () => {
        this.message = 'Utilisateur accepté avec succès !';
        this.loadUsers();
        this.clearMessage();
      },
      error: () => {
        this.message = 'Erreur lors de l’acceptation de l’utilisateur.';
        this.clearMessage();
      }
    });
  }

  verifyUser(id: number) {
    this.userService.verifyUser(id).subscribe({
      next: () => {
        this.message = 'Utilisateur vérifié avec succès !';
        this.loadUsers();
        this.clearMessage();
      },
      error: () => {
        this.message = 'Erreur lors de la vérification de l’utilisateur.';
        this.clearMessage();
      }
    });
  }

  blockUser(id: number) {
    this.userService.blockUser(id).subscribe({
      next: () => {
        this.message = 'Utilisateur bloqué avec succès !';
        this.loadUsers();
        this.clearMessage();
      },
      error: () => {
        this.message = 'Erreur lors du blocage de l’utilisateur.';
        this.clearMessage();
      }
    });
  }

  clearMessage() {
    setTimeout(() => {
      this.message = null;
    }, 3000); // le message disparaît après 3 secondes
  }


  deleteUser(id: number) {
  if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.message = 'Utilisateur supprimé avec succès !';
        this.loadUsers();
        this.clearMessage();
      },
      error: () => {
        this.message = 'Erreur lors de la suppression de l’utilisateur.';
        this.clearMessage();
      }
    });
  }
}
searchText: string = ''; // Texte saisi dans la barre de recherche

get filteredUsers() {
  if (!this.searchText) return this.users;
  const search = this.searchText.toLowerCase();
  return this.users.filter(user =>
    (user.nom && user.nom.toLowerCase().includes(search)) ||
    (user.prenom && user.prenom.toLowerCase().includes(search)) ||
    (user.email && user.email.toLowerCase().includes(search)) ||
    (user.isVerified !== null && 
      (user.isVerified ? 'vérifié' : 'non vérifié').includes(search))
  );
}

}
