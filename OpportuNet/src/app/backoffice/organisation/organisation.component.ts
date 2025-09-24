import { Component } from '@angular/core';
import { AuthserviceService } from 'src/app/service/authservice.service';
import { CandidatureService } from 'src/app/service/candidature.service';
import { EntretienService } from 'src/app/service/entretien.service';
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

  nbStages: number = 0;
nbEmplois: number = 0;
nbCandidats: number = 0;
nbEncadrants: number = 0;


  popupEncadrantVisible = false;
encadrant = { nom: '', prenom: '', email: '' };
offreSelectionneeId: number | null = null;


  mesOffres: OffreStage[] = [];
  candidatures: any[] = [];
  reponsesMap: { [key: number]: any[] } = {};
    dateInvalide: boolean = false;  

      messageSucces: string = '';      // pour le message succès

      isEditing: boolean = false; // <- indicateur
editingId?: number



  constructor(private organisationService: OrganisationService,private candidatureService: CandidatureService,private questionService: QuestionService,private authService: AuthserviceService,private entretienService: EntretienService  ) {}

  modalVisible = false;
  questionsVisible: { [key: number]: boolean } = {};

selectedOffreId: number | null = null;

ouvrirPopupEncadrant(offreId: number) {
  this.offreSelectionneeId = offreId;
  this.popupEncadrantVisible = true;
}

fermerPopupEncadrant() {
  this.popupEncadrantVisible = false;
  this.encadrant = { nom: '', prenom: '', email: '' };
  this.offreSelectionneeId = null;
}


// ====================== Variables pour popup entretien ======================
popupEntretienVisible: boolean = false;
selectedCandidature: any = null;
entretienDescription: string = '';
entretienDate: string = ''; // format "YYYY-MM-DDTHH:mm"

// ====================== Méthodes pour ouvrir/fermer popup ======================
ouvrirPopupEntretien(candidature: any) {
  this.selectedCandidature = candidature;
  this.entretienDescription = '';
  this.entretienDate = '';
  this.popupEntretienVisible = true;
}

fermerPopupEntretien() {
  this.popupEntretienVisible = false;
  this.selectedCandidature = null;
  this.entretienDescription = '';
  this.entretienDate = '';
}

// ====================== Méthode pour envoyer entretien ======================
envoyerEntretien() {
  if (!this.selectedCandidature || !this.entretienDescription || !this.entretienDate) {
    alert('Veuillez remplir la description et la date de l’entretien');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token manquant');
    return;
  }

  this.entretienService.fixerEntretien(
    this.entretienDescription,
    this.entretienDate,
    token
  ).subscribe({
    next: (res) => {
      alert('Entretien fixé et email envoyé au candidat');
      this.fermerPopupEntretien();
    },
    error: (err) => {
      console.error('Erreur lors de la fixation de l’entretien', err);
      alert('Impossible de fixer l’entretien');
    }
  });
}



loadStats() {
  // STAGE et EMPLOI
  this.nbStages = this.mesOffres.filter(o => o.type === 'STAGE').length;
  this.nbEmplois = this.mesOffres.filter(o => o.type === 'EMPLOI').length;

  // Candidats
  this.nbCandidats = this.candidatures.length;

  // Encadrants (uniques)
  const encadrants = this.mesOffres
    .map(o => o.encadrant)
    .filter(e => e != null) as any[];
  const uniqueEncadrants = new Map<number, any>();
  encadrants.forEach(e => {
    if (e.id && !uniqueEncadrants.has(e.id)) uniqueEncadrants.set(e.id, e);
  });
  this.nbEncadrants = uniqueEncadrants.size;
}







