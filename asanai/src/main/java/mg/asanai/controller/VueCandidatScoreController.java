package mg.asanai.controller;

import mg.asanai.model.JwtUtil;
import mg.asanai.model.VueCandidatScore;
import mg.asanai.service.VueCandidatScoreService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vue-candidats-scores")
public class VueCandidatScoreController {

    private final VueCandidatScoreService candidatService;
    private final JwtUtil jwtUtil;


    public VueCandidatScoreController(
            VueCandidatScoreService candidatService,
            JwtUtil jwtUtil) {

        this.candidatService = candidatService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllCandidats(
            HttpServletRequest request) {

        // Vérification JWT
        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }


        List<VueCandidatScore> candidatList =
                candidatService.getAllCandidats();


        return ResponseEntity.ok(candidatList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCandidatById(
            @PathVariable Long id,
            HttpServletRequest request) {

        // Vérification JWT
        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }


        VueCandidatScore candidat =
                candidatService.getCandidatById(id);


        if (candidat == null) {

            return ResponseEntity
                    .status(404)
                    .body("Candidat introuvable");
        }


        return ResponseEntity.ok(candidat);
    }
}