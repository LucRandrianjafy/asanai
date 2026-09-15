package mg.asanai.service;

import mg.asanai.model.Programme;
import mg.asanai.repository.ProgrammeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgrammeService {

    private final ProgrammeRepository programmeRepository;

    public ProgrammeService(ProgrammeRepository programmeRepository) {
        this.programmeRepository = programmeRepository;
    }

    public List<Programme> getAllProgramme() {
        return programmeRepository.getAllProgramme();
    }

    public Programme getProgrammeById(Long id) {
        return programmeRepository.getProgrammeById(id);
    }

    public Programme createProgramme(Programme programme) {

        if (programme.getStatut() == null) {
            programme.setStatut(true);
        }

        return programmeRepository.createProgramme(programme);
    }

    public Programme updateProgramme(Long id, Programme programme) {
        return programmeRepository.updateProgramme(id, programme);
    }
}