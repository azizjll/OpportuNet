import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RendezVous {
  id?: number;
  titre: string;
  description: string;
  date: string;      // format YYYY-MM-DD
  startTime: string; // format HH:mm:ss
  endTime: string;   // format HH:mm:ss
}

@Injectable({
  providedIn: 'root'
})

export class CalendarService {


  private baseUrl = 'http://localhost:8080/api/rendezvous';

  constructor(private http: HttpClient) {}

  private getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getAll(token: string): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(this.baseUrl, this.getHeaders(token));
  }

  create(rdv: RendezVous, token: string): Observable<RendezVous> {
    return this.http.post<RendezVous>(this.baseUrl, rdv, this.getHeaders(token));
  }

  update(id: number, rdv: RendezVous, token: string): Observable<RendezVous> {
    return this.http.put<RendezVous>(`${this.baseUrl}/${id}`, rdv, this.getHeaders(token));
  }

  delete(id: number, token: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.getHeaders(token));
  }
}
