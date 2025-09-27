package com.example.demo.Controller;

import com.example.demo.Entities.Reclamation;
import com.example.demo.Entities.Reponse;
import com.example.demo.Entities.User;

import com.example.demo.Serivce.ReclamationService;
import com.example.demo.Serivce.ReponseService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;

    @Autowired
    private ReponseService reponseService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public Reclamation creerReclamation(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody Reclamation reclamation) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);

        return reclamationService.creerReclamation(reclamation, user);
    }

    @GetMapping
    public List<Reclamation> getAllReclamations() {
        return reclamationService.getAllReclamations();
    }

    @PostMapping("/{id}/reponse")
    public Reponse repondre(@PathVariable Long id,
                            @RequestBody String contenu) {
        return reponseService.repondre(id, contenu);
    }
    @GetMapping("/mes")
    public List<Reclamation> getMesReclamations(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.getUserByEmail(email);

        return reclamationService.getReclamationsByUser(user);
    }

}
