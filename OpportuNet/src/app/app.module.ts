import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './frontoffice/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './frontoffice/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './frontoffice/profile/profile.component';
import { HeaderComponent } from './frontoffice/header/header.component';
import { FooterComponent } from './frontoffice/footer/footer.component';
import { SidebarComponent } from './backoffice/sidebar/sidebar.component';
import { DashboardComponent } from './backoffice/dashboard/dashboard.component';
import { OrganisationComponent } from './backoffice/organisation/organisation.component';
import { PostulerPopupComponent } from './frontoffice/postuler-popup/postuler-popup.component';
import { MecandidatureComponent } from './frontoffice/mecandidature/mecandidature.component';
import { AjoutQuestionModalComponent } from './backoffice/ajout-question-modal/ajout-question-modal.component';
import { FormationComponent } from './frontoffice/formation/formation.component';
import { FormationsService } from './service/formations.service';
 
import { AdminFormationsComponent } from './backoffice/admin-formations/admin-formations.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    DashboardComponent,
    OrganisationComponent,
    PostulerPopupComponent,
    MecandidatureComponent,
    AjoutQuestionModalComponent,
    FormationComponent,
    AdminFormationsComponent,



    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule,
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
