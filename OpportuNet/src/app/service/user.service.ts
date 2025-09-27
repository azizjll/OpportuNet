// src/app/service/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCandidatsByEncadrant(email: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/encadrant/${email}/candidats`, {
    headers: this.getHeaders()
  });
}



  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, { headers: this.getHeaders() });
  }

  acceptUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/accept`, {}, { headers: this.getHeaders() });
  }

  verifyUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/verify`, {}, { headers: this.getHeaders() });
  }

  blockUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/block`, {}, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
}
uploadUserImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  // 👉 tu appelles ton endpoint qui lit le user depuis le token
  return this.http.post<any>(`http://localhost:8080/api/admin/users/upload-image`, formData, { headers });
}

generateCertificat(userId: number, formationId: number): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/certificat/generer`, 
    { userId, formationId }, 
    { headers: this.getHeaders() }
  );
}

// Télécharger un certificat
downloadCertificat(certificatId: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/certificat/${certificatId}`, {
    headers: this.getHeaders(),
    responseType: 'blob'  // 👈 important pour récupérer un PDF
  });
}

// Récupérer tous les certificats
getAllCertificats(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/certificats/all`, { headers: this.getHeaders() });
}



}
