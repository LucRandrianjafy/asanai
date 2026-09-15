package mg.asanai.controller;

import mg.asanai.model.CritereAppreciation;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.CritereAppreciationService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/critere-appreciation")
public class CritereAppreciationController {

    private final CritereAppreciationService critereAppreciationService;
    private final JwtUtil jwtUtil;

    public CritereAppreciationController(
            CritereAppreciationService critereAppreciationService,
            JwtUtil jwtUtil) {

        this.critereAppreciationService = critereAppreciationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllCritereAppreciation(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<CritereAppreciation> liste =
                critereAppreciationService.getAllCritereAppreciation();

        return ResponseEntity.ok(liste);
    }

    @GetMapping("/actif")
    public ResponseEntity<?> getAllCritereAppreciationActif(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<CritereAppreciation> liste =
                critereAppreciationService.getAllCritereAppreciationActif();

        return ResponseEntity.ok(liste);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCritereAppreciationById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        CritereAppreciation critere =
                critereAppreciationService.getCritereAppreciationById(id);

        return ResponseEntity.ok(critere);
    }

    @PostMapping
    public ResponseEntity<?> createCritereAppreciation(
            @RequestBody CritereAppreciation critere,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        critereAppreciationService.createCritereAppreciation(critere);

        return ResponseEntity.ok("Critère créé avec succès");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCritereAppreciation(
            @PathVariable Long id,
            @RequestBody CritereAppreciation critere,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        critere.setId(id);

        critereAppreciationService.updateCritereAppreciation(critere);

        return ResponseEntity.ok("Critère modifié avec succès");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCritereAppreciation(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        critereAppreciationService.deleteCritereAppreciation(id);

        return ResponseEntity.ok("Critère supprimé avec succès");
    }
}