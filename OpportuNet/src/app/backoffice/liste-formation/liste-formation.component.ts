import { Component, OnInit } from '@angular/core';
import { FormationsService, Formation } from '../../service/formations.service';

@Component({
  selector: 'app-liste-formation',
  templateUrl: './liste-formation.component.html',
  styleUrls: ['./liste-formation.component.css']
})
export class ListeFormationComponent implements OnInit {

  formations: Formation[] = [];
  searchTitle: string = '';
  searchCategory: string = '';

  constructor(private formationsService: FormationsService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations() {
    this.formationsService.getAllFormations().subscribe({
      next: (data) => this.formations = data,
      error: (err) => console.error('Erreur chargement formations', err)
    });
  }

  onEditFormation(formation: Formation) {
    // Ici tu peux soit :
    // 1. Émettre un event vers AdminFormationsComponent
    // 2. Ou router vers une page "edit/:id"
    console.log('Éditer formation', formation);
  }

  onDeleteFormation(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      this.formationsService.deleteFormation(id).subscribe({
        next: () => {
          alert('Formation supprimée');
          this.loadFormations();
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }

  get filteredFormations(): Formation[] {
    return this.formations.filter(f => {
      const matchesTitle = f.titre.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesCategory = this.searchCategory ? f.categorie === this.searchCategory : true;
      return matchesTitle && matchesCategory;
    });
  }
}
