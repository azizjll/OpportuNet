import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      cv: [''],
      lettreMotivation: [''],
      remarque: [''],
      statut: ['EN_ATTENTE']
    });
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

    this.candidatureService.postuler(this.offre.id, this.candidatureForm.value, token)
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
