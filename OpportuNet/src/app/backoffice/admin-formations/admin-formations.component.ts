import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationsService, Formation } from '../../service/formations.service';

@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
  styleUrls: ['./admin-formations.component.css']
})
export class AdminFormationsComponent implements OnInit {

  formationForm!: FormGroup;
  formations: Formation[] = [];
  editMode: boolean = false;
  editFormationId: number | null = null;

  // Fichiers uploadés
  selectedFiles: { [key: string]: File | null } = {
    pdf: null,
    video: null,
    image: null
  };

  // Messages d'erreur fichiers
  pdfError = '';
  videoError = '';
  imageError = '';

  // Recherche
  searchTitle: string = '';
  searchCategory: string = '';

  constructor(private fb: FormBuilder, private formationsService: FormationsService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadFormations();
  }

 


  initForm() {
    this.formationForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categorie: ['', Validators.required]
    });
  }

  onFileChange(event: any, fileType: 'pdf' | 'video' | 'image') {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      if (fileType === 'pdf') {
        if (file.type !== 'application/pdf') {
          this.pdfError = 'Veuillez sélectionner un fichier PDF valide.';
          this.selectedFiles['pdf'] = null;
        } else {
          this.selectedFiles['pdf'] = file;
          this.pdfError = '';
        }
      }

      if (fileType === 'video') {
        if (!file.type.startsWith('video/')) {
          this.videoError = 'Veuillez sélectionner une vidéo valide.';
          this.selectedFiles['video'] = null;
        } else {
          this.selectedFiles['video'] = file;
          this.videoError = '';
        }
      }

      if (fileType === 'image') {
        if (!file.type.startsWith('image/')) {
          this.imageError = 'Veuillez sélectionner une image valide.';
          this.selectedFiles['image'] = null;
        } else {
          this.selectedFiles['image'] = file;
          this.imageError = '';
        }
      }
    }
  }

  onSubmit() {
    this.pdfError = '';
    this.videoError = '';
    this.imageError = '';

    if (!this.selectedFiles['pdf']) this.pdfError = 'Le PDF est obligatoire.';
    if (!this.selectedFiles['video']) this.videoError = 'La vidéo est obligatoire.';
    if (!this.selectedFiles['image']) this.imageError = 'L\'image est obligatoire.';

    if (this.formationForm.invalid || !this.selectedFiles['pdf'] || !this.selectedFiles['video'] || !this.selectedFiles['image']) {
      return;
    }

    const formData = new FormData();
    formData.append('titre', this.formationForm.get('titre')?.value);
    formData.append('description', this.formationForm.get('description')?.value);
    formData.append('categorie', this.formationForm.get('categorie')?.value);
    formData.append('pdf', this.selectedFiles['pdf'] as File);
    formData.append('video', this.selectedFiles['video'] as File);
    formData.append('image', this.selectedFiles['image'] as File);

    if (this.editMode && this.editFormationId !== null) {
      this.formationsService.updateFormation(this.editFormationId, formData).subscribe({
        next: () => {
          alert('Formation modifiée avec succès !');
          this.resetForm();
          this.loadFormations();
        },
        error: (err) => {
          alert('Erreur lors de la modification');
          console.error(err);
        }
      });
    } else {
      this.formationsService.createFormation(formData).subscribe({
        next: () => {
          alert('Formation ajoutée avec succès !');
          this.resetForm();
          this.loadFormations();
        },
        error: (err) => {
          alert('Erreur lors de l\'ajout');
          console.error(err);
        }
      });
    }
  }

  resetForm() {
    this.formationForm.reset();
    this.selectedFiles = { pdf: null, video: null, image: null };
    this.editMode = false;
    this.editFormationId = null;
    this.pdfError = '';
    this.videoError = '';
    this.imageError = '';
  }

  loadFormations() {
    this.formationsService.getAllFormations().subscribe({
      next: (data) => this.formations = data,
      error: (err) => console.error('Erreur chargement formations', err)
    });
  }

  onEditFormation(formation: Formation) {
    this.editMode = true;
    this.editFormationId = formation.id;

    this.formationForm.patchValue({
      titre: formation.titre,
      description: formation.description,
      categorie: formation.categorie
    });

    this.selectedFiles = { pdf: null, video: null, image: null };
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

  // Getter pour filtrer les formations directement dans le *ngFor
  get filteredFormations(): Formation[] {
    return this.formations.filter(f => {
      const matchesTitle = f.titre.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesCategory = this.searchCategory ? f.categorie === this.searchCategory : true;
      return matchesTitle && matchesCategory;
    });
  }
}
