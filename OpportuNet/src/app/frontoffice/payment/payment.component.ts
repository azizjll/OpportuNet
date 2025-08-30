import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Payment, PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnChanges {
  @Input() packetId!: number;

  @Input() amount!: number;    // juste pour afficher à l'écran
  @Input() currency!: string;  // juste pour afficher à l'écran
  @Output() paymentDone = new EventEmitter<Payment>();

  paymentResult?: Payment;
  loading = false;
  errorMessage = '';

  constructor(private paymentService: PaymentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['amount'] || changes['currency']) {
      this.paymentResult = undefined;
      this.errorMessage = '';
      this.loading = false;
    }
  }

  createPayment() {
    this.loading = true;
    this.errorMessage = '';
    this.paymentResult = undefined;

    // Appel sans userId, le backend le trouve avec le token
    this.paymentService.createPaymentWithPacket(this.packetId)
      .subscribe({
        next: (payment) => {
          this.paymentResult = payment;
          this.loading = false;
          this.paymentDone.emit(payment);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors du paiement.';
          this.loading = false;
        }
      });
  }
}
