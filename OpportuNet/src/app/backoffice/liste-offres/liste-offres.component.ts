import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OffreStage, OrganisationService } from 'src/app/service/organisation.service';

@Component({
  selector: 'app-liste-offres',
  templateUrl: './liste-offres.component.html',
  styleUrls: ['./liste-offres.component.css']
})
export class ListeOffresComponent implements  OnInit {
  offres: OffreStage[] = [];
  // Ajoute ces lignes
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<OffreStage>();
  @Output() ajoutQuestions = new EventEmitter<number>();

  constructor(private organisationService: OrganisationService) {}

  ngOnInit(): void {
    this.loadAllOffres();
  }

  loadAllOffres(): void {
    this.organisationService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data;
        console.log("Toutes les offres :", this.offres);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des offres :", err);
      }
    });
  }
}
