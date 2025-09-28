import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from 'src/app/service/authservice.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword() {
    if (!this.newPassword) {
      alert("Veuillez entrer un nouveau mot de passe");
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        alert("Mot de passe réinitialisé avec succès !");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert("Erreur : " + err.error.message);
      }
    });
  }
}
