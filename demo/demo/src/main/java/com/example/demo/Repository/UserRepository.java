package com.example.demo.Repository;

import com.example.demo.Entities.User;
import jakarta.persistence.metamodel.SingularAttribute;
import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.Serializable;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    static void deleteById(SingularAttribute<AbstractPersistable, Serializable> id) {
    }

    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String token);

}