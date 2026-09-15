package mg.asanai.controller;

import mg.asanai.model.JwtUtil;
import mg.asanai.model.TestNiveauQuestion;
import mg.asanai.service.TestNiveauQuestionService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-niveau-question")
public class TestNiveauQuestionController {

    private final TestNiveauQuestionService testNiveauQuestionService;
    private final JwtUtil jwtUtil;

    public TestNiveauQuestionController(
            TestNiveauQuestionService testNiveauQuestionService,
            JwtUtil jwtUtil) {

        this.testNiveauQuestionService =
                testNiveauQuestionService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllTestNiveauQuestion(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<TestNiveauQuestion> questionList =
                testNiveauQuestionService
                        .getAllTestNiveauQuestion();

        return ResponseEntity.ok(questionList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTestNiveauQuestionById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        TestNiveauQuestion question =
                testNiveauQuestionService
                        .getTestNiveauQuestionById(id);

        return ResponseEntity.ok(question);
    }

    @GetMapping("/test/{idTestNiveau}")
    public ResponseEntity<?> getQuestionsByTestNiveauId(
            @PathVariable Long idTestNiveau,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<TestNiveauQuestion> questionList =
                testNiveauQuestionService
                        .getQuestionsByTestNiveauId(idTestNiveau);

        return ResponseEntity.ok(questionList);
    }

    @GetMapping("/categorie/{idCategorieQuestion}")
    public ResponseEntity<?> getQuestionsByCategorieId(
            @PathVariable Long idCategorieQuestion,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<TestNiveauQuestion> questionList =
                testNiveauQuestionService
                        .getQuestionsByCategorieId(idCategorieQuestion);

        return ResponseEntity.ok(questionList);
    }

    @PutMapping("/{id}/answer")
    public ResponseEntity<?> updateAnswerIdx(
                @PathVariable Long id,
                @RequestParam Integer answerIdx,
                HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
                return ResponseEntity
                        .status(401)
                        .body("Token invalide ou manquant");
        }

        boolean updated =
                testNiveauQuestionService
                        .updateAnswerIdx(id, answerIdx);

        if (!updated) {
                return ResponseEntity
                        .status(404)
                        .body("Question introuvable avec l'id : " + id);
        }

        return ResponseEntity.ok(
                "Réponse enregistrée avec succès"
        );
   }

   @PostMapping
   public ResponseEntity<?> createTestNiveauQuestion(
                @RequestBody TestNiveauQuestion question,
                HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
                return ResponseEntity
                        .status(401)
                        .body("Token invalide ou manquant");
        }

        boolean created =
                testNiveauQuestionService
                        .createTestNiveauQuestion(question);

        if (!created) {
                return ResponseEntity
                        .status(400)
                        .body("Impossible de créer la question");
        }

        return ResponseEntity
                .status(201)
                .body("Question créée avec succès");
   }

   @PutMapping("/{id}")
   public ResponseEntity<?> updateTestNiveauQuestion(
                @PathVariable Long id,
                @RequestBody TestNiveauQuestion question,
                HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
                return ResponseEntity
                        .status(401)
                        .body("Token invalide ou manquant");
        }

        boolean updated =
                testNiveauQuestionService
                        .updateTestNiveauQuestion(id, question);

        if (!updated) {
                return ResponseEntity
                        .status(404)
                        .body(
                        "Question introuvable avec l'id : " + id
                        );
        }

        return ResponseEntity.ok(
                "Question modifiée avec succès"
        );
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<?> deleteTestNiveauQuestion(
                @PathVariable Long id,
                HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
                return ResponseEntity
                        .status(401)
                        .body("Token invalide ou manquant");
        }

        boolean deleted =
                testNiveauQuestionService
                        .deleteTestNiveauQuestion(id);

        if (!deleted) {
                return ResponseEntity
                        .status(404)
                        .body(
                        "Question introuvable avec l'id : " + id
                        );
        }

        return ResponseEntity.ok(
                "Question supprimée avec succès"
        );
   }
}