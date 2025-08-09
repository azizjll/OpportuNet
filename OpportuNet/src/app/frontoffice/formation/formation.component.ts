// src/app/frontoffice/formation/formation.component.ts
import { Component, OnInit } from '@angular/core';
import { FormationsService, Formation } from '../../service/formations.service';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit {

  formations: Formation[] = [];

  constructor(private formationsService: FormationsService) { }

  ngOnInit(): void {
    this.formationsService.getAllFormations().subscribe(data => {
      this.formations = data;
    });
  }
}
