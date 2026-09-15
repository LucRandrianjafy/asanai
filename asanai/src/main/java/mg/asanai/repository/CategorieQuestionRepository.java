package mg.asanai.repository;

import mg.asanai.model.CategorieQuestion;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CategorieQuestionRepository {

    private final JdbcTemplate jdbcTemplate;

    public CategorieQuestionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CategorieQuestion> getAllCategorieQuestion() {

        String sql = "SELECT * FROM categorie_question ORDER BY id";

        return jdbcTemplate.query(sql, new RowMapper<CategorieQuestion>() {

            @Override
            public CategorieQuestion mapRow(ResultSet rs, int rowNum) throws SQLException {

                CategorieQuestion categorieQuestion = new CategorieQuestion();

                categorieQuestion.setId(rs.getLong("id"));
                categorieQuestion.setDescription(rs.getString("description"));

                return categorieQuestion;
            }
        });
    }

    public CategorieQuestion getCategorieQuestionById(Long id) {

        String sql = "SELECT * FROM categorie_question WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, new RowMapper<CategorieQuestion>() {

            @Override
            public CategorieQuestion mapRow(ResultSet rs, int rowNum) throws SQLException {

                CategorieQuestion categorieQuestion = new CategorieQuestion();

                categorieQuestion.setId(rs.getLong("id"));
                categorieQuestion.setDescription(rs.getString("description"));

                return categorieQuestion;
            }
        }, id);
    }
}