package com.example.demo.ServiceAvancé;

import com.example.demo.Entities.Certificat;
import com.example.demo.Entities.Formation;
import com.example.demo.Entities.User;
import com.example.demo.Repository.CertificatRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.awt.Color;


@Service
public class CertificatService {

    @Autowired
    private CertificatRepository certificatRepository;

    public Certificat genererEtSauvegarderCertificat(User user, Formation formation) throws Exception {
        // Vérifier dossier
        File dir = new File("certificats");
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filePath = "certificats/" + user.getNom() + "_" + formation.getTitre() + ".pdf";

        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();

        // Police personnalisées
        Font titleFont = new Font(Font.HELVETICA, 28, Font.BOLD, new Color(0, 102, 204));
        Font subtitleFont = new Font(Font.HELVETICA, 16, Font.ITALIC, Color.DARK_GRAY);
        Font normalFont = new Font(Font.HELVETICA, 12, Font.NORMAL, Color.BLACK);
        Font boldFont = new Font(Font.HELVETICA, 14, Font.BOLD, Color.BLACK);

        // Titre principal
        Paragraph title = new Paragraph("CERTIFICAT DE FORMATION", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(30f);
        document.add(title);

        // Sous-titre
        Paragraph subtitle = new Paragraph("Ce document atteste l'engagement et la réussite", subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(40f);
        document.add(subtitle);

        // Corps
        Paragraph content = new Paragraph(
                "Nous certifions que : \n\n" +
                        user.getPrenom() + " " + user.getNom() + "\n\n" +
                        "a complété avec succès la formation intitulée : \n\n" +
                        formation.getTitre(), boldFont
        );
        content.setAlignment(Element.ALIGN_CENTER);
        content.setSpacingAfter(20f);
        document.add(content);

        document.add(new Paragraph("Description : " + formation.getDescription(), normalFont));
        document.add(new Paragraph("Date d'obtention : " + java.time.LocalDate.now(), normalFont));
        document.add(new Paragraph(" ", normalFont));

        // Message de motivation
        Paragraph motivation = new Paragraph(
                "\"Votre détermination et votre persévérance sont une source d’inspiration.\n" +
                        "Que ce certificat soit le reflet de votre engagement et une étape vers de nouveaux succès.\"",
                subtitleFont
        );
        motivation.setAlignment(Element.ALIGN_CENTER);
        motivation.setSpacingBefore(40f);
        motivation.setSpacingAfter(40f);
        document.add(motivation);

        // Signature fictive
        Paragraph signature = new Paragraph("________________________\nDirecteur de Formation", normalFont);
        signature.setAlignment(Element.ALIGN_RIGHT);
        document.add(signature);

        document.close();

        // Sauvegarde en BDD
        Certificat certificat = new Certificat();
        certificat.setUser(user);
        certificat.setFormation(formation);
        certificat.setFichierPdf(filePath);
        certificat.setDateGeneration(LocalDateTime.now());

        return certificatRepository.save(certificat);
    }
}
