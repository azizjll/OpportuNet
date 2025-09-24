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

toggleDarkMode(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  console.log('Dark mode activé ?', checked);

  if (checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}




  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }


}
