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
            // 1. Vérifier le token JWT
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("Token manquant ou invalide");
            }
            String token = authHeader.substring(7);

            // 2. Extraire l'email depuis le token
            String email = jwtService.extractEmail(token);

            // 3. Récupérer l'utilisateur depuis la BDD
            User user = userService.getUserByEmail(email);
            if (user == null) {
                throw new RuntimeException("Utilisateur non trouvé avec cet email");
            }

            // 4. Récupérer le packet
            Packet packet = packetRepository.findById(packetId)
                    .orElseThrow(() -> new RuntimeException("Packet non trouvé"));

            // 5. Associer le packet à l'utilisateur
            user.setPacket(packet);

            // 6. Créer le paiement via le service
            Payment payment = paymentService.createPayment(user, packet);

            // 7. Mettre à jour l'utilisateur comme payé uniquement si le paiement est OK
            if ("SUCCEEDED".equalsIgnoreCase(payment.getStatus())) {
                user.setIsPayment(true);
            }
            userRepository.save(user);

            // 8. Construire la réponse JSON
            response.put("status", "success");
            response.put("message", "Paiement créé avec succès");
            response.put("user", user.getEmail());
            response.put("packet", packet.getName());
            response.put("amount", payment.getAmount());
            response.put("currency", payment.getCurrency());
            response.put("stripePaymentId", payment.getStripePaymentId());
            response.put("paymentStatus", payment.getStatus());

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Erreur Stripe: " + e.getMessage());
            return ResponseEntity.status(500).body(response);

        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Erreur interne: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
