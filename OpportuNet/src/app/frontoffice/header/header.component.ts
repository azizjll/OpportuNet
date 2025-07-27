// src/app/header/header.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/service/authservice.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [], 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService: AuthserviceService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('token');
        // Rediriger vers la page de connexion
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
        // Supprimer le token et rediriger même en cas d'erreur
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}