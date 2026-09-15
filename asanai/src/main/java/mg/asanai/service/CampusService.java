package mg.asanai.service;

import mg.asanai.model.Campus;
import mg.asanai.repository.CampusRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampusService {

    private final CampusRepository campusRepository;

    public CampusService(CampusRepository campusRepository) {
        this.campusRepository = campusRepository;
    }

    public List<Campus> getAllCampus() {
        return campusRepository.findAll();
    }

    public Campus getCampusById(Long id) {
        return campusRepository.findById(id);
    }

    public Campus createCampus(Campus campus) {
        return campusRepository.save(campus);
    }

    public Campus updateCampus(Long id, Campus campus) {
        return campusRepository.update(id, campus);
    }

    public boolean deleteCampus(Long id) {
        return campusRepository.delete(id);
    }
}