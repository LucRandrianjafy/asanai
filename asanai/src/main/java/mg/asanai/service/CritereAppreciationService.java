package mg.asanai.service;

import mg.asanai.model.CritereAppreciation;
import mg.asanai.repository.CritereAppreciationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CritereAppreciationService {

    private final CritereAppreciationRepository critereAppreciationRepository;

    public CritereAppreciationService(
            CritereAppreciationRepository critereAppreciationRepository) {

        this.critereAppreciationRepository = critereAppreciationRepository;
    }

    public List<CritereAppreciation> getAllCritereAppreciation() {
        return critereAppreciationRepository.getAllCritereAppreciation();
    }

    public List<CritereAppreciation> getAllCritereAppreciationActif() {
        return critereAppreciationRepository.getAllCritereAppreciationActif();
    }

    public CritereAppreciation getCritereAppreciationById(Long id) {
        return critereAppreciationRepository.getCritereAppreciationById(id);
    }

    public int createCritereAppreciation(CritereAppreciation critere) {
        return critereAppreciationRepository.createCritereAppreciation(critere);
    }

    public int updateCritereAppreciation(CritereAppreciation critere) {
        return critereAppreciationRepository.updateCritereAppreciation(critere);
    }

    public int deleteCritereAppreciation(Long id) {
        return critereAppreciationRepository.deleteCritereAppreciation(id);
    }
}