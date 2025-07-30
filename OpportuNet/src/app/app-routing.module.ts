import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './frontoffice/login/login.component';
import { HomeComponent } from './frontoffice/home/home.component';
import { ProfileComponent } from './frontoffice/profile/profile.component';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout/frontoffice-layout.component';
import { BackofficeLayoutComponent } from './layouts/backoffice-layout/backoffice-layout.component';
import { SidebarComponent } from './backoffice/sidebar/sidebar.component';
import { DashboardComponent } from './backoffice/dashboard/dashboard.component';
import { OrganisationComponent } from './backoffice/organisation/organisation.component';
import { MecandidatureComponent } from './frontoffice/mecandidature/mecandidature.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
    {
    path: '', 
    component: FrontofficeLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
        {path:'profile',component:ProfileComponent, canActivate: [AuthGuard]}
        


    ]
  },
  {

    path: 'admin', canActivate: [AuthGuard],
    component: BackofficeLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {path: 'organisation', component: OrganisationComponent},

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
