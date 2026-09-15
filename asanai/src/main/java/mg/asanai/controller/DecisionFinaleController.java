package mg.asanai.controller;

import mg.asanai.model.DecisionFinale;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.DecisionFinaleService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decision-finale")
public class DecisionFinaleController {

    private final DecisionFinaleService decisionFinaleService;
    private final JwtUtil jwtUtil;

    public DecisionFinaleController(
            DecisionFinaleService decisionFinaleService,
            JwtUtil jwtUtil) {

        this.decisionFinaleService =
                decisionFinaleService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllDecisionFinale(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<DecisionFinale> liste =
                decisionFinaleService
                        .getAllDecisionFinale();

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

        DecisionFinale decisionFinale =
                decisionFinaleService.getById(id);

        return ResponseEntity.ok(decisionFinale);
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

        DecisionFinale decisionFinale =
                decisionFinaleService
                        .getByUserInformationId(idUserInformation);

        return ResponseEntity.ok(decisionFinale);
    }

    @GetMapping("/rh/{idRh}")
    public ResponseEntity<?> getByRhId(
            @PathVariable Long idRh,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<DecisionFinale> liste =
                decisionFinaleService.getByRhId(idRh);

        return ResponseEntity.ok(liste);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody DecisionFinale decisionFinale,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        decisionFinaleService.create(decisionFinale);

        return ResponseEntity.ok(
                "Décision finale créée avec succès");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody DecisionFinale decisionFinale,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        decisionFinale.setId(id);

        decisionFinaleService.update(decisionFinale);

        return ResponseEntity.ok(
                "Décision finale modifiée avec succès");
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

        decisionFinaleService.delete(id);

        return ResponseEntity.ok(
                "Décision finale supprimée avec succès");
    }
}