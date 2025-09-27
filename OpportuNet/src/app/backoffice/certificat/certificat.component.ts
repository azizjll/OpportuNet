// src/app/components/certificat/certificat.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-certificat',
  templateUrl: './certificat.component.html',
  styleUrls: ['./certificat.component.css']
})
export class CertificatComponent implements OnInit {
  users: any[] = [];
  formations: any[] = [];
  certificats: any[] = [];

  selectedUser: number | null = null;
  selectedFormation: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadFormations();
    this.loadCertificats();
  }

  loadCertificats() {
  this.userService.getAllCertificats().subscribe(data => {
    this.certificats = data;
  });
}


  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  loadFormations() {
    // tu peux créer un service formation séparé si tu veux,
    // ici j’utilise directement HttpClient via userService pour simplifier
    this.userService['http'].get<any[]>('http://localhost:8080/api/formations', {
      headers: this.userService['getHeaders']()
    }).subscribe(data => {
      this.formations = data;
    });
  }

  generateCertificat() {
    if (this.selectedUser && this.selectedFormation) {
      this.userService.generateCertificat(this.selectedUser, this.selectedFormation).subscribe(certif => {
        alert('Certificat généré avec succès ✅');
        this.certificats.push(certif);
      });
    } else {
      alert('Veuillez sélectionner un utilisateur et une formation');
    }
  }

  downloadCertificat(certificatId: number) {
    this.userService.downloadCertificat(certificatId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificat_${certificatId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
