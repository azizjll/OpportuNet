package com.example.demo.Serivce;



import com.example.demo.Entities.RendezVous;
import com.example.demo.Entities.User;
import com.example.demo.Repository.RendezVousRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;

    public RendezVousService(RendezVousRepository rendezVousRepository) {
        this.rendezVousRepository = rendezVousRepository;
    }

    public List<RendezVous> getRendezVousByUser(User user) {
        return rendezVousRepository.findByUser(user);
    }

    public RendezVous createRendezVous(RendezVous rendezVous) {
        return rendezVousRepository.save(rendezVous);
    }

    public Optional<RendezVous> updateRendezVousForUser(Long id, RendezVous updated, User user) {
        return rendezVousRepository.findById(id).filter(r -> r.getUser().getId().equals(user.getId()))
                .map(existing -> {
                    existing.setTitre(updated.getTitre());
                    existing.setDescription(updated.getDescription());
                    existing.setDate(updated.getDate());
                    existing.setStartTime(updated.getStartTime());
                    existing.setEndTime(updated.getEndTime());
                    return rendezVousRepository.save(existing);
                });
    }

    public boolean deleteRendezVousForUser(Long id, User user) {
        return rendezVousRepository.findById(id)
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .map(r -> {
                    rendezVousRepository.delete(r);
                    return true;
                }).orElse(false);
    }
}
