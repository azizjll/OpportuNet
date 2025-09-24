import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements AfterViewInit {
  @Input() packetId!: number;
  @Input() amount!: number;
  @Input() currency!: string;

  @Output() paymentDone = new EventEmitter<void>();

  stripe: any;
  card: any;
  processing = false;
  errorMessage = '';
  successMessage = '';

  constructor(private paymentService: PaymentService) {}

  async ngAfterViewInit() {
    this.stripe = await loadStripe('pk_test_51SAvx9FwtL3NCfba4NP0E0Ysa7uFT0yNnRWoPhYpO8XbxPUl6dQ8kVo0usoKx3i4XnQw8Khuoq3BEMzTkQP1bCPU00cn4kapp6');

    const elements = this.stripe.elements();
    this.card = elements.create('card', { 
      style: { 
        base: { fontSize: '16px', color: '#32325d', fontFamily: 'Arial, sans-serif', '::placeholder': { color: '#a0aec0' } } 
      } 
    });
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      this.errorMessage = event.error ? event.error.message : '';
    });
  }

  async pay() {
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Le montant doit être supérieur à zéro.';
      return;
    }

    this.processing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.paymentService.createPaymentWithPacket(this.packetId).subscribe(async (res: any) => {
  const clientSecret = res.clientSecret; // ✅ prendre le bon champ renvoyé par le backend

  const { paymentIntent, error } = await this.stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: this.card }
  });

  this.processing = false;

  if (error) {
    this.errorMessage = error.message;
  } else if (paymentIntent.status === 'succeeded') {
    this.successMessage = '✅ Paiement effectué avec succès !';
    this.paymentDone.emit();
  }
}, err => {
  this.processing = false;
  this.errorMessage = 'Erreur lors de la création du paiement.';
});

  }
}
