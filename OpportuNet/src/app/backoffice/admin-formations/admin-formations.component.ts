import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationsService, Formation } from '../../service/formations.service';


@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
  styleUrls: ['./admin-formations.component.css']
})
export class AdminFormationsComponent {

  formationForm!: FormGroup;
  formations: Formation[] = [];

  editMode: boolean = false;
editFormationId: number | null = null;


  // Pour stocker les fichiers uploadés
  selectedFiles: { [key: string]: File | null } = {
    pdf: null,
    video: null,
    image: null
  };

  constructor(
    private fb: FormBuilder,
    private formationsService: FormationsService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadFormations();
  }

  initForm() {
    this.formationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      categorie: ['', Validators.required]
    });
  }

  onFileChange(event: any, fileType: 'pdf' | 'video' | 'image') {
    if (event.target.files && event.target.files.length) {
      this.selectedFiles[fileType] = event.target.files[0];
    }
  }

onSubmit() {
  if (this.formationForm.invalid) {
    return;
  }

  const formData = new FormData();
  formData.append('titre', this.formationForm.get('titre')?.value);
  formData.append('description', this.formationForm.get('description')?.value);
  formData.append('categorie', this.formationForm.get('categorie')?.value);

  if (this.selectedFiles['pdf']) {
    formData.append('pdf', this.selectedFiles['pdf'] as File);
  }
  if (this.selectedFiles['video']) {
    formData.append('video', this.selectedFiles['video'] as File);
  }
  if (this.selectedFiles['image']) {
    formData.append('image', this.selectedFiles['image'] as File);
  }

  if (this.editMode && this.editFormationId !== null) {
    // ✅ Mode modification
    this.formationsService.updateFormation(this.editFormationId, formData).subscribe({
      next: () => {
        alert('Formation modifiée avec succès!');
        this.resetForm();
        this.loadFormations();
      },
      error: (err) => {
        alert('Erreur lors de la modification');
        console.error(err);
      }
    });
  } else {
    // ➕ Mode création
    this.formationsService.createFormation(formData).subscribe({
      next: () => {
        alert('Formation ajoutée avec succès!');
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
}


  loadFormations() {
    this.formationsService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
      },
      error: (err) => {
        console.error('Erreur chargement formations', err);
      }
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

  // On ne précharge pas les fichiers (pas possible en HTML)
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

 }





