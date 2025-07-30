import { Component } from '@angular/core';
import { CandidatureService } from 'src/app/service/candidature.service';
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
  candidatures: any[] = [];
  constructor(private organisationService: OrganisationService,private candidatureService: CandidatureService) {}

  modalVisible = false;
selectedOffreId: number | null = null;

  ngOnInit(): void {
    this.loadMyOffres();
    this.loadCandidatures();
  }

    loadCandidatures() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      return;
    }
     this.candidatureService.getCandidaturesDeMesOffres(token).subscribe({
      next: (data) => this.candidatures = data,
      error: (err) => console.error('Erreur chargement candidatures', err)
    });
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

  console.log("Token utilisé :", token);
const offreSansId = { ...this.offre };
delete offreSansId.id;
console.log("Offre envoyée (sans id) :", offreSansId);
  this.organisationService.createOffre(this.offre, token).subscribe({
    next: res => {
      console.log("Réponse création offre :", res);
      alert("Offre créée avec succès !");
      this.loadMyOffres(); // Recharger les offres après création
    },
    error: err => {
      console.error("Erreur lors de la création :", err);
    }
  });
}


  openAjoutQuestions(offreId: number) {
  this.selectedOffreId = offreId;
  this.modalVisible = true;
}

fermerModal() {
  this.modalVisible = false;
  this.selectedOffreId = null;
}
}
