package com.example.demo.Repository;

import com.example.demo.Entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Si besoin, tu peux ajouter des méthodes comme :
    // List<Payment> findByUserId(Long userId);
}

