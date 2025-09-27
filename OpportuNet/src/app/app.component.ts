import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, UserProfile } from './service/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private profileService: ProfileService) {}

  ngOnInit(): void {
    // Vérifier toutes les 10 secondes
    setInterval(() => {
      this.checkProfile();
    }, 10000);
  }

  checkProfile() {
    this.profileService.getUserProfile().subscribe(
      (user: UserProfile) => {
        // Vérifier que c'est un candidat
        if (user.role !== 'CANDIDAT') {
          return; // Ne rien faire si ce n'est pas un candidat
        }

        // Vérifier si l'utilisateur n'a pas encore d'expérience ou de parcours académique
        const hasNoExperience = !user.experiences || user.experiences.length === 0;
        const hasNoParcours = !user.parcoursAcademiques || user.parcoursAcademiques.length === 0;

        if (hasNoExperience || hasNoParcours) {
          alert('Veuillez compléter votre profil en ajoutant vos expériences et parcours académiques !');

          // Optionnel : rediriger vers la page profil
          // this.router.navigate(['/profile']);
        }
      },
      (error) => {
        console.error('Impossible de récupérer le profil', error);
      }
    );
  }
}
