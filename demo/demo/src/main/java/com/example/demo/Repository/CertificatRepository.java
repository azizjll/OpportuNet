package com.example.demo.Repository;

import com.example.demo.Entities.Certificat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificatRepository extends JpaRepository<Certificat, Long> {
}
