package com.example.demo.Controller;


import com.example.demo.Entities.Packet;
import com.example.demo.Entities.User;
import com.example.demo.Serivce.PacketService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/packets")
@CrossOrigin // si tu appelles depuis Angular

public class PacketController {

    private final PacketService packetService;
    private final UserService userService;
    private final JwtService jwtService;

    public PacketController(PacketService packetService, UserService userService, JwtService jwtService) {
        this.packetService = packetService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<Packet> getAllPackets(@RequestHeader("Authorization") String authHeader) {
        User user = getAuthenticatedUser(authHeader); // vérifie que l'utilisateur est connecté
        return packetService.getAllPackets();
    }

    @GetMapping("/{id}")
    public Packet getPacketById(@RequestHeader("Authorization") String authHeader,
                                @PathVariable Long id) {
        User user = getAuthenticatedUser(authHeader);
        return packetService.getPacketById(id);
    }

    @PostMapping
    public Packet createPacket(@RequestHeader("Authorization") String authHeader,
                               @RequestBody Packet packet) {
        User user = getAuthenticatedUser(authHeader);

        // Crée la liste si elle est null
        if (packet.getUsers() == null) {
            packet.setUsers(new ArrayList<>());
        }

        // Ajoute l'utilisateur courant dans la liste des utilisateurs
        packet.getUsers().add(user);

        // Associe le packet à l'utilisateur (relation bidirectionnelle)
        user.setPacket(packet);

        return packetService.savePacket(packet);
    }


    private User getAuthenticatedUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide");
        }
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        return userService.getUserByEmail(email);
    }
}

