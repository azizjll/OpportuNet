import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  private baseUrl = 'http://localhost:8080/api/candidatures';

  constructor(private http: HttpClient) {}

  postuler(offreId: number, candidature: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/${offreId}`, candidature, { headers });
  }

  getMesCandidatures(token: string): Observable<any[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.baseUrl}/mes`, { headers });
}

getCandidaturesDeMesOffres(token: string): Observable<any[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.baseUrl}/mes-offres`, { headers });
}


}
