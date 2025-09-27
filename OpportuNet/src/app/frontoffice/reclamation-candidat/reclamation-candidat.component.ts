import { Component, OnInit } from '@angular/core';
import { ReclamationService, Reclamation } from '../../service/reclamation.service';

@Component({
  selector: 'app-reclamation-candidat',
  templateUrl: './reclamation-candidat.component.html',
  styleUrls: ['./reclamation-candidat.component.css']
})
export class ReclamationCandidatComponent implements OnInit {

  reclamations: Reclamation[] = [];
  nouvelleReclamation: Reclamation = { sujet: '', description: '', type: 'TECHNIQUE' };
  reponseTexte: string = '';

  constructor(private reclamationService: ReclamationService) { }

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations() {
    this.reclamationService.getMesReclamations().subscribe(data => {
      this.reclamations = data;
    });
  }

  creerReclamation() {
    this.reclamationService.creerReclamation(this.nouvelleReclamation).subscribe(() => {
      this.nouvelleReclamation = { sujet: '', description: '', type: 'TECHNIQUE' };
      this.loadReclamations();
    });
  }

  

  

}
