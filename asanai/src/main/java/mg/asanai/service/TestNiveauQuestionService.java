package mg.asanai.service;

import mg.asanai.model.TestNiveauQuestion;
import mg.asanai.repository.TestNiveauQuestionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestNiveauQuestionService {

    private final TestNiveauQuestionRepository testNiveauQuestionRepository;

    public TestNiveauQuestionService(
            TestNiveauQuestionRepository testNiveauQuestionRepository) {

        this.testNiveauQuestionRepository =
                testNiveauQuestionRepository;
    }

    public List<TestNiveauQuestion> getAllTestNiveauQuestion() {
        return testNiveauQuestionRepository.getAllTestNiveauQuestion();
    }

    public TestNiveauQuestion getTestNiveauQuestionById(Long id) {
        return testNiveauQuestionRepository.getTestNiveauQuestionById(id);
    }

    public List<TestNiveauQuestion> getQuestionsByTestNiveauId(
            Long idTestNiveau) {

        return testNiveauQuestionRepository
                .getQuestionsByTestNiveauId(idTestNiveau);
    }

    public List<TestNiveauQuestion> getQuestionsByCategorieId(
            Long idCategorieQuestion) {

        return testNiveauQuestionRepository
                .getQuestionsByCategorieId(idCategorieQuestion);
    }

    public boolean updateAnswerIdx(
        Long id,
        Integer answerIdx) {

        int rowsUpdated =
                testNiveauQuestionRepository
                        .updateAnswerIdx(id, answerIdx);

        return rowsUpdated > 0;
    }

    public boolean createTestNiveauQuestion(
        TestNiveauQuestion question) {

        int rowsInserted =
                testNiveauQuestionRepository
                        .createTestNiveauQuestion(question);

        return rowsInserted > 0;
    }


    public boolean updateTestNiveauQuestion(
            Long id,
            TestNiveauQuestion question) {

        int rowsUpdated =
                testNiveauQuestionRepository
                        .updateTestNiveauQuestion(id, question);

        return rowsUpdated > 0;
    }


    public boolean deleteTestNiveauQuestion(Long id) {

        int rowsDeleted =
                testNiveauQuestionRepository
                        .deleteTestNiveauQuestion(id);

        return rowsDeleted > 0;
    }
}