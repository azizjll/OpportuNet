import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Variables pour le formulaire de sign-up
  
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  toggleMode: boolean = false;


  // Variables pour le formulaire de sign-in
  signinEmail: string = '';
  signinPassword: string = '';

  constructor() {}

  // Méthode appelée au clic sur le bouton "Sign up"
  signup() {
    console.log('Inscription avec :', this.nom, this.prenom, this.email, this.password);
    // Tu peux appeler ton AuthService ici
  }

  // Méthode pour la connexion si tu la réactives plus tard
  signin() {
    console.log('Connexion avec :', this.signinEmail, this.signinPassword);
  }

  toggle() {
  this.toggleMode = !this.toggleMode;
  console.log("Mode changé :", this.toggleMode ? 'Sign up' : 'Sign in');
}
}
