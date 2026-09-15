package mg.asanai.service;

import mg.asanai.model.TestNiveau;
import mg.asanai.repository.TestNiveauRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestNiveauService {

    private final TestNiveauRepository testNiveauRepository;

    public TestNiveauService(
            TestNiveauRepository testNiveauRepository) {

        this.testNiveauRepository = testNiveauRepository;
    }

    public List<TestNiveau> getAllTestNiveau() {

        return testNiveauRepository.getAllTestNiveau();
    }

    public TestNiveau getTestNiveauById(Long id) {

        return testNiveauRepository.getTestNiveauById(id);
    }

    public List<TestNiveau> getTestNiveauByUserId(Long idUsers) {

        return testNiveauRepository.getTestNiveauByUserId(idUsers);
    }

    public TestNiveau createTestNiveau(TestNiveau testNiveau) {

        return testNiveauRepository.createTestNiveau(testNiveau);
    }
}