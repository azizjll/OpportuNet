// src/app/service/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // JWT stocké après login
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createTask(titre: string, description: string, dateDebut: string, dateFin: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}?titre=${titre}&description=${description}&dateDebut=${dateDebut}&dateFin=${dateFin}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getTasksByEncadrant(email: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/encadrant/${email}`, { headers: this.getHeaders() });
}

// ✅ Nouvelle méthode : récupérer les tâches du candidat connecté
  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidat/me`, { headers: this.getHeaders() });
  }

}
