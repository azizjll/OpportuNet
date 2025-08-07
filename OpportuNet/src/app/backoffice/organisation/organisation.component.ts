import { Component } from '@angular/core';
import { CandidatureService } from 'src/app/service/candidature.service';
import { OffreStage, OrganisationService } from 'src/app/service/organisation.service';
import { QuestionService } from 'src/app/service/question.service';

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
  reponsesMap: { [key: number]: any[] } = {};


  constructor(private organisationService: OrganisationService,private candidatureService: CandidatureService,private questionService: QuestionService ) {}

  modalVisible = false;
  questionsVisible: { [key: number]: boolean } = {};

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

loadQuestionsEtReponses(candidature: any) {
  const candidatureId = candidature.id;

  // Toggle de la visibilité
  this.questionsVisible[candidatureId] = !this.questionsVisible[candidatureId];

  // Si déjà visible, on ne recharge pas les données
  if (this.questionsVisible[candidatureId] && !this.reponsesMap[candidatureId]) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      return;
    }

    const offreId = candidature.offre.id;

    this.questionService.getQuestionsEtReponses(offreId, candidatureId, token).subscribe({
      next: (data) => {
        this.reponsesMap[candidatureId] = data;
      },
      error: (err) => console.error('Erreur chargement des réponses', err)
    });
  }
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

changerStatut(candidatureId: number, nouveauStatut: string) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("Token manquant");
    return;
  }

  this.candidatureService.changerStatutCandidature(candidatureId, nouveauStatut, token).subscribe({
    next: () => {
      const candidature = this.candidatures.find(c => c.id === candidatureId);
      if (candidature) {
        candidature.statut = nouveauStatut;
      }
      console.log('Statut mis à jour avec succès');
    },
    error: (err) => {
      console.error('Erreur lors du changement de statut', err);
    }
  });
}


}
