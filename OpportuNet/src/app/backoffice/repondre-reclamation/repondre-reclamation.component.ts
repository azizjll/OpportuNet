import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Reclamation, ReclamationService } from 'src/app/service/reclamation.service';

@Component({
  selector: 'app-repondre-reclamation',
  templateUrl: './repondre-reclamation.component.html',
  styleUrls: ['./repondre-reclamation.component.css']
})
export class RepondreReclamationComponent {

  @Input() reclamation!: Reclamation;   // réclamation sur laquelle on répond
  @Output() reponseEnvoyee = new EventEmitter<void>(); // notifier le parent
  reponseTexte: string = '';

  constructor(private reclamationService: ReclamationService) { }

  envoyerReponse() {
    if (!this.reponseTexte) return;
    this.reclamationService.repondreReclamation(this.reclamation.id!, this.reponseTexte)
      .subscribe(() => {
        this.reponseTexte = '';
        this.reponseEnvoyee.emit();
      });
  }
}
