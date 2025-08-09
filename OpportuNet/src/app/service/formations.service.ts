// src/app/service/formations.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
