package mg.asanai.service;

import mg.asanai.model.DecisionFinale;
import mg.asanai.repository.DecisionFinaleRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DecisionFinaleService {

    private final DecisionFinaleRepository decisionFinaleRepository;

    public DecisionFinaleService(
            DecisionFinaleRepository decisionFinaleRepository) {

        this.decisionFinaleRepository =
                decisionFinaleRepository;
    }

    public List<DecisionFinale> getAllDecisionFinale() {

        return decisionFinaleRepository
                .getAllDecisionFinale();
    }

    public DecisionFinale getById(Long id) {

        return decisionFinaleRepository
                .getById(id);
    }

    public DecisionFinale getByUserInformationId(
            Long idUserInformation) {

        return decisionFinaleRepository
                .getByUserInformationId(idUserInformation);
    }

    public List<DecisionFinale> getByRhId(Long idRh) {

        return decisionFinaleRepository
                .getByRhId(idRh);
    }

    public void create(DecisionFinale decisionFinale) {

        decisionFinaleRepository
                .create(decisionFinale);
    }

    public void update(DecisionFinale decisionFinale) {

        decisionFinaleRepository
                .update(decisionFinale);
    }

    public void delete(Long id) {

        decisionFinaleRepository.delete(id);
    }
}