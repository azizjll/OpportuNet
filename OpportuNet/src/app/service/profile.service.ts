import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  photoUrl?: string; // Ajout de la propriété photoUrl
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) {}

  addExperience(experience: Experience): Observable<Experience> {
    const token = localStorage.getItem('token');
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

  updateUserProfile(user: Partial<UserProfile>): Observable<UserProfile> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, user, { headers });
  }

  updateExperience(experienceId: number, experience: Experience): Observable<Experience> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Experience>(`${this.apiUrl}/experience/${experienceId}`, experience, { headers });
  }

  updateParcours(parcoursId: number, parcours: ParcoursAcademique): Observable<ParcoursAcademique> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<ParcoursAcademique>(`${this.apiUrl}/parcours/${parcoursId}`, parcours, { headers });
  }

  updateUserPhoto(formData: FormData): Observable<{ photoUrl: string }> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    return this.http.post<{ photoUrl: string }>(`${this.apiUrl}/photo`, formData, { headers });
  }
}