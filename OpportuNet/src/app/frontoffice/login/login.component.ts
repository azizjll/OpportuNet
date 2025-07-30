import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthserviceService } from 'src/app/service/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  signupForm: FormGroup;
  signinForm: FormGroup;
  toggleMode: boolean = false;

  constructor(
    private authService: AuthserviceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize signup form with validations
    this.signupForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', Validators.required],
      role: ['CANDIDAT', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Initialize signin form with validations
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  signup() {
    if (this.signupForm.valid) {
      const user = {
        nom: this.signupForm.get('nom')?.value,
        prenom: this.signupForm.get('prenom')?.value,
        email: this.signupForm.get('email')?.value,
        motDePasse: this.signupForm.get('password')?.value,
        role: this.signupForm.get('role')?.value
      };

      this.authService.signup(user).subscribe({
        next: (res) => {
          console.log('Inscription réussie', res);
          alert('Inscription réussie');
          this.toggleMode = false;
          this.signupForm.reset({ role: 'CANDIDAT' });
        },
        error: (err) => {
          console.error('Erreur lors de l\'inscription', err);
          alert('Erreur lors de l\'inscription');
        }
      });
    }
  }

  signin() {
    if (this.signinForm.valid) {
      const loginData = {
        email: this.signinForm.get('email')?.value,
        motDePasse: this.signinForm.get('password')?.value
      };

      this.authService.signin(loginData).subscribe({
        next: (res) => {
          console.log('Connexion réussie', res);
          alert('Connexion réussie');
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
          this.signinForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de la connexion', err);
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
  }

  toggle() {
    this.toggleMode = !this.toggleMode;
    console.log("Mode changé :", this.toggleMode ? 'Sign up' : 'Sign in');
  }
}