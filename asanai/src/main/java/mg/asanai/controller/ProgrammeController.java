package mg.asanai.controller;

import mg.asanai.model.Programme;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.ProgrammeService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programme")
public class ProgrammeController {

    private final ProgrammeService programmeService;
    private final JwtUtil jwtUtil;

    public ProgrammeController(
            ProgrammeService programmeService,
            JwtUtil jwtUtil) {

        this.programmeService = programmeService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllProgramme(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Programme> programmeList =
                programmeService.getAllProgramme();

        return ResponseEntity.ok(programmeList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProgrammeById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Programme programme =
                programmeService.getProgrammeById(id);

        return ResponseEntity.ok(programme);
    }

    @PostMapping
    public ResponseEntity<?> createProgramme(
            @RequestBody Programme programme,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Programme nouveauProgramme =
                programmeService.createProgramme(programme);

        return ResponseEntity.ok(nouveauProgramme);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgramme(
            @PathVariable Long id,
            @RequestBody Programme programme,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Programme programmeModifie =
                programmeService.updateProgramme(id, programme);

        return ResponseEntity.ok(programmeModifie);
    }
}