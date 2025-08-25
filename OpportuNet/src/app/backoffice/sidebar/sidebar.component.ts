import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from 'src/app/service/authservice.service';  // ← corriger le nom ici

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private router: Router, private authService: AuthserviceService) {} // ← nom correct

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
