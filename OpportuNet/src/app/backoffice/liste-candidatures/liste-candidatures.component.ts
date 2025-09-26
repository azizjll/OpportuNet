import { Component, OnInit } from '@angular/core';
import { CandidatureService } from 'src/app/service/candidature.service';

@Component({
  selector: 'app-liste-candidatures',
  templateUrl: './liste-candidatures.component.html',
  styleUrls: ['./liste-candidatures.component.css']
})
export class ListeCandidaturesComponent implements OnInit {

  candidatures: any[] = [];

  constructor(private candidatureService: CandidatureService) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.candidatureService.getAllCandidatures(token).subscribe({
      next: (data) => {
        this.candidatures = data;
        console.log("Candidatures :", this.candidatures);
      },
      error: (err) => console.error("Erreur chargement candidatures", err)
    });
  }
}
