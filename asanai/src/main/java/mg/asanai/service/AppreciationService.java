package mg.asanai.service;

import mg.asanai.model.Appreciation;
import mg.asanai.repository.AppreciationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppreciationService {

    private final AppreciationRepository appreciationRepository;

    public AppreciationService(AppreciationRepository appreciationRepository) {
        this.appreciationRepository = appreciationRepository;
    }

    public List<Appreciation> getAllAppreciation() {
        return appreciationRepository.getAllAppreciation();
    }

    public List<Appreciation> getAllAppreciationActif() {
        return appreciationRepository.getAllAppreciationActif();
    }

    public List<Appreciation> getAppreciationByCritereId(Long idCritere) {
        return appreciationRepository.getAppreciationByCritereId(idCritere);
    }

    public List<Appreciation> getAppreciationActifByCritereId(Long idCritere) {
        return appreciationRepository.getAppreciationActifByCritereId(idCritere);
    }

    public Appreciation getAppreciationById(Long id) {
        return appreciationRepository.getAppreciationById(id);
    }

    public int createAppreciation(Appreciation appreciation) {
        return appreciationRepository.createAppreciation(appreciation);
    }

    public int updateAppreciation(Appreciation appreciation) {
        return appreciationRepository.updateAppreciation(appreciation);
    }

    public int deleteAppreciation(Long id) {
        return appreciationRepository.deleteAppreciation(id);
    }
}