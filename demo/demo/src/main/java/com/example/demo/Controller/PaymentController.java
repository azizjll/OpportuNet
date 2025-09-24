package com.example.demo.Controller;

import com.example.demo.Entities.Payment;
import com.example.demo.Entities.User;
import com.example.demo.Entities.Packet;
import com.example.demo.Repository.PacketRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Serivce.PaymentService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final PacketRepository packetRepository;
    private final JwtService jwtService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService,
                             UserRepository userRepository,
                             PacketRepository packetRepository,
                             JwtService jwtService,
                             UserService userService) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
        this.packetRepository = packetRepository;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/create-with-packet")
    public ResponseEntity<Map<String, Object>> createPaymentWithPacket(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long packetId) {

        Map<String, Object> response = new HashMap<>();
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("Token manquant ou invalide");
            }
            String token = authHeader.substring(7);

            String email = jwtService.extractEmail(token);
            User user = userService.getUserByEmail(email);
            if (user == null) throw new RuntimeException("Utilisateur non trouvé");

            Packet packet = packetRepository.findById(packetId)
                    .orElseThrow(() -> new RuntimeException("Packet non trouvé"));

            // Crée PaymentIntent
            var paymentIntent = paymentService.createPaymentIntent(user, packet);

            // Sauvegarde relation user-packet
            user.setPacket(packet);
            userRepository.save(user);

            response.put("status", "success");
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("amount", packet.getPrice());
            response.put("currency", packet.getCurrency());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

}
