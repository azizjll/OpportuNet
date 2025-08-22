package com.example.demo.Controller;

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

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Packet packet = packetRepository.findById(packetId)
                .orElseThrow(() -> new RuntimeException("Packet non trouvé"));

        user.setPacket(packet);
        userRepository.save(user);

        return paymentService.createPayment(user, packet);
    }
}
