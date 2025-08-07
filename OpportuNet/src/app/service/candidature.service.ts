import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  private baseUrl = 'http://localhost:8080/api/candidatures';

  constructor(private http: HttpClient) {}

  postuler(offreId: number, formData: FormData, token: string): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post(`${this.baseUrl}/${offreId}`, formData, { headers });
}


  getMesCandidatures(token: string): Observable<any[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.baseUrl}/mes`, { headers });
}

getCandidaturesDeMesOffres(token: string): Observable<any[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.baseUrl}/mes-offres`, { headers });
}

checkCandidatureExiste(offreId: number, token: string) {
  return this.http.get<boolean>(`${this.baseUrl}/existe/${offreId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

changerStatutCandidature(id: number, statut: string, token: string) {
  return this.http.put(
    `${this.baseUrl}/${id}/statut`,
    { statut },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}



}
