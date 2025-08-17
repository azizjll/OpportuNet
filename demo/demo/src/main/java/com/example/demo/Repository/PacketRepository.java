package com.example.demo.Repository;

import com.example.demo.Entities.Packet;
import com.example.demo.Entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacketRepository extends JpaRepository<Packet, Long> {
}
