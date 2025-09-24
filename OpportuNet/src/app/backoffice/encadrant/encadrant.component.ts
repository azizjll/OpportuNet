// src/app/backoffice/encadrant/encadrant.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { RemiseService } from '../../service/remise.service';
import { UserService } from 'src/app/service/user.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-encadrant',
  templateUrl: './encadrant.component.html',
  styleUrls: ['./encadrant.component.css']
})
export class EncadrantComponent implements OnInit {
  titre: string = '';
  description: string = '';
  dateDebut: string = '';
  dateFin: string = '';

  tasks: any[] = [];
  remises: any[] = [];
    candidats: any[] = [];   // liste des candidats encadrés

  selectedTaskId: number | null = null;

  constructor(private taskService: TaskService, private remiseService: RemiseService, private userService: UserService) {}

ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("⚠️ Aucun token trouvé dans localStorage.");
    return;
  }

  try {
    // Décoder le token JWT
    const decoded: any = jwtDecode(token);
    console.log("📌 Token décodé:", decoded);

    const emailEncadrant = decoded.sub; // 👉 l'email est dans "sub"
    console.log("📌 Email de l'encadrant:", emailEncadrant);

    // Charger les tâches de l’encadrant via email
    this.taskService.getTasksByEncadrant(emailEncadrant).subscribe({
      next: (data) => {
        console.log("📌 Tâches reçues du backend:", data);
        this.tasks = data;
      },
      error: (err) => {
        console.error("❌ Erreur lors de la récupération des tâches:", err);
      }
    });

    // Charger les candidats encadrés via email
    this.userService.getCandidatsByEncadrant(emailEncadrant).subscribe({
      next: (data) => {
        console.log("📌 Candidats reçus du backend:", data);
        this.candidats = data;
      },
      error: (err) => {
        console.error("❌ Erreur lors de la récupération des candidats:", err);
      }
    });

  } catch (e) {
    console.error("❌ Erreur lors du décodage du token:", e);
  }
}


  createTask() {
    this.taskService.createTask(this.titre, this.description, this.dateDebut, this.dateFin)
      .subscribe(data => {
        this.tasks = data; // backend renvoie la liste mise à jour
        this.resetForm();
      });
  }

  viewRemises(taskId: number) {
    this.selectedTaskId = taskId;
    this.remiseService.getRemisesByTask(taskId).subscribe(data => {
      this.remises = data;
    });
  }

  resetForm() {
    this.titre = '';
    this.description = '';
    this.dateDebut = '';
    this.dateFin = '';
  }
}
