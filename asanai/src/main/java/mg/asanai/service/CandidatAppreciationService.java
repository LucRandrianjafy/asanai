package mg.asanai.service;

import mg.asanai.model.CandidatAppreciation;
import mg.asanai.repository.CandidatAppreciationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidatAppreciationService {

    private final CandidatAppreciationRepository candidatAppreciationRepository;

    public CandidatAppreciationService(
            CandidatAppreciationRepository candidatAppreciationRepository) {

        this.candidatAppreciationRepository =
                candidatAppreciationRepository;
    }

    public List<CandidatAppreciation> getAllCandidatAppreciation() {

        return candidatAppreciationRepository
                .getAllCandidatAppreciation();
    }

    public List<CandidatAppreciation> getByUserInformationId(
            Long idUserInformation) {

        return candidatAppreciationRepository
                .getByUserInformationId(idUserInformation);
    }

    public CandidatAppreciation getById(Long id) {

        return candidatAppreciationRepository.getById(id);
    }

    public void create(CandidatAppreciation candidatAppreciation) {

        candidatAppreciationRepository
                .create(candidatAppreciation);
    }

    public void update(CandidatAppreciation candidatAppreciation) {

        candidatAppreciationRepository
                .update(candidatAppreciation);
    }

    public void delete(Long id) {

        candidatAppreciationRepository.delete(id);
    }
}