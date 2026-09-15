package mg.asanai.service;

import mg.asanai.model.CategorieQuestion;
import mg.asanai.repository.CategorieQuestionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategorieQuestionService {

    private final CategorieQuestionRepository categorieQuestionRepository;

    public CategorieQuestionService(CategorieQuestionRepository categorieQuestionRepository) {
        this.categorieQuestionRepository = categorieQuestionRepository;
    }

    public List<CategorieQuestion> getAllCategorieQuestion() {
        return categorieQuestionRepository.getAllCategorieQuestion();
    }

    public CategorieQuestion getCategorieQuestionById(Long id) {
        return categorieQuestionRepository.getCategorieQuestionById(id);
    }
}