import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Entretien {
  id?: number;
  description: string;
  dateEntretien: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EntretienService {

  private baseUrl = 'http://localhost:8080/api/entretiens';

  constructor(private http: HttpClient) { }

  fixerEntretien(description: string, date: string, token: string): Observable<Entretien> {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    const params = { description, date };
    return this.http.post<Entretien>(`${this.baseUrl}/fixer`, null, { headers, params });
  }
}
