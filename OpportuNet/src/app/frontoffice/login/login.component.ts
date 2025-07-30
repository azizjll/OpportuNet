import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/service/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  toggleMode: boolean = false;

  signinEmail: string = '';
  signinPassword: string = '';

  role: string = 'CANDIDAT';

  constructor(private authService: AuthserviceService ,private router: Router) {}

  signup() {
    const user = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.password,
      role: this.role 
    };

    this.authService.signup(user).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        alert('Inscription réussie');
        // Bascule vers le formulaire de connexion
      this.toggleMode = false;
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription', err);
        alert('Erreur lors de l\'inscription');
      }
    });
  }

 signin() {
  const loginData = {
    email: this.signinEmail,
    motDePasse: this.signinPassword
  };

  this.authService.signin(loginData).subscribe({
    next: (res) => {
      console.log('Connexion réussie', res);
      alert('Connexion réussie');
      localStorage.setItem('token', res.token);
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('Erreur lors de la connexion', err);

      // Gestion des erreurs HTTP précises
      if (err.status === 401) {
        alert(err.error.message || 'Email ou mot de passe invalide');
      } else if (err.status === 403) {
        alert(err.error.message || 'Accès refusé : vérification ou approbation requise.');
      } else {
        alert('Erreur inattendue, veuillez réessayer plus tard.');
      }
    }
  });
}




  toggle() {
    this.toggleMode = !this.toggleMode;
    console.log("Mode changé :", this.toggleMode ? 'Sign up' : 'Sign in');
  }
}
