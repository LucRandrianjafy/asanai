package mg.asanai.repository;

import mg.asanai.model.TestNiveauQuestion;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class TestNiveauQuestionRepository {

    private final JdbcTemplate jdbcTemplate;

    public TestNiveauQuestionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TestNiveauQuestion> getAllTestNiveauQuestion() {

        String sql = "SELECT * FROM test_niveau_question ORDER BY id";

        return jdbcTemplate.query(sql, new RowMapper<TestNiveauQuestion>() {

            @Override
            public TestNiveauQuestion mapRow(
                    ResultSet rs,
                    int rowNum) throws SQLException {

                TestNiveauQuestion question = new TestNiveauQuestion();

                question.setId(rs.getLong("id"));
                question.setQuestion(rs.getString("question"));
                question.setAnswers(rs.getString("answers"));
                question.setCorrectAnswerIdx(
                        rs.getInt("correct_answer_idx")
                );

                int answerIdx = rs.getInt("answer_idx");

                if (rs.wasNull()) {
                    question.setAnswerIdx(null);
                } else {
                    question.setAnswerIdx(answerIdx);
                }

                question.setPoints(rs.getBigDecimal("points"));
                question.setDureeMinutes(rs.getInt("duree_minutes"));
                question.setIdTestNiveau(
                        rs.getLong("id_test_niveau")
                );
                question.setIdCategorieQuestion(
                        rs.getLong("id_categorie_question")
                );

                return question;
            }
        });
    }

    public TestNiveauQuestion getTestNiveauQuestionById(Long id) {

        String sql = "SELECT * FROM test_niveau_question WHERE id = ?";

        return jdbcTemplate.queryForObject(sql,
                new RowMapper<TestNiveauQuestion>() {

                    @Override
                    public TestNiveauQuestion mapRow(
                            ResultSet rs,
                            int rowNum) throws SQLException {

                        TestNiveauQuestion question =
                                new TestNiveauQuestion();

                        question.setId(rs.getLong("id"));
                        question.setQuestion(
                                rs.getString("question")
                        );
                        question.setAnswers(
                                rs.getString("answers")
                        );
                        question.setCorrectAnswerIdx(
                                rs.getInt("correct_answer_idx")
                        );

                        int answerIdx = rs.getInt("answer_idx");

                        if (rs.wasNull()) {
                            question.setAnswerIdx(null);
                        } else {
                            question.setAnswerIdx(answerIdx);
                        }

                        question.setPoints(
                                rs.getBigDecimal("points")
                        );
                        question.setDureeMinutes(
                                rs.getInt("duree_minutes")
                        );
                        question.setIdTestNiveau(
                                rs.getLong("id_test_niveau")
                        );
                        question.setIdCategorieQuestion(
                                rs.getLong("id_categorie_question")
                        );

                        return question;
                    }
                }, id);
    }

    public List<TestNiveauQuestion> getQuestionsByTestNiveauId(
            Long idTestNiveau) {

        String sql =
                "SELECT * FROM test_niveau_question " +
                "WHERE id_test_niveau = ? ORDER BY id";

        return jdbcTemplate.query(sql,
                new RowMapper<TestNiveauQuestion>() {

                    @Override
                    public TestNiveauQuestion mapRow(
                            ResultSet rs,
                            int rowNum) throws SQLException {

                        TestNiveauQuestion question =
                                new TestNiveauQuestion();

                        question.setId(rs.getLong("id"));
                        question.setQuestion(
                                rs.getString("question")
                        );
                        question.setAnswers(
                                rs.getString("answers")
                        );
                        question.setCorrectAnswerIdx(
                                rs.getInt("correct_answer_idx")
                        );

                        int answerIdx = rs.getInt("answer_idx");

                        if (rs.wasNull()) {
                            question.setAnswerIdx(null);
                        } else {
                            question.setAnswerIdx(answerIdx);
                        }

                        question.setPoints(
                                rs.getBigDecimal("points")
                        );
                        question.setDureeMinutes(
                                rs.getInt("duree_minutes")
                        );
                        question.setIdTestNiveau(
                                rs.getLong("id_test_niveau")
                        );
                        question.setIdCategorieQuestion(
                                rs.getLong("id_categorie_question")
                        );

                        return question;
                    }
                }, idTestNiveau);
    }

    public List<TestNiveauQuestion> getQuestionsByCategorieId(
            Long idCategorieQuestion) {

        String sql =
                "SELECT * FROM test_niveau_question " +
                "WHERE id_categorie_question = ? ORDER BY id";

        return jdbcTemplate.query(sql,
                new RowMapper<TestNiveauQuestion>() {

                    @Override
                    public TestNiveauQuestion mapRow(
                            ResultSet rs,
                            int rowNum) throws SQLException {

                        TestNiveauQuestion question =
                                new TestNiveauQuestion();

                        question.setId(rs.getLong("id"));
                        question.setQuestion(
                                rs.getString("question")
                        );
                        question.setAnswers(
                                rs.getString("answers")
                        );
                        question.setCorrectAnswerIdx(
                                rs.getInt("correct_answer_idx")
                        );

                        int answerIdx = rs.getInt("answer_idx");

                        if (rs.wasNull()) {
                            question.setAnswerIdx(null);
                        } else {
                            question.setAnswerIdx(answerIdx);
                        }

                        question.setPoints(
                                rs.getBigDecimal("points")
                        );
                        question.setDureeMinutes(
                                rs.getInt("duree_minutes")
                        );
                        question.setIdTestNiveau(
                                rs.getLong("id_test_niveau")
                        );
                        question.setIdCategorieQuestion(
                                rs.getLong("id_categorie_question")
                        );

                        return question;
                    }
                }, idCategorieQuestion);
    }

    public int updateAnswerIdx(Long id, Integer answerIdx) {

        String sql =
                "UPDATE test_niveau_question " +
                "SET answer_idx = ? " +
                "WHERE id = ?";

        return jdbcTemplate.update(
                sql,
                answerIdx,
                id
        );
    }

    public int createTestNiveauQuestion(TestNiveauQuestion question) {

        String sql =
                "INSERT INTO test_niveau_question " +
                "(question, answers, correct_answer_idx, answer_idx, " +
                "points, duree_minutes, id_test_niveau, id_categorie_question) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        return jdbcTemplate.update(
                sql,
                question.getQuestion(),
                question.getAnswers(),
                question.getCorrectAnswerIdx(),
                question.getAnswerIdx(),
                question.getPoints(),
                question.getDureeMinutes(),
                question.getIdTestNiveau(),
                question.getIdCategorieQuestion()
        );
        }


        public int updateTestNiveauQuestion(
                Long id,
                TestNiveauQuestion question) {

        String sql =
                "UPDATE test_niveau_question SET " +
                "question = ?, " +
                "answers = ?, " +
                "correct_answer_idx = ?, " +
                "answer_idx = ?, " +
                "points = ?, " +
                "duree_minutes = ?, " +
                "id_test_niveau = ?, " +
                "id_categorie_question = ? " +
                "WHERE id = ?";

        return jdbcTemplate.update(
                sql,
                question.getQuestion(),
                question.getAnswers(),
                question.getCorrectAnswerIdx(),
                question.getAnswerIdx(),
                question.getPoints(),
                question.getDureeMinutes(),
                question.getIdTestNiveau(),
                question.getIdCategorieQuestion(),
                id
        );
        }


        public int deleteTestNiveauQuestion(Long id) {

        String sql =
                "DELETE FROM test_niveau_question " +
                "WHERE id = ?";

        return jdbcTemplate.update(sql, id);
        }
}