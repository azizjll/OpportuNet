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
}

