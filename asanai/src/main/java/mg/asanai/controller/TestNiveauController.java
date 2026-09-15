package mg.asanai.controller;

import mg.asanai.model.JwtUtil;
import mg.asanai.model.TestNiveau;
import mg.asanai.service.TestNiveauService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-niveau")
public class TestNiveauController {

    private final TestNiveauService testNiveauService;
    private final JwtUtil jwtUtil;

    public TestNiveauController(
            TestNiveauService testNiveauService,
            JwtUtil jwtUtil) {

        this.testNiveauService = testNiveauService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllTestNiveau(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<TestNiveau> testNiveauList =
                testNiveauService.getAllTestNiveau();

        return ResponseEntity.ok(testNiveauList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTestNiveauById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        try {

            TestNiveau testNiveau =
                    testNiveauService.getTestNiveauById(id);

            if (testNiveau == null) {

                return ResponseEntity
                        .status(404)
                        .body("Test de niveau introuvable");
            }

            return ResponseEntity.ok(testNiveau);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(404)
                    .body("Test de niveau introuvable");
        }
    }

    @GetMapping("/user/{idUsers}")
    public ResponseEntity<?> getTestNiveauByUserId(
            @PathVariable Long idUsers,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<TestNiveau> testNiveauList =
                testNiveauService.getTestNiveauByUserId(idUsers);

        return ResponseEntity.ok(testNiveauList);
    }

    @PostMapping
    public ResponseEntity<?> createTestNiveau(
            @RequestBody TestNiveau testNiveau,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        try {

            if (testNiveau == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Les données du test sont obligatoires");
            }

            if (testNiveau.getDescription() == null ||
                    testNiveau.getDescription().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("La description est obligatoire");
            }

            if (testNiveau.getStartDate() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("La date de début est obligatoire");
            }

            if (testNiveau.getEndDate() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("La date de fin est obligatoire");
            }

            if (testNiveau.getIdTestType() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Le type de test est obligatoire");
            }

            if (testNiveau.getIdUsers() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("L'utilisateur est obligatoire");
            }

            if (testNiveau.getEndDate()
                    .isBefore(testNiveau.getStartDate())) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "La date de fin doit être supérieure ou égale à la date de début"
                        );
            }

            TestNiveau createdTestNiveau =
                    testNiveauService.createTestNiveau(testNiveau);

            return ResponseEntity
                    .status(201)
                    .body(createdTestNiveau);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "Erreur lors de la création du test de niveau : "
                                    + e.getMessage()
                    );
        }
    }
}