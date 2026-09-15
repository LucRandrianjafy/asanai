package mg.asanai.repository;

import mg.asanai.model.DecisionFinale;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class DecisionFinaleRepository {

    private final JdbcTemplate jdbcTemplate;

    public DecisionFinaleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DecisionFinale> rowMapper =
            new RowMapper<DecisionFinale>() {

                @Override
                public DecisionFinale mapRow(
                        ResultSet rs,
                        int rowNum) throws SQLException {

                    DecisionFinale decisionFinale =
                            new DecisionFinale();

                    decisionFinale.setId(
                            rs.getLong("id"));

                    decisionFinale.setIdUserInformation(
                            rs.getLong("id_user_information"));

                    decisionFinale.setIdRh(
                            rs.getLong("id_rh"));

                    decisionFinale.setDecision(
                            rs.getString("decision"));

                    if (rs.getTimestamp("date_evaluation") != null) {
                        decisionFinale.setDateEvaluation(
                                rs.getTimestamp("date_evaluation")
                                        .toLocalDateTime());
                    }

                    return decisionFinale;
                }
            };

    public List<DecisionFinale> getAllDecisionFinale() {

        String sql = """
                SELECT *
                FROM decision_finale
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    public DecisionFinale getById(Long id) {

        String sql = """
                SELECT *
                FROM decision_finale
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                rowMapper,
                id
        );
    }

    public DecisionFinale getByUserInformationId(
            Long idUserInformation) {

        String sql = """
                SELECT *
                FROM decision_finale
                WHERE id_user_information = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                rowMapper,
                idUserInformation
        );
    }

    public List<DecisionFinale> getByRhId(Long idRh) {

        String sql = """
                SELECT *
                FROM decision_finale
                WHERE id_rh = ?
                ORDER BY id
                """;

        return jdbcTemplate.query(
                sql,
                rowMapper,
                idRh
        );
    }

    public void create(DecisionFinale decisionFinale) {

        String sql = """
                INSERT INTO decision_finale
                (
                    id_user_information,
                    id_rh,
                    decision
                )
                VALUES (?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                decisionFinale.getIdUserInformation(),
                decisionFinale.getIdRh(),
                decisionFinale.getDecision()
        );
    }

    public void update(DecisionFinale decisionFinale) {

        String sql = """
                UPDATE decision_finale
                SET
                    id_user_information = ?,
                    id_rh = ?,
                    decision = ?
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                decisionFinale.getIdUserInformation(),
                decisionFinale.getIdRh(),
                decisionFinale.getDecision(),
                decisionFinale.getId()
        );
    }

    public void delete(Long id) {

        String sql = """
                DELETE FROM decision_finale
                WHERE id = ?
                """;

        jdbcTemplate.update(sql, id);
    }
}