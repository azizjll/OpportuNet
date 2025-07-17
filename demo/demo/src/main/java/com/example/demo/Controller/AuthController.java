package com.example.demo.Controller;

import com.example.demo.Entities.AuthResponse;
import com.example.demo.Entities.LoginRequest;
import com.example.demo.Entities.RegisterRequest;
import com.example.demo.Serivce.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/signin")
    public AuthResponse authenticate(@RequestBody LoginRequest request) {
        return authService.authenticate(request);
    }
}
