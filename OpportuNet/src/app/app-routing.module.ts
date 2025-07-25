import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './frontoffice/login/login.component';
import { HomeComponent } from './frontoffice/home/home.component';
import { ProfileComponent } from './frontoffice/profile/profile.component';
import { FrontofficeLayoutComponent } from './layouts/frontoffice-layout/frontoffice-layout.component';
import { BackofficeLayoutComponent } from './layouts/backoffice-layout/backoffice-layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'home',component:HomeComponent},
    {path:'profile',component:ProfileComponent},
    {
    path: '',
    component: FrontofficeLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
    ]
  },
  {
    path: 'admin',
    component: BackofficeLayoutComponent,
    children: [
      //{ path: 'dashboard', component: DashboardComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
