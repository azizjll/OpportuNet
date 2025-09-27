package com.example.demo.Controller;


import com.example.demo.Entities.Certificat;
import com.example.demo.Entities.Formation;
import com.example.demo.Entities.User;
import com.example.demo.Repository.CertificatRepository;
import com.example.demo.Repository.FormationRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Serivce.TaskService;
import com.example.demo.Serivce.UserService;
import com.example.demo.ServiceAvancé.CertificatService;
import com.example.demo.ServiceAvancé.JwtService;
import com.example.demo.dto.CertificatRequest;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CertificatRepository certificatRepository;

    @Autowired
    private CertificatService certificatService;

    @Autowired
    private FormationRepository formationRepository;




    @GetMapping("/encadrant/{email}/candidats")
    public List<User> getCandidatsEncadres(@PathVariable String email,
                                           @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token JWT manquant ou invalide");
        }

        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);

        if (!"ENCADRANT".equals(role)) {
            throw new RuntimeException("Accès refusé : rôle non autorisé");
        }

        // Récupérer l'encadrant à partir de l'email
        User encadrant = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));

        return userService.getCandidatsEncadres(encadrant.getId());
    }





    // Récupérer tous les utilisateurs (ADMIN uniquement)
    @GetMapping("/all")
    public List<User> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.getAllUsers();
    }

    // Accepter un utilisateur
    @PutMapping("/{id}/accept")
    public User acceptUser(@RequestHeader("Authorization") String authHeader,
                           @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.acceptUser(id);
    }

    // Vérifier un utilisateur
    @PutMapping("/{id}/verify")
    public User verifyUser(@RequestHeader("Authorization") String authHeader,
                           @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.verifyUser(id);
    }

    // Bloquer un utilisateur
    @PutMapping("/{id}/block")
    public User blockUser(@RequestHeader("Authorization") String authHeader,
                          @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return userService.blockUser(id);
    }

    @PostMapping("/certificat/generer")
    public ResponseEntity<Certificat> genererCertificat(
            @RequestBody CertificatRequest request,
            @RequestHeader("Authorization") String authHeader) throws Exception {

        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }

        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Formation formation = formationRepository.findById(request.getFormationId())
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));

        Certificat certificat = certificatService.genererEtSauvegarderCertificat(user, formation);

        return ResponseEntity.ok(certificat);
    }

    @GetMapping("/certificat/{id}")
    public ResponseEntity<Resource> downloadCertificat(@PathVariable Long id) throws IOException {
        Certificat certificat = certificatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificat introuvable"));

        File file = new File(certificat.getFichierPdf());
        if (!file.exists()) {
            throw new RuntimeException("Fichier PDF non trouvé");
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource); // ✅ plus besoin de cast
    }

    @GetMapping("/certificats/all")
    public List<Certificat> getAllCertificats(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        return certificatRepository.findAll();
    }






    // Endpoint pour mettre à jour l'image
    @PostMapping("/upload-image")
    public User uploadUserImage(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token JWT manquant ou invalide");
        }

        // Extraire l'email depuis le token
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);

        // Récupérer l'utilisateur
        User user = userService.getUserByEmail(email);

        // Upload sur Cloudinary et mise à jour de l'utilisateur
        return userService.updateUserImage(user.getId(), file);
    }


    @DeleteMapping("/{id}")
    public void deleteUser(@RequestHeader("Authorization") String authHeader,
                           @PathVariable Long id) {
        String token = authHeader.substring(7);
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied");
        }
        userService.deleteUser(id);
    }


}
