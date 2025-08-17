// src/app/components/payment/payment.component.ts
import { Component } from '@angular/core';
import { Payment, PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  userId = 1;  // à récupérer dynamiquement dans ton vrai projet
  amount = 0;
  currency = 'usd';
  paymentResult?: Payment;
  loading = false;
  errorMessage = '';

  constructor(private paymentService: PaymentService) {}

  createPayment() {
    this.loading = true;
    this.errorMessage = '';
    this.paymentResult = undefined;

    this.paymentService.createPayment(this.userId, this.amount, this.currency)
      .subscribe({
        next: (payment) => {
          this.paymentResult = payment;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors du paiement.';
          this.loading = false;
        }
      });
  }
}
