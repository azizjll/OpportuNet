import { Component } from '@angular/core';
import { OffreStage, OrganisationService } from 'src/app/service/organisation.service';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent {

  offre: OffreStage = {
    titre: '',
    description: '',
    type: 'STAGE',
    dateDebut: '',
    dateFin: '',
    etat: 'EN_ATTENTE'
  };

  mesOffres: OffreStage[] = [];
  constructor(private organisationService: OrganisationService) {}

  ngOnInit(): void {
    this.loadMyOffres();
  }

   loadMyOffres() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.organisationService.getMyOffres(token).subscribe({
      next: (offres) => this.mesOffres = offres,
      error: (err) => console.error('Erreur lors du chargement des offres', err)
    });
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token manquant. Vous devez être connecté.");
      return;
    }

    this.organisationService.createOffre(this.offre, token).subscribe({
      next: res => {
        alert("Offre créée avec succès !");
        this.loadMyOffres(); // ⬅️ recharger les offres après création
      },
      error: err => {
        console.error("Erreur lors de la création :", err);
      }
    });
  }
}
