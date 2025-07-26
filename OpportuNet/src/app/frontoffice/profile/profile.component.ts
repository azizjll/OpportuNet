import { Component, OnInit } from '@angular/core';
import { Experience, ParcoursAcademique, ProfileService, UserProfile } from 'src/app/service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile?: UserProfile;

  // Pour expérience
  editingExpId: number | null = null;
  tempExperience: Experience | null = null;

  // Pour parcours académique
  editingParcoursId: number | null = null;
  tempParcours: ParcoursAcademique | null = null;

  editingProfile = false;
  nomModifiable = '';
  prenomModifiable = '';
  emailModifiable = '';

  newExperience: Experience = {
    societe: '',
    titrePoste: '',
    mission: '',
    dateDebut: new Date(),
    dateFin: new Date()
  };

  newParcours: ParcoursAcademique = {
    ecole: '',
    diplome: '',
    dateDebut: new Date(),
    dateFin: new Date()
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe(profile => {
      this.userProfile = profile;
      this.nomModifiable = profile.nom;
      this.prenomModifiable = profile.prenom;
      this.emailModifiable = profile.email;
    });
  }

  // --- Expérience ---
  onAddExperience(): void {
    this.profileService.addExperience(this.newExperience).subscribe(exp => {
      this.userProfile?.experiences.push(exp);
      this.newExperience = { societe: '', titrePoste: '', mission: '', dateDebut: new Date(), dateFin: new Date() };
    });
  }

  onEditExperience(exp: Experience): void {
    this.editingExpId = exp.id!;
    this.tempExperience = { ...exp };
  }

  onCancelEditExperience(): void {
    this.editingExpId = null;
    this.tempExperience = null;
  }

  onUpdateExperience(): void {
    if (!this.editingExpId || !this.tempExperience) return;

    this.profileService.updateExperience(this.editingExpId, this.tempExperience).subscribe(updated => {
      const index = this.userProfile?.experiences.findIndex(e => e.id === this.editingExpId);
      if (index !== undefined && index !== -1 && this.userProfile) {
        this.userProfile.experiences[index] = updated;
      }
      this.editingExpId = null;
      this.tempExperience = null;
    });
  }

  // --- Parcours Académique ---
  onAddParcours(): void {
    this.profileService.addParcours(this.newParcours).subscribe(p => {
      this.userProfile?.parcoursAcademiques.push(p);
      this.newParcours = { ecole: '', diplome: '', dateDebut: new Date(), dateFin: new Date() };
    });
  }

  onEditParcours(parcours: ParcoursAcademique): void {
    this.editingParcoursId = parcours.id!;
    this.tempParcours = { ...parcours };
  }

  onCancelEditParcours(): void {
    this.editingParcoursId = null;
    this.tempParcours = null;
  }

  onUpdateParcours(): void {
    if (!this.editingParcoursId || !this.tempParcours) return;

    this.profileService.updateParcours(this.editingParcoursId, this.tempParcours).subscribe(updated => {
      const index = this.userProfile?.parcoursAcademiques.findIndex(p => p.id === this.editingParcoursId);
      if (index !== undefined && index !== -1 && this.userProfile) {
        this.userProfile.parcoursAcademiques[index] = updated;
      }
      this.editingParcoursId = null;
      this.tempParcours = null;
    });
  }

  // --- Profile general (inchangé) ---
  get hasExperiences(): boolean {
    return !!(this.userProfile && this.userProfile.experiences && this.userProfile.experiences.length > 0);
  }

  get hasParcours(): boolean {
    return !!(this.userProfile && this.userProfile.parcoursAcademiques && this.userProfile.parcoursAcademiques.length > 0);
  }

  onEditProfile(): void {
    if (!this.userProfile) return;
    this.editingProfile = true;
    this.nomModifiable = this.userProfile.nom;
    this.prenomModifiable = this.userProfile.prenom;
    this.emailModifiable = this.userProfile.email;
  }

  onCancelEditProfile(): void {
    this.editingProfile = false;
    if (this.userProfile) {
      this.nomModifiable = this.userProfile.nom;
      this.prenomModifiable = this.userProfile.prenom;
      this.emailModifiable = this.userProfile.email;
    }
  }

  onSaveProfile(): void {
    if (!this.userProfile) return;

    this.userProfile.nom = this.nomModifiable;
    this.userProfile.prenom = this.prenomModifiable;
    this.userProfile.email = this.emailModifiable;

    this.profileService.updateUserProfile(this.userProfile).subscribe(updated => {
      this.userProfile = updated;
      this.editingProfile = false;
    });
  }
}
