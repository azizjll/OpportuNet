import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CandidatureService } from 'src/app/service/candidature.service';

@Component({
  selector: 'app-postuler-popup',
  templateUrl: './postuler-popup.component.html'
})
export class PostulerPopupComponent {
  @Input() offre: any;
  @Output() close = new EventEmitter<void>();

  candidatureForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private candidatureService: CandidatureService
  ) {
    this.candidatureForm = this.fb.group({
      cv: [''],
      lettreMotivation: [''],
      remarque: [''],
      statut: ['EN_ATTENTE']
    });
  }

  postuler() {
  console.log("Méthode postuler() appelée"); // Debug ici
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("Token manquant");
    return;
  }

  this.candidatureService.postuler(this.offre.id, this.candidatureForm.value, token)
    .subscribe({
      next: (res) => {
        alert("Candidature envoyée avec succès !");
        this.close.emit();
      },
      error: (err) => {
        alert("Erreur lors de l'envoi : " + err.error);
      }
    });
}

}
