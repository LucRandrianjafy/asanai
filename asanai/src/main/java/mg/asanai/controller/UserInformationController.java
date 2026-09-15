package mg.asanai.controller;

import mg.asanai.model.JwtUtil;
import mg.asanai.model.UserInformation;
import mg.asanai.service.UserInformationService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-information")
public class UserInformationController {

    private final UserInformationService userInformationService;
    private final JwtUtil jwtUtil;

    public UserInformationController(
            UserInformationService userInformationService,
            JwtUtil jwtUtil
    ) {
        this.userInformationService = userInformationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllUserInformation(
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<UserInformation> informationList =
                userInformationService
                        .getAllUserInformation();

        return ResponseEntity.ok(informationList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserInformationById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        UserInformation information =
                userInformationService
                        .getUserInformationById(id);

        return ResponseEntity.ok(information);
    }

    @GetMapping("/user/{idUser}")
    public ResponseEntity<?> getUserInformationByUserId(
            @PathVariable Long idUser,
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        UserInformation information =
                userInformationService
                        .getUserInformationByUserId(idUser);

        return ResponseEntity.ok(information);
    }

    @PostMapping
    public ResponseEntity<?> createUserInformation(
            @RequestBody UserInformation information,
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        try {

            UserInformation createdInformation =
                    userInformationService
                            .createUserInformation(information);

            return ResponseEntity
                    .status(201)
                    .body(createdInformation);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(400)
                    .body(
                            "Erreur lors de l'enregistrement des informations"
                    );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserInformation(
            @PathVariable Long id,
            @RequestBody UserInformation information,
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        try {

            UserInformation updatedInformation =
                    userInformationService
                            .updateUserInformation(id, information);

            return ResponseEntity.ok(updatedInformation);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(400)
                    .body(
                            "Erreur lors de la modification des informations"
                    );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserInformation(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        try {

            userInformationService
                    .deleteUserInformation(id);

            return ResponseEntity.ok(
                    "Informations supprimées avec succès"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(400)
                    .body(
                            "Erreur lors de la suppression des informations"
                    );
        }
    }
}