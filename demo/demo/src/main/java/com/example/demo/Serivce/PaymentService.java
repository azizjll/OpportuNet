package com.example.demo.Serivce;

import com.example.demo.Entities.Packet;
import com.example.demo.Entities.Payment;
import com.example.demo.Entities.User;
import com.example.demo.Repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public PaymentIntent createPaymentIntent(User user, Packet packet) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (packet.getPrice() * 100)) // montant en centimes
                .setCurrency(packet.getCurrency())
                .setDescription("Payment for packet: " + packet.getName())
                .setReceiptEmail(user.getEmail())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }
}

