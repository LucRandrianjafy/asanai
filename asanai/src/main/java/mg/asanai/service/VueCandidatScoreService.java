package mg.asanai.service;

import mg.asanai.model.VueCandidatScore;
import mg.asanai.repository.VueCandidatScoreRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VueCandidatScoreService {

    private final VueCandidatScoreRepository candidatRepository;

    public VueCandidatScoreService(
            VueCandidatScoreRepository candidatRepository) {

        this.candidatRepository = candidatRepository;
    }

    public List<VueCandidatScore> getAllCandidats() {

        return candidatRepository.getAllCandidats();
    }

    public VueCandidatScore getCandidatById(Long idUser) {

        return candidatRepository.getCandidatById(idUser);
    }
}