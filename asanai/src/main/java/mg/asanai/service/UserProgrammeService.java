package mg.asanai.service;

import mg.asanai.model.UserProgramme;
import mg.asanai.repository.UserProgrammeRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProgrammeService {

    private final UserProgrammeRepository userProgrammeRepository;

    public UserProgrammeService(
            UserProgrammeRepository userProgrammeRepository) {

        this.userProgrammeRepository = userProgrammeRepository;
    }

    public List<UserProgramme> getAllUserProgramme() {
        return userProgrammeRepository.getAllUserProgramme();
    }

    public UserProgramme getUserProgrammeById(Long id) {
        return userProgrammeRepository.getUserProgrammeById(id);
    }

    public List<UserProgramme> getUserProgrammeByProgrammeId(
            Long programmeId) {

        return userProgrammeRepository
                .getUserProgrammeByProgrammeId(programmeId);
    }
}