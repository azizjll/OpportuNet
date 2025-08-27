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
uploadUserImage(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(`${this.baseUrl}/${userId}/upload-image`, formData, { headers });
  }
}
