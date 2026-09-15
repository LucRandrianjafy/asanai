package mg.asanai.service;

import mg.asanai.model.CandidatScoreFinal;
import mg.asanai.repository.CandidatScoreFinalRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidatScoreFinalService {

    private final CandidatScoreFinalRepository repository;

    public CandidatScoreFinalService(
            CandidatScoreFinalRepository repository) {

        this.repository = repository;
    }

    public List<CandidatScoreFinal> getAllCandidatsScores() {
        return repository.getAllCandidatsScores();
    }

    public CandidatScoreFinal getCandidatScoreById(Long idUser) {
        return repository.getCandidatScoreById(idUser);
    }
}