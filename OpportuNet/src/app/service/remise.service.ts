// src/app/service/remise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemiseService {
  private apiUrl = 'http://localhost:8080/api/remises';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getRemisesByTask(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/task/${taskId}`, { headers: this.getHeaders() });
  }

  // ✅ Nouvelle méthode pour soumettre une remise
  soumettreRemise(taskId: number, contenu: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('contenu', contenu);

    return this.http.post<any>(
      `${this.apiUrl}/task/${taskId}?${params.toString()}`,
      {},
      { headers: this.getHeaders() }
    );
  }

   getMyRemises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/myremises`, { headers: this.getHeaders() });
  }


}
