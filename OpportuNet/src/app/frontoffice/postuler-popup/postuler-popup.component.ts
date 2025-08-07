import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.candidatureForm.patchValue({ cv: file });
      this.candidatureForm.get('cv')?.updateValueAndValidity();
    }
  }

  fileValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return { fileRequired: true };

      if (file instanceof File) {
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!validTypes.includes(file.type)) return { fileType: true };
        if (file.size > 5 * 1024 * 1024) return { maxSize: true };
      }

      return null;
    };
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

  soumettreTout() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté.");
      return;
    }

    if (!this.offre?.id) {
      alert("Offre non valide.");
      return;
    }

    if (!this.etapeSuivante) {
      // Étape 1 : valider le formulaire et passer aux questions
      if (this.candidatureForm.invalid) {
        this.candidatureForm.markAllAsTouched();
        alert("Veuillez remplir correctement le formulaire.");
        return;
      }

      this.etapeSuivante = true;
      this.chargerQuestions(this.offre.id);
      return;
    }

    // Étape 2 : valider les réponses aux questions et tout soumettre
    const toutesRepondues = this.questions.every(q => q.reponse && q.reponse.trim().length > 0);
    if (!toutesRepondues) {
      alert("Veuillez répondre à toutes les questions.");
      return;
    }

    const formData = new FormData();
    formData.append('cv', this.candidatureForm.get('cv')?.value);
    formData.append('lettreMotivation', this.candidatureForm.get('lettreMotivation')?.value);
    formData.append('remarque', this.candidatureForm.get('remarque')?.value);
    formData.append('statut', this.candidatureForm.get('statut')?.value);

    this.candidatureService.postuler(this.offre.id, formData, token).subscribe({
      next: (candidature: any) => {
        this.candidatureId = candidature.id;

        if (this.candidatureId !== null) {
          this.questionService.soumettreReponses(this.candidatureId, this.questions).subscribe({
            next: () => {
              alert("✅ Candidature complète et réponses envoyées.");
              this.close.emit();
            },
            error: (err) => {
              alert("Erreur lors de l'envoi des réponses : " + (err.error?.message || err.message));
            }
          });
        } else {
          alert("Erreur : candidatureId est null.");
        }
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message === "Vous avez déjà postulé à cette offre.") {
          alert("⚠️ Vous avez déjà postulé à cette offre.");
        } else {
          alert("Erreur lors de la candidature : " + (err.error?.message || err.message));
        }
      }
    });
  }
}
