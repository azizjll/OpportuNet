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

    public Payment createPayment(User user, Packet packet) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long)(packet.getPrice() * 100))
                .setCurrency(packet.getCurrency())
                .setDescription("Payment for packet: " + packet.getName())
                .setReceiptEmail(user.getEmail())
                .setPaymentMethod("pm_card_visa") // carte test Stripe
                .setConfirm(true)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                .build()
                )
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPacket(packet);
        payment.setAmount(packet.getPrice());
        payment.setCurrency(packet.getCurrency());
        payment.setStripePaymentId(intent.getId());
        payment.setStatus(intent.getStatus());

        return paymentRepository.save(payment);
    }

}
