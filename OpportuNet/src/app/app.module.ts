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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent
    
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
