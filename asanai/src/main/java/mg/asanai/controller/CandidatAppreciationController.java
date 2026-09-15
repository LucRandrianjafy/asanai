package mg.asanai.controller;

import mg.asanai.model.CandidatAppreciation;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.CandidatAppreciationService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidat-appreciation")
public class CandidatAppreciationController {

    private final CandidatAppreciationService candidatAppreciationService;
    private final JwtUtil jwtUtil;

    public CandidatAppreciationController(
            CandidatAppreciationService candidatAppreciationService,
            JwtUtil jwtUtil) {

        this.candidatAppreciationService =
                candidatAppreciationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllCandidatAppreciation(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<CandidatAppreciation> liste =
                candidatAppreciationService
                        .getAllCandidatAppreciation();

        return ResponseEntity.ok(liste);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        CandidatAppreciation candidatAppreciation =
                candidatAppreciationService.getById(id);

        return ResponseEntity.ok(candidatAppreciation);
    }

    @GetMapping("/user-information/{idUserInformation}")
    public ResponseEntity<?> getByUserInformationId(
            @PathVariable Long idUserInformation,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<CandidatAppreciation> liste =
                candidatAppreciationService
                        .getByUserInformationId(idUserInformation);

        return ResponseEntity.ok(liste);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody CandidatAppreciation candidatAppreciation,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        candidatAppreciationService.create(
                candidatAppreciation);

        return ResponseEntity.ok(
                "Appréciation du candidat créée avec succès");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody CandidatAppreciation candidatAppreciation,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        candidatAppreciation.setId(id);

        candidatAppreciationService.update(
                candidatAppreciation);

        return ResponseEntity.ok(
                "Appréciation du candidat modifiée avec succès");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        candidatAppreciationService.delete(id);

        return ResponseEntity.ok(
                "Appréciation du candidat supprimée avec succès");
    }
}