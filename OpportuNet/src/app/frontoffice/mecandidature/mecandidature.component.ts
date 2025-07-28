import { Component, OnInit } from '@angular/core';
import { CandidatureService } from 'src/app/service/candidature.service';

@Component({
  selector: 'app-mecandidature',
  templateUrl: './mecandidature.component.html',
  styleUrls: ['./mecandidature.component.css']
})
export class MecandidatureComponent implements OnInit {
  candidatures: any[] = [];

  constructor(private candidatureService: CandidatureService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); // récupère le token depuis le localStorage
    if (token) {
      this.candidatureService.getMesCandidatures(token).subscribe({
        next: (data) => this.candidatures = data,
        error: (err) => console.error('Erreur lors du chargement des candidatures', err)
      });
    }
  }
}
