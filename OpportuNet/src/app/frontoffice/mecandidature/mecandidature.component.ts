import { Component, OnInit } from '@angular/core';
import { CandidatureService } from 'src/app/service/candidature.service';
import { TaskService } from 'src/app/service/task.service';
import { RemiseService } from 'src/app/service/remise.service';

@Component({
  selector: 'app-mecandidature',
  templateUrl: './mecandidature.component.html',
  styleUrls: ['./mecandidature.component.css']
})
export class MecandidatureComponent implements OnInit {
  candidatures: any[] = [];
  tasks: any[] = [];
  myRemises: any[] = []; // <-- tableau pour stocker les remises
  avancePercent: number = 0;
  avanceLabel: string = '';
  remiseContenu: { [taskId: number]: string } = {};

  constructor(
    private candidatureService: CandidatureService,
    private taskService: TaskService,
    private remiseService: RemiseService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.candidatureService.getMesCandidatures(token).subscribe({
        next: (data) => this.candidatures = data,
        error: (err) => console.error('Erreur lors du chargement des candidatures', err)
      });
    }

    // Charger les tâches
    this.taskService.getMyTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.calculerAvancement();
      },
      error: (err) => console.error('Erreur lors de la récupération des tâches', err)
    });

    // Charger les remises
    this.remiseService.getMyRemises().subscribe({
      next: (data) => {
        this.myRemises = data;
        this.calculerAvancement();
      },
      error: (err) => console.error('Erreur lors de la récupération des remises', err)
    });
  }

  // Soumettre une remise
soumettreRemise(taskId: number): void {
  const contenu = this.remiseContenu[taskId];
  if (!contenu || contenu.trim() === '') {
    alert('Veuillez saisir un contenu avant de soumettre.');
    return;
  }

  this.remiseService.soumettreRemise(taskId, contenu).subscribe({
    next: (res: any) => {
      alert(res.message || 'Remise soumise avec succès ✅');

      // Vider le textarea
      this.remiseContenu[taskId] = '';

      // 🔹 Ajouter la remise localement
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = 'TERMINEE'; // changer le statut directement
      }

      this.myRemises.push({
        task: this.tasks.find(t => t.id === taskId),
        contenu: contenu,
        createdAt: new Date() // date actuelle
      });

      // 🔹 Recalculer l'avancement
      this.calculerAvancement();
    },
    error: (err) => {
      if (err.error && err.error.message) {
        alert('Erreur : ' + err.error.message);
      } else if (err.error) {
        alert('Erreur : ' + err.error);
      } else {
        alert('Erreur lors de la soumission de la remise.');
      }
    }
  });
}



  // ✅ Calculer le pourcentage d’avancement et le label
  calculerAvancement(): void {
    if (!this.tasks || this.tasks.length === 0) {
      this.avancePercent = 0;
      this.avanceLabel = 'Aucune tâche';
      return;
    }

    const totalTaches = this.tasks.length;
    const totalRemises = this.myRemises.length;

    this.avancePercent = Math.round((totalRemises / totalTaches) * 100);

    if (this.avancePercent === 0) {
      this.avanceLabel = 'Faible';
    } else if (this.avancePercent > 0 && this.avancePercent < 100) {
      this.avanceLabel = 'Moyenne';
    } else if (this.avancePercent === 100) {
      this.avanceLabel = 'Excellent';
    }
  }
}
