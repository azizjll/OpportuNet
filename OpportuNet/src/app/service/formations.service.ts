// src/app/service/formations.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Formation {
  id: number;
  titre: string;
  description: string;
  pdf: string;
  video: string;
  categorie: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormationsService {

  private apiUrl = 'http://localhost:8080/api/formations'; // URL backend

  constructor(private http: HttpClient) { }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }
  createFormation(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(this.apiUrl, formData, { headers });
  }

  deleteFormation(id: number): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}

updateFormation(id: number, formData: FormData): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.put(`${this.apiUrl}/${id}`, formData, { headers });
}


}
