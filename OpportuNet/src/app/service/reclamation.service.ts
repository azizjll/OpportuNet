import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reclamation {
  id?: number;
  sujet: string;
  description: string;
  type: 'ADMINISTRATIVE' | 'TECHNIQUE';
  statut?: 'EN_ATTENTE' | 'TRAITEE';
  dateCreation?: string;
  user?: any;
  reponses?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private apiUrl = 'http://localhost:8080/api/reclamations';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // ou récupère ton JWT depuis un autre stockage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Créer une réclamation
  creerReclamation(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.apiUrl, reclamation, { headers: this.getAuthHeaders() });
  }

  // Récupérer toutes les réclamations
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Répondre à une réclamation
  repondreReclamation(id: number, contenu: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reponse`, `"${contenu}"`, { headers: this.getAuthHeaders() });
    // Attention : backend attend un string JSON, donc on met les guillemets autour
  }

  // Dans reclamation.service.ts
getMesReclamations(): Observable<Reclamation[]> {
  return this.http.get<Reclamation[]>(`${this.apiUrl}/mes`, { headers: this.getAuthHeaders() });
}

}
