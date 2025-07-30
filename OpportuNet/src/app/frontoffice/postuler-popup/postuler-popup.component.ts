import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidatureService } from 'src/app/service/candidature.service';
import { QuestionService } from 'src/app/service/question.service';

@Component({
  selector: 'app-postuler-popup',
  templateUrl: './postuler-popup.component.html'
})
export class PostulerPopupComponent {
  @Input() offre: any;
  @Output() close = new EventEmitter<void>();

  candidatureForm: FormGroup;
  etapeSuivante = false;
  candidatureId: number | null = null;
  questions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private candidatureService: CandidatureService,
    private questionService: QuestionService
  ) {
    this.candidatureForm = this.fb.group({
      cv: [null, [Validators.required, this.fileValidator()]],
      lettreMotivation: ['', [Validators.required, Validators.minLength(50)]],
      remarque: ['', [Validators.maxLength(200)]],
      statut: ['EN_ATTENTE']
    });
  }

  // Custom validator for file input
  fileValidator() {
    return (control: any) => {
      const file = control.value;
      if (!file) {
        return { fileRequired: true };
      }
      if (file instanceof File) {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
          return { fileType: true };
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
          return { maxSize: true };
        }
      }
      return null;
    };
  }

  postuler() {
    console.log("Méthode postuler() appelée");
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("Token manquant");
      return;
    }

    if (!this.offre?.id) {
      console.warn("L'offre est invalide");
      return;
    }

    if (this.candidatureForm.valid) {
      const formData = new FormData();
      formData.append('cv', this.candidatureForm.get('cv')?.value);
      formData.append('lettreMotivation', this.candidatureForm.get('lettreMotivation')?.value);
      formData.append('remarque', this.candidatureForm.get('remarque')?.value);
      formData.append('statut', this.candidatureForm.get('statut')?.value);

      this.candidatureService.postuler(this.offre.id, formData, token)
        .subscribe({
          next: (candidature: any) => {
            this.candidatureId = candidature.id;
            this.etapeSuivante = true;
            this.chargerQuestions(this.offre.id);
          },
          error: (err) => {
            alert("Erreur lors de l'envoi : " + err.error);
          }
        });
    }
  }

  chargerQuestions(offreId: number) {
    this.questionService.getQuestionsByOffre(offreId).subscribe({
      next: (questions) => {
        this.questions = questions;
        console.log("Questions chargées :", this.questions);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des questions :", err);
      }
    });
  }
}