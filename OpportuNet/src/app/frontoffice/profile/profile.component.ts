import { Component, OnInit } from '@angular/core';
import { Experience, ParcoursAcademique, ProfileService, UserProfile } from 'src/app/service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile?: UserProfile;

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
    });
  }

  onAddExperience(): void {
    this.profileService.addExperience( this.newExperience).subscribe(exp => {
      this.userProfile?.experiences.push(exp);
      this.newExperience = { societe: '', titrePoste: '', mission: '', dateDebut: new Date(), dateFin: new Date() };
    });
  }

  onAddParcours(): void {
    this.profileService.addParcours( this.newParcours).subscribe(p => {
      this.userProfile?.parcoursAcademiques.push(p);
      this.newParcours = { ecole: '', diplome: '', dateDebut: new Date(), dateFin: new Date() };
    });
  }

  get hasExperiences(): boolean {
  return !!(this.userProfile && this.userProfile.experiences && this.userProfile.experiences.length > 0);
}

get hasParcours(): boolean {
  return !!(this.userProfile && this.userProfile.parcoursAcademiques && this.userProfile.parcoursAcademiques.length > 0);
}


}
