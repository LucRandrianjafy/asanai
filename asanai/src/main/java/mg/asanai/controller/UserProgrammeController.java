package mg.asanai.controller;

import mg.asanai.model.JwtUtil;
import mg.asanai.model.UserProgramme;
import mg.asanai.service.UserProgrammeService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-programme")
public class UserProgrammeController {

    private final UserProgrammeService userProgrammeService;
    private final JwtUtil jwtUtil;

    public UserProgrammeController(
            UserProgrammeService userProgrammeService,
            JwtUtil jwtUtil) {

        this.userProgrammeService = userProgrammeService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllUserProgramme(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<UserProgramme> userProgrammeList =
                userProgrammeService.getAllUserProgramme();

        return ResponseEntity.ok(userProgrammeList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProgrammeById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        UserProgramme userProgramme =
                userProgrammeService.getUserProgrammeById(id);

        return ResponseEntity.ok(userProgramme);
    }

    @GetMapping("/programme/{programmeId}")
    public ResponseEntity<?> getUserProgrammeByProgrammeId(
            @PathVariable Long programmeId,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<UserProgramme> userProgrammeList =
                userProgrammeService
                        .getUserProgrammeByProgrammeId(programmeId);

        return ResponseEntity.ok(userProgrammeList);
    }
}