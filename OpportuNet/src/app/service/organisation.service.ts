import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OffreStage {
   id?: number; 
  titre: string;
  description: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  etat: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  private baseUrl = 'http://localhost:8080/api/offres';

  constructor(private http: HttpClient) {}

  createOffre(offre: OffreStage, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.baseUrl, offre, { headers });
  }

  getMyOffres(token: string): Observable<OffreStage[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<OffreStage[]>(`${this.baseUrl}/mesOffres`, { headers });
}

getAllOffres(): Observable<OffreStage[]> {
  return this.http.get<OffreStage[]>(this.baseUrl);
}



}
