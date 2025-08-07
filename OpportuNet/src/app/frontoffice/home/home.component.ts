import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/service/authservice.service';
import { CandidatureService } from 'src/app/service/candidature.service';
import { OffreStage, OrganisationService } from 'src/app/service/organisation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  offres: OffreStage[] = [];

  constructor(private organisationService: OrganisationService ,private authService: AuthserviceService,private candidatureService: CandidatureService,
  private router: Router) {}

ngOnInit(): void {
  this.organisationService.getAllOffres().subscribe({
    next: (res) => this.offres = res,
    error: (err) => console.error('Erreur chargement offres', err)
  });
}



  selectedOffre: any = null;
  showPopup: boolean = false;

ouvrirPopup(offre: any) {
  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/login']);
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Utilisateur non authentifié.");
    return;
  }

  this.candidatureService.checkCandidatureExiste(offre.id, token).subscribe({
    next: (dejaPostule: boolean) => {
      if (dejaPostule) {
        alert("⚠️ Vous avez déjà postulé à cette offre.");
      } else {
        this.selectedOffre = offre;
        this.showPopup = true;
      }
    },
    error: (err) => {
      console.error("Erreur lors de la vérification de la candidature :", err);
      alert("Erreur lors de la vérification de la candidature.");
    }
  });
}



  fermerPopup() {
    this.showPopup = false;
    this.selectedOffre = null;
  }


 /*ouvrirPopup(offre: any): void {
    console.log('Offre sélectionnée :', offre);
    // Tu peux ici ouvrir un modal, rediriger, ou traiter les données
    alert(`Vous avez cliqué sur : ${offre.titre}`);
  }*/



}