ajouterEncadrant() {
  const { nom, prenom, email } = this.encadrant;
  if (!nom || !prenom || !email) {
    alert('Tous les champs sont obligatoires');
    return;
  }

  const token = this.authService.getToken();
  if (!token) {
    alert('Vous devez être connecté pour effectuer cette action');
    return;
  }

  if (this.offreSelectionneeId == null) {
    alert('Offre non sélectionnée');
    return;
  }

  this.organisationService.assignEncadrant(this.offreSelectionneeId, nom, prenom, email, token)
    .subscribe({
      next: (res) => {
        alert('Encadrant ajouté et assigné à l’offre');
        this.fermerPopupEncadrant();
      },
      error: (err) => {
        console.error('Erreur ajout encadrant', err);
        alert('Erreur lors de l’ajout de l’encadrant');
      }
    });
}



  ngOnInit(): void {
    this.loadMyOffres();
    this.loadCandidatures();
  }

    loadCandidatures() {
  const token = localStorage.getItem('token');
  if (!token) return;

  this.candidatureService.getCandidaturesDeMesOffres(token).subscribe({
    next: (data) => {
      this.candidatures = data;
      this.loadStats(); // ⚡ Met à jour les stats
    },
    error: (err) => console.error('Erreur chargement candidatures', err)
  });
  }

   loadMyOffres() {
  const token = localStorage.getItem('token');
  if (!token) return;

  this.organisationService.getMyOffres(token).subscribe({
    next: (offres) => {
      this.mesOffres = offres;
      this.loadStats(); // ⚡ Met à jour les stats
    },
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



onSubmit(form?: any) {
  const token = localStorage.getItem('token');
  if (!token) return;

  // Vérifier champs obligatoires
  if (!this.offre.titre || !this.offre.description || !this.offre.dateDebut || !this.offre.dateFin) {
    return;
  }

  const debut = new Date(this.offre.dateDebut);
  const fin = new Date(this.offre.dateFin);

  if (debut >= fin) {
    this.dateInvalide = true;
    return;
  } else {
    this.dateInvalide = false;
  }

  if (this.isEditing && this.editingId) {
    // ⚡ Modification
    this.organisationService.updateOffre(this.editingId, this.offre, token).subscribe({
      next: res => {
        alert('✅ Offre modifiée avec succès !');
        this.loadMyOffres();
        form?.resetForm();
        this.isEditing = false;
        this.editingId = undefined;
        this.offre = { titre: '', description: '', type: 'STAGE', dateDebut: '', dateFin: '', etat: 'EN_ATTENTE' };
      },
      error: err => {
        console.error("❌ Erreur lors de la modification :", err);
        alert("❌ Impossible de modifier l'offre.");
      }
    });
  } else {
    // ⚡ Création
    const offreSansId = { ...this.offre };
    delete (offreSansId as any).id;

    this.organisationService.createOffre(offreSansId, token).subscribe({
      next: res => {
        alert("✅ Offre créée avec succès !");
        this.loadMyOffres();
        form?.resetForm();
        this.offre = { titre: '', description: '', type: 'STAGE', dateDebut: '', dateFin: '', etat: 'EN_ATTENTE' };
      },
      error: err => {
        console.error("❌ Erreur lors de la création :", err);
        alert("❌ Impossible de créer l'offre.");
      }
    });
  }
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

// Supprimer une offre
supprimerOffre(offreId: number) {
  if (!confirm("⚠️ Voulez-vous vraiment supprimer cette offre ?")) return;

  const token = localStorage.getItem('token');
  if (!token) return;

  this.organisationService.deleteOffre(offreId, token).subscribe({
    next: () => {
      alert("✅ Offre supprimée !");
      this.loadMyOffres();
    },
    error: err => {
      console.error("❌ Erreur lors de la suppression :", err);
      alert("❌ Impossible de supprimer l'offre.");
    }
  });
}

// Modifier une offre (exemple simple pour pré-remplir le formulaire)
modifierOffre(offre: OffreStage) {
  this.offre = { ...offre };   // remplit le formulaire
  this.isEditing = true;        // active le mode édition
  this.editingId = offre.id;    // conserve l'id de l'offre
  window.scrollTo({ top: 0, behavior: 'smooth' });
}




}
