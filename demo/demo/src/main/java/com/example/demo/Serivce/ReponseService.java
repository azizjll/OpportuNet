package com.example.demo.Serivce;


import com.example.demo.Entities.Reclamation;
import com.example.demo.Entities.Reponse;
import com.example.demo.ServiceAvancé.EmailService;
import com.example.demo.Repository.ReponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReponseService {

    @Autowired
    private ReponseRepository reponseRepository;

    @Autowired
    private ReclamationService reclamationService;

    @Autowired
    private EmailService emailService;

    public Reponse repondre(Long reclamationId, String contenu) {
        Reclamation reclamation = reclamationService.getReclamationById(reclamationId);

        Reponse reponse = new Reponse();
        reponse.setContenu(contenu);
        reponse.setReclamation(reclamation);
        reponseRepository.save(reponse);

        // Changer le statut de la réclamation
        reclamation.setStatut(com.example.demo.Entities.StatutReclamation.TRAITEE);
        reclamationService.updateReclamation(reclamation);

        // Envoyer email à l'utilisateur
        emailService.sendSimpleMessage(
                reclamation.getUser().getEmail(),
                "Réponse à votre réclamation",
                "Bonjour " + reclamation.getUser().getNom() +
                        ",\n\nVotre réclamation a été traitée.\nRéponse : " + contenu
        );

        return reponse;
    }
}
