package mg.asanai.controller;

import mg.asanai.model.CandidatScoreFinal;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.CandidatScoreFinalService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidats-scores")
public class CandidatScoreFinalController {

    private final CandidatScoreFinalService service;
    private final JwtUtil jwtUtil;

    public CandidatScoreFinalController(
            CandidatScoreFinalService service,
            JwtUtil jwtUtil) {

        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllCandidatsScores(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<CandidatScoreFinal> candidats =
                service.getAllCandidatsScores();

        return ResponseEntity.ok(candidats);
    }

    @GetMapping("/{idUser}")
    public ResponseEntity<?> getCandidatScoreById(
            @PathVariable Long idUser,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        CandidatScoreFinal candidat =
                service.getCandidatScoreById(idUser);

        return ResponseEntity.ok(candidat);
    }
}