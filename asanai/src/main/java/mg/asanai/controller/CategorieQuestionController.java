package mg.asanai.controller;

import mg.asanai.model.CategorieQuestion;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.CategorieQuestionService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorie-question")
public class CategorieQuestionController {

    private final CategorieQuestionService categorieQuestionService;
    private final JwtUtil jwtUtil;

    public CategorieQuestionController(
            CategorieQuestionService categorieQuestionService,
            JwtUtil jwtUtil) {

        this.categorieQuestionService = categorieQuestionService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllCategorieQuestion(HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<CategorieQuestion> categorieQuestionList =
                categorieQuestionService.getAllCategorieQuestion();

        return ResponseEntity.ok(categorieQuestionList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategorieQuestionById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        CategorieQuestion categorieQuestion =
                categorieQuestionService.getCategorieQuestionById(id);

        return ResponseEntity.ok(categorieQuestion);
    }
}