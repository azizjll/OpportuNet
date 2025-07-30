import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { QuestionService, Question } from 'src/app/service/question.service';

@Component({
  selector: 'app-ajout-question-modal',
  templateUrl: './ajout-question-modal.component.html'
})
export class AjoutQuestionModalComponent {
  @Input() offreId!: number;
  @Output() close = new EventEmitter();
  @Output() saved = new EventEmitter();

  form: FormGroup;

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.form = this.fb.group({
      questions: this.fb.array([this.createQuestion()])
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      contenu: ['']
    });
  }

  ajouterQuestion() {
    this.questions.push(this.createQuestion());
  }

  supprimerQuestion(i: number) {
    this.questions.removeAt(i);
  }

  submit() {
  const data: Question[] = this.form.value.questions;
  console.log('Données envoyées :', data);

  this.questionService.ajouterQuestions(this.offreId, data).subscribe({
    next: () => {
      alert('Questions ajoutées avec succès');
      this.saved.emit();
      this.close.emit();
    },
    error: err => {
      console.error(err);
      alert('Erreur lors de l\'enregistrement des questions');
    }
  });
}

}
