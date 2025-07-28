import { Component, OnInit } from '@angular/core';
import { OffreStage, OrganisationService } from 'src/app/service/organisation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  offres: OffreStage[] = [];

  constructor(private organisationService: OrganisationService) {}

ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (token) {
    this.organisationService.getAllOffres(token).subscribe({
      next: (res) => this.offres = res,
      error: (err) => console.error('Erreur chargement offres', err)
    });
  } else {
    console.error('Token manquant, impossible de charger les offres');
  }
}

  selectedOffre: any = null;
  showPopup: boolean = false;

ouvrirPopup(offre: any) {
    this.selectedOffre = offre;
    this.showPopup = true;
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

