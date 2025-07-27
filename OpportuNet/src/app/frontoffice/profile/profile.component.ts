import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Experience, ParcoursAcademique, ProfileService, UserProfile } from 'src/app/service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  userProfile?: UserProfile;

  profileForm!: FormGroup;
  newExpForm!: FormGroup;
  newParcoursForm!: FormGroup;
  editExpForm!: FormGroup;
  editParcoursForm!: FormGroup;

  editingProfile = false;
  editingExpId: number | null = null;
  editingParcoursId: number | null = null;

  constructor(private profileService: ProfileService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForms();

    this.profileService.getUserProfile().subscribe(profile => {
      this.userProfile = profile;
      this.profileForm.patchValue({
        nom: profile.nom,
        prenom: profile.prenom,
        email: profile.email
      });
    });

    // Forcer la mise à jour des validateurs pour chaque changement
    this.profileForm.valueChanges.subscribe(() => this.profileForm.updateValueAndValidity());
    this.newExpForm.valueChanges.subscribe(() => this.newExpForm.updateValueAndValidity());
    this.newParcoursForm.valueChanges.subscribe(() => this.newParcoursForm.updateValueAndValidity());
    this.editExpForm.valueChanges.subscribe(() => this.editExpForm.updateValueAndValidity());
    this.editParcoursForm.valueChanges.subscribe(() => this.editParcoursForm.updateValueAndValidity());
  }

  private buildForms(): void {
    this.profileForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.newExpForm = this.fb.group({
      societe: ['', [Validators.required, Validators.minLength(2)]],
      titrePoste: ['', [Validators.required, Validators.minLength(2)]],
      mission: ['', [Validators.required, Validators.minLength(5)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    }, { validators: this.dateRangeValidator });

    this.newParcoursForm = this.fb.group({
      ecole: ['', [Validators.required, Validators.minLength(2)]],
      diplome: ['', [Validators.required, Validators.minLength(2)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    }, { validators: this.dateRangeValidator });

    this.editExpForm = this.fb.group({
      societe: ['', [Validators.required, Validators.minLength(2)]],
      titrePoste: ['', [Validators.required, Validators.minLength(2)]],
      mission: ['', [Validators.required, Validators.minLength(5)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    }, { validators: this.dateRangeValidator });

    this.editParcoursForm = this.fb.group({
      ecole: ['', [Validators.required, Validators.minLength(2)]],
      diplome: ['', [Validators.required, Validators.minLength(2)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  private dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const start = group.get('dateDebut')?.value;
    const end = group.get('dateFin')?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { dateRange: true };
    }
    return null;
  }

  // ----- Profil -----
  onEditProfile(): void {
    this.editingProfile = true;
  }

  onCancelEditProfile(): void {
    this.editingProfile = false;
    if (this.userProfile) {
      this.profileForm.reset({
        nom: this.userProfile.nom,
        prenom: this.userProfile.prenom,
        email: this.userProfile.email
      });
    }
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid || !this.userProfile) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updated = { ...this.userProfile, ...this.profileForm.value };
    this.profileService.updateUserProfile(updated).subscribe(resp => {
      this.userProfile = resp;
      this.editingProfile = false;
    });
  }

  // ----- Expériences -----
  get hasExperiences(): boolean {
    return !!(this.userProfile?.experiences?.length);
  }

  onAddExperience(): void {
    if (this.newExpForm.invalid) {
      this.newExpForm.markAllAsTouched();
      return;
    }

    const exp: Experience = this.newExpForm.value;
    this.profileService.addExperience(exp).subscribe(added => {
      if (this.userProfile) {
        this.userProfile.experiences = this.userProfile.experiences || [];
        this.userProfile.experiences.push(added);
        this.newExpForm.reset();
      }
    });
  }

  onEditExperience(exp: Experience): void {
    this.editingExpId = exp.id!;
    this.editExpForm.patchValue({
      societe: exp.societe,
      titrePoste: exp.titrePoste,
      mission: exp.mission,
      dateDebut: exp.dateDebut,
      dateFin: exp.dateFin
    });
  }

  onCancelEditExperience(): void {
    this.editingExpId = null;
    this.editExpForm.reset();
  }

  onUpdateExperience(): void {
    if (!this.editingExpId || this.editExpForm.invalid) {
      this.editExpForm.markAllAsTouched();
      return;
    }

    const payload: Experience = this.editExpForm.value;
    this.profileService.updateExperience(this.editingExpId, payload).subscribe(updated => {
      if (this.userProfile) {
        const index = this.userProfile.experiences.findIndex(e => e.id === this.editingExpId);
        if (index !== -1) {
          this.userProfile.experiences[index] = updated;
        }
        this.editingExpId = null;
        this.editExpForm.reset();
      }
    });
  }

  // ----- Parcours -----
  get hasParcours(): boolean {
    return !!(this.userProfile?.parcoursAcademiques?.length);
  }

  onAddParcours(): void {
    if (this.newParcoursForm.invalid) {
      this.newParcoursForm.markAllAsTouched();
      return;
    }

    const p: ParcoursAcademique = this.newParcoursForm.value;
    this.profileService.addParcours(p).subscribe(saved => {
      if (this.userProfile) {
        this.userProfile.parcoursAcademiques = this.userProfile.parcoursAcademiques || [];
        this.userProfile.parcoursAcademiques.push(saved);
        this.newParcoursForm.reset();
      }
    });
  }

  onEditParcours(parcours: ParcoursAcademique): void {
    this.editingParcoursId = parcours.id!;
    this.editParcoursForm.patchValue({
      ecole: parcours.ecole,
      diplome: parcours.diplome,
      dateDebut: parcours.dateDebut,
      dateFin: parcours.dateFin
    });
  }

  onCancelEditParcours(): void {
    this.editingParcoursId = null;
    this.editParcoursForm.reset();
  }

  onUpdateParcours(): void {
    if (!this.editingParcoursId || this.editParcoursForm.invalid) {
      this.editParcoursForm.markAllAsTouched();
      return;
    }

    const payload: ParcoursAcademique = this.editParcoursForm.value;
    this.profileService.updateParcours(this.editingParcoursId, payload).subscribe(updated => {
      if (this.userProfile) {
        const index = this.userProfile.parcoursAcademiques.findIndex(p => p.id === this.editingParcoursId);
        if (index !== -1) {
          this.userProfile.parcoursAcademiques[index] = updated;
        }
        this.editingParcoursId = null;
        this.editParcoursForm.reset();
      }
    });
  }

  f = (group: FormGroup, control: string) => {
    const ctrl = group.get(control);
    if (!ctrl) {
      console.error(`Control ${control} not found in form group`);
      return null;
    }
    return ctrl;
  };
}