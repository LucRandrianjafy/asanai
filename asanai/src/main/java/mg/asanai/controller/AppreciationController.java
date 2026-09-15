package mg.asanai.controller;

import mg.asanai.model.Appreciation;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.AppreciationService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appreciation")
public class AppreciationController {

    private final AppreciationService appreciationService;
    private final JwtUtil jwtUtil;

    public AppreciationController(
            AppreciationService appreciationService,
            JwtUtil jwtUtil) {

        this.appreciationService = appreciationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllAppreciation(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Appreciation> liste =
                appreciationService.getAllAppreciation();

        return ResponseEntity.ok(liste);
    }

    @GetMapping("/actif")
    public ResponseEntity<?> getAllAppreciationActif(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Appreciation> liste =
                appreciationService.getAllAppreciationActif();

        return ResponseEntity.ok(liste);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppreciationById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Appreciation appreciation =
                appreciationService.getAppreciationById(id);

        return ResponseEntity.ok(appreciation);
    }

    @GetMapping("/critere/{idCritere}")
    public ResponseEntity<?> getAppreciationByCritereId(
            @PathVariable Long idCritere,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Appreciation> liste =
                appreciationService.getAppreciationByCritereId(idCritere);

        return ResponseEntity.ok(liste);
    }

    @GetMapping("/critere/{idCritere}/actif")
    public ResponseEntity<?> getAppreciationActifByCritereId(
            @PathVariable Long idCritere,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Appreciation> liste =
                appreciationService.getAppreciationActifByCritereId(idCritere);

        return ResponseEntity.ok(liste);
    }

    @PostMapping
    public ResponseEntity<?> createAppreciation(
            @RequestBody Appreciation appreciation,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        appreciationService.createAppreciation(appreciation);

        return ResponseEntity.ok("Appréciation créée avec succès");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppreciation(
            @PathVariable Long id,
            @RequestBody Appreciation appreciation,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        appreciation.setId(id);

        appreciationService.updateAppreciation(appreciation);

        return ResponseEntity.ok("Appréciation modifiée avec succès");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppreciation(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        appreciationService.deleteAppreciation(id);

        return ResponseEntity.ok("Appréciation supprimée avec succès");
    }
}