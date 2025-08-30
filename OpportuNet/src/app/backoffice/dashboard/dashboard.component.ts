import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from 'src/app/service/authservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userNom: string = '';
  userPrenom: string = '';
  userRole: string = '';

  constructor(private authService: AuthserviceService) {}

  ngOnInit() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.userNom = userInfo.nom;
      this.userPrenom = userInfo.prenom;
      this.userRole = userInfo.role;
      console.log('Infos utilisateur :', userInfo);
    }
  }
}
