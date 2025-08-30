import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from 'src/app/service/authservice.service';  // ← corriger le nom ici

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
    userRole: string | null = null;

  constructor(private router: Router, private authService: AuthserviceService) {
    this.userRole = this.authService.getUserRole();
        console.log('Role utilisateur :', this.userRole); // debug

  } // ← nom correct

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
