// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  createPayment(userId: number, amount: number, currency: string = 'usd'): Observable<Payment> {
    const url = `${this.apiUrl}/create?userId=${userId}&amount=${amount}&currency=${currency}`;
    return this.http.post<Payment>(url, {});
  }
}
