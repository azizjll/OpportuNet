package com.example.demo.Controller;

import com.example.demo.Entities.Categorie;
import com.example.demo.Entities.Formation;
import com.example.demo.Entities.User;
import com.example.demo.Security.FormationService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.JwtService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/formations")
@CrossOrigin(origins = "*")
public class FormationController {

    private final FormationService formationService;
    private final JwtService jwtService;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(FormationController.class);

    public FormationController(FormationService formationService, JwtService jwtService, UserService userService) {
        this.formationService = formationService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    // ✅ Création de formation par un utilisateur ORGANISATION
    @PreAuthorize("hasRole('ORGANISATION')")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createFormation(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam("categorie") String categorieStr,
            @RequestParam("pdf") MultipartFile pdfFile,
            @RequestParam("video") MultipartFile videoFile,
            @RequestParam("image") MultipartFile imageFile    // <-- nouveau param

    ) {

        try {
            // 📦 Préparation des dossiers
            String uploadsDir = System.getProperty("user.dir") + "/uploads";
            File pdfDir = new File(uploadsDir + "/pdfs");
            File videoDir = new File(uploadsDir + "/videos");
            File imageDir = new File(uploadsDir + "/images");  // dossier images

            if (!pdfDir.exists()) pdfDir.mkdirs();
            if (!videoDir.exists()) videoDir.mkdirs();
            if (!imageDir.exists()) imageDir.mkdirs();  // <-- Création dossier images

            // 📁 Sauvegarde du PDF
            String pdfFilename = System.currentTimeMillis() + "_" + pdfFile.getOriginalFilename();
            pdfFile.transferTo(new File(pdfDir, pdfFilename));

            // 📁 Sauvegarde de la vidéo
            String videoFilename = System.currentTimeMillis() + "_" + videoFile.getOriginalFilename();
            videoFile.transferTo(new File(videoDir, videoFilename));

            // 📁 Sauvegarde de l’image
            String imageFilename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            imageFile.transferTo(new File(imageDir, imageFilename));

            // 🔐 Récupérer l’utilisateur à partir du token
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);
            User user = userService.getUserByEmail(email);

            // ✅ Création de la formation
            Formation formation = new Formation();
            formation.setTitre(titre);
            formation.setDescription(description);
            formation.setCategorie(Categorie.valueOf(categorieStr)); // ⚠️ enum doit être DEBUTANT ou AVANCE
            formation.setPdf("uploads/pdfs/" + pdfFilename);
            formation.setVideo("uploads/videos/" + videoFilename);
            formation.setImage("uploads/images/" + imageFilename);  // <-- set image

            formation.setUser(user);

            // 💾 Sauvegarde en base
            Formation saved = formationService.saveFormation(formation);

            return ResponseEntity.status(201).body(Map.of(
                    "message", "Formation créée avec succès",
                    "formationId", saved.getId()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }



    @GetMapping
    public List<Formation> getAllFormations() {
        logger.info("📢 Requête reçue : GET /api/formations");
        List<Formation> formations = formationService.getAllFormations();
        logger.info("✅ {} formations trouvées", formations.size());
        return formations;
    }
    @GetMapping("/{id}")
    public Optional<Formation> getFormation(@PathVariable Long id) {
        return formationService.getFormationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteFormation(@PathVariable Long id) {
        formationService.deleteFormation(id);
    }
}
