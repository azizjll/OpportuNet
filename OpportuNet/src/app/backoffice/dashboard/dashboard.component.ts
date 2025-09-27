import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { UserService } from 'src/app/service/user.service';
import { OrganisationService, OffreStage } from 'src/app/service/organisation.service';
import { CandidatureService } from 'src/app/service/candidature.service';
import { Reclamation, ReclamationService } from 'src/app/service/reclamation.service';
import { ProfileService, UserProfile } from 'src/app/service/profile.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userNom: string = '';
  userPrenom: string = '';
  userRole: string = '';
  imageUrl: string = '';
  userProfile?: UserProfile;

  reclamations: Reclamation[] = [];
  reclamationSelectionnee?: Reclamation;

  // Graphique utilisateurs
  public chartData: ChartData<'bar'> = {
    labels: ['CANDIDAT', 'ENCADRANT', 'ORGANISATION'],
    datasets: [
      {
        label: 'Nombre d\'utilisateurs',
        data: [0, 0, 0],
        backgroundColor: ['#007bff', '#28a745', '#ffc107']
      }
    ]
  };
  public chartOptions: ChartOptions<'bar'> = { responsive: true, plugins: { legend: { display: true } } };
  public chartType: 'bar' = 'bar';

  // Graphique offres (cercle)
  public offresChartData: ChartData<'pie'> = {
    labels: ['EMPLOI', 'STAGE'],
    datasets: [
      { data: [0, 0], backgroundColor: ['#17a2b8', '#ffc107'] }
    ]
  };
  public offresChartOptions: ChartOptions<'pie'> = { responsive: true };
  public offresChartType: 'pie' = 'pie';

  // Graphique candidatures (cercle)
  public candidaturesChartData: ChartData<'pie'> = {
    labels: ['EN_ATTENTE', 'PRESELECTION', 'ACCEPTEE', 'REFUSEE'],
    datasets: [
      { data: [0, 0, 0, 0], backgroundColor: ['#6c757d', '#007bff', '#28a745', '#dc3545'] }
    ]
  };
  public candidaturesChartOptions: ChartOptions<'pie'> = { responsive: true };
  public candidaturesChartType: 'pie' = 'pie';

  constructor(
    private userService: UserService,
    private orgService: OrganisationService,
    private candidatureService: CandidatureService,
    private reclamationService: ReclamationService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadUsers();
    this.loadOffres();
    this.loadCandidatures();
    this.loadReclamations();
  }

  // --------------------------
  // 🔹 Charger le profil utilisateur
  // --------------------------
  loadUserProfile() {
    this.profileService.getUserProfile().subscribe(profile => {
      this.userProfile = profile;
      this.userNom = profile.nom;
      this.userPrenom = profile.prenom;
      this.userRole = profile.role;
      this.imageUrl = profile.imageUrl || 'assets/images/faces/default.jpg';
    });
  }

  // --------------------------
  // 📊 Statistiques
  // --------------------------
  loadUsers() {
    this.userService.getAllUsers().subscribe(users => {
      const countCandidat = users.filter(u => u.role === 'CANDIDAT').length;
      const countEncadrant = users.filter(u => u.role === 'ENCADRANT').length;
      const countOrganisation = users.filter(u => u.role === 'ORGANISATION').length;
      this.chartData.datasets[0].data = [countCandidat, countEncadrant, countOrganisation];
    });
  }

  loadOffres() {
    this.orgService.getAllOffres().subscribe((offres: OffreStage[]) => {
      const countEmploi = offres.filter(o => o.type === 'EMPLOI').length;
      const countStage = offres.filter(o => o.type === 'STAGE').length;
      this.offresChartData.datasets[0].data = [countEmploi, countStage];
    });
  }

  loadCandidatures() {
    const token = localStorage.getItem('token') || '';
    this.candidatureService.getAllCandidatures(token).subscribe(candidatures => {
      const enAttente = candidatures.filter(c => c.statut === 'EN_ATTENTE').length;
      const preselection = candidatures.filter(c => c.statut === 'PRESELECTION').length;
      const acceptee = candidatures.filter(c => c.statut === 'ACCEPTEE').length;
      const refusee = candidatures.filter(c => c.statut === 'REFUSEE').length;
      this.candidaturesChartData.datasets[0].data = [enAttente, preselection, acceptee, refusee];
    });
  }

  // --------------------------
  // 📩 Gestion des réclamations
  // --------------------------
  loadReclamations() {
    this.reclamationService.getAllReclamations().subscribe(data => {
      this.reclamations = data;
    });
  }

  ouvrirRepondreModal(rec: Reclamation) {
    this.reclamationSelectionnee = rec;
  }

  fermerRepondreModal() {
    this.reclamationSelectionnee = undefined;
    this.loadReclamations();
  }

  // --------------------------
  // 📷 Upload image profil
  // --------------------------
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.userService.uploadUserImage(file).subscribe(updatedUser => {
        if (updatedUser.imageUrl) {
          this.imageUrl = updatedUser.imageUrl; // 🔥 mise à jour immédiate
        }
      });
    }
  }
}
