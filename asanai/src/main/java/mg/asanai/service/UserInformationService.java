package mg.asanai.service;

import mg.asanai.model.UserInformation;
import mg.asanai.repository.UserInformationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserInformationService {

    private final UserInformationRepository userInformationRepository;

    public UserInformationService(
            UserInformationRepository userInformationRepository
    ) {
        this.userInformationRepository =
                userInformationRepository;
    }

    public List<UserInformation> getAllUserInformation() {
        return userInformationRepository
                .getAllUserInformation();
    }

    public UserInformation getUserInformationById(Long id) {
        return userInformationRepository
                .getUserInformationById(id);
    }

    public UserInformation getUserInformationByUserId(Long idUser) {
        return userInformationRepository
                .getUserInformationByUserId(idUser);
    }

    public UserInformation createUserInformation(
            UserInformation information
    ) {
        return userInformationRepository
                .createUserInformation(information);
    }

    public UserInformation updateUserInformation(
            Long id,
            UserInformation information
    ) {
        return userInformationRepository
                .updateUserInformation(id, information);
    }

    public void deleteUserInformation(Long id) {
        userInformationRepository
                .deleteUserInformation(id);
    }
}
