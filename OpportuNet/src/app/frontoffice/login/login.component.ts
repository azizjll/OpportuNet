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
      // Stocker le token si besoin
      localStorage.setItem('token', res.token);
      // Redirection vers /home
      this.router.navigate(['/home']);
    },
    error: (err) => {
      console.error('Erreur lors de la connexion', err);
      alert('Erreur de connexion');
    }
  });
}


  toggle() {
    this.toggleMode = !this.toggleMode;
    console.log("Mode changé :", this.toggleMode ? 'Sign up' : 'Sign in');
  }
}
