
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  stripePaymentId: string;
  status: string;
  createdAt: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  createPaymentWithPacket(packetId: number): Observable<Payment> {
    const token = localStorage.getItem('token'); // ou sessionStorage selon ton app

    if (!token) {
      throw new Error('Token JWT manquant !');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/create-with-packet?packetId=${packetId}`;
    return this.http.post<Payment>(url, {}, { headers });
  }
}
