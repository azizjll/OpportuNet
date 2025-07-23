import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Experience {
  id?: number;
  societe: string;
  titrePoste: string;
  mission: string;
  dateDebut: Date;
  dateFin: Date;
}

export interface ParcoursAcademique {
  id?: number;
  ecole: string;
  diplome: string;
  dateDebut: Date;
  dateFin: Date;
}

export interface UserProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  cvGenere: boolean;
  verified: boolean;
  accepted: boolean;
  experiences: Experience[];
  parcoursAcademiques: ParcoursAcademique[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) {}



  addExperience(experience: Experience): Observable<Experience> {
  const token = localStorage.getItem('token'); // ou via un AuthService
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post<Experience>(`${this.apiUrl}/experience`, experience, { headers });
}

addParcours(parcours: ParcoursAcademique): Observable<ParcoursAcademique> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.post<ParcoursAcademique>(`${this.apiUrl}/parcours`, parcours, { headers });
}

getUserProfile(): Observable<UserProfile> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers });
}


  /*getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  addExperience(userId: number, experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(`${this.apiUrl}/${userId}/experience`, experience);
  }

  addParcours(userId: number, parcours: ParcoursAcademique): Observable<ParcoursAcademique> {
    return this.http.post<ParcoursAcademique>(`${this.apiUrl}/${userId}/parcours`, parcours);
  }*/
}
