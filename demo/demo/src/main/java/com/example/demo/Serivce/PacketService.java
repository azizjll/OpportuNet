package com.example.demo.Serivce;

import com.example.demo.Entities.Packet;
import com.example.demo.Repository.PacketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacketService {
    private final PacketRepository packetRepository;

    public PacketService(PacketRepository packetRepository) {
        this.packetRepository = packetRepository;
    }

    public List<Packet> getAllPackets() {
        return packetRepository.findAll();
    }

    public Packet getPacketById(Long id) {
        return packetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Packet not found"));
    }

    public Packet savePacket(Packet packet) {
        return packetRepository.save(packet);
    }

    // Nouvelle méthode : modifier un packet
    public Packet updatePacket(Long id, Packet updatedPacket) {
        Packet existing = getPacketById(id);
        existing.setName(updatedPacket.getName());
        existing.setDescription(updatedPacket.getDescription());
        existing.setPrice(updatedPacket.getPrice());
        existing.setCurrency(updatedPacket.getCurrency());
        return packetRepository.save(existing);
    }

    // Nouvelle méthode : supprimer un packet
    public void deletePacket(Long id) {
        Packet existing = getPacketById(id);
        packetRepository.delete(existing);
    }


}
