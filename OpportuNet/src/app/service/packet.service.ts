import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacketService {
  private baseUrl = 'http://localhost:8080/api/packets';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllPackets(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getPacketById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createPacket(packet: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, packet, { headers: this.getAuthHeaders() });
  }

  updatePacket(id: number, packet: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/${id}`, packet, { headers: this.getAuthHeaders() });
}

deletePacket(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
}



}
