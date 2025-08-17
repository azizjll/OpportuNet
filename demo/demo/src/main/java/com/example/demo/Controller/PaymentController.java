package com.example.demo.controller;

import com.example.demo.Entities.Payment;
import com.example.demo.Entities.User;
import com.example.demo.Entities.Packet;
import com.example.demo.Repository.PacketRepository;
import com.example.demo.Repository.UserRepository;

import com.example.demo.Serivce.PaymentService;
import org.springframework.web.bind.annotation.*;
import com.stripe.exception.StripeException;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final PacketRepository packetRepository;

    public PaymentController(PaymentService paymentService,
                             UserRepository userRepository,
                             PacketRepository packetRepository) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
        this.packetRepository = packetRepository;
    }

    @PostMapping("/create-with-packet")
    public Payment createPaymentWithPacket(@RequestParam Long userId,
                                           @RequestParam Long packetId) throws StripeException {

        // 1. Récupérer l'utilisateur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 2. Récupérer le packet choisi
        Packet packet = packetRepository.findById(packetId)
                .orElseThrow(() -> new RuntimeException("Packet non trouvé"));

        // 3. Associer le packet à l'utilisateur (optionnel)
        user.setPacket(packet);
        userRepository.save(user);

        // 4. Créer le paiement via le service
        return paymentService.createPayment(user, packet);
    }
}
