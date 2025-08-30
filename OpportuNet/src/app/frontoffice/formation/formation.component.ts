import { Component, OnInit } from '@angular/core';
import { FormationsService, Formation } from '../../service/formations.service';
import { AuthserviceService } from 'src/app/service/authservice.service';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit {

  formations: Formation[] = [];
  currentUser: any; // on stockera l'utilisateur ici

  constructor(
    private formationsService: FormationsService,
    private authService: AuthserviceService // <-- injection du service d'auth
  ) {}

  ngOnInit(): void {
    // Charger les formations
    this.formationsService.getAllFormations().subscribe(data => {
      this.formations = data;
    });

    // Charger l'utilisateur connecté (via ton backend)
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  goToPackets() {
    // rediriger vers ta page des packs
    window.location.href = '/Listpackets';
  }
}
