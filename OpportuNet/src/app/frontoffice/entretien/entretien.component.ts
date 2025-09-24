import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EntretienService } from 'src/app/service/entretien.service';

@Component({
  selector: 'app-entretien',
  templateUrl: './entretien.component.html',
  styleUrls: ['./entretien.component.css']
})
export class EntretienComponent {

  @Input() candidateId!: number; // Id du candidat
  @Input() visible: boolean = false; // Contrôle la visibilité du popup
  @Output() close = new EventEmitter<void>(); // Pour fermer le popup après envoi

  description: string = '';
  date: string = ''; // format "YYYY-MM-DDTHH:mm"

  constructor(private entretienService: EntretienService) {}

  fermerPopup() {
    this.visible = false;
    this.description = '';
    this.date = '';
    this.close.emit();
  }

  envoyerEntretien() {
    if (!this.description || !this.date) {
      alert('Veuillez remplir la description et la date de l’entretien');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token manquant');
      return;
    }

   this.entretienService.fixerEntretien(this.description, this.date, token)

      .subscribe({
        next: (res) => {
          alert('Entretien fixé et email envoyé au candidat');
          this.fermerPopup();
        },
        error: (err) => {
          console.error('Erreur lors de la fixation de l’entretien', err);
          alert('Impossible de fixer l’entretien');
        }
      });
  }
}
