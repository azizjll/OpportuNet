package com.example.demo.ServiceAvancé;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("azizchahlaoui7@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Vérification de votre compte");
        message.setText("Cliquez sur ce lien pour vérifier votre compte : " + verificationLink);

        mailSender.send(message);
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("azizchahlaoui7@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendTaskNotification(String toEmail, String taskTitle, String description, LocalDate dateFin) {
        String subject = "Nouvelle tâche à réaliser";
        String body = "Bonjour,\n\nVous avez une nouvelle tâche : " + taskTitle +
                "\nDescription : " + description +
                "\nDate limite : " + dateFin +
                "\n\nMerci de vous connecter à votre espace candidat pour la réaliser.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("azizchahlaoui7@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

}
