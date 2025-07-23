package com.example.demo.Serivce;


import com.example.demo.Entities.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    /*public User getUserById(Long id) {
        Optional<User> optionalUser = userRepo.findById(id);
        return optionalUser.orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }*/

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }


}
