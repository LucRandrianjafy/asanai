package mg.asanai.repository;

import mg.asanai.model.CandidatAppreciation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CandidatAppreciationRepository {

    private final JdbcTemplate jdbcTemplate;

    public CandidatAppreciationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CandidatAppreciation> rowMapper =
            new RowMapper<CandidatAppreciation>() {

                @Override
                public CandidatAppreciation mapRow(
                        ResultSet rs,
                        int rowNum) throws SQLException {

                    CandidatAppreciation candidatAppreciation =
                            new CandidatAppreciation();

                    candidatAppreciation.setId(
                            rs.getLong("id"));

                    candidatAppreciation.setIdUserInformation(
                            rs.getLong("id_user_information"));

                    candidatAppreciation.setIdRh(
                            rs.getLong("id_rh"));

                    candidatAppreciation.setIdCritere(
                            rs.getLong("id_critere"));

                    candidatAppreciation.setIdAppreciation(
                            rs.getLong("id_appreciation"));

                    if (rs.getTimestamp("date_appreciation") != null) {
                        candidatAppreciation.setDateAppreciation(
                                rs.getTimestamp("date_appreciation")
                                        .toLocalDateTime());
                    }

                    return candidatAppreciation;
                }
            };

    public List<CandidatAppreciation> getAllCandidatAppreciation() {

        String sql = """
                SELECT *
                FROM candidat_appreciation
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    public CandidatAppreciation getById(Long id) {

        String sql = """
                SELECT *
                FROM candidat_appreciation
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                rowMapper,
                id
        );
    }

    public List<CandidatAppreciation> getByUserInformationId(
            Long idUserInformation) {

        String sql = """
                SELECT *
                FROM candidat_appreciation
                WHERE id_user_information = ?
                ORDER BY id
                """;

        return jdbcTemplate.query(
                sql,
                rowMapper,
                idUserInformation
        );
    }

    public List<CandidatAppreciation> getByRhId(Long idRh) {

        String sql = """
                SELECT *
                FROM candidat_appreciation
                WHERE id_rh = ?
                ORDER BY id
                """;

        return jdbcTemplate.query(
                sql,
                rowMapper,
                idRh
        );
    }

    public void create(
            CandidatAppreciation candidatAppreciation) {

        String sql = """
                INSERT INTO candidat_appreciation
                (
                    id_user_information,
                    id_rh,
                    id_critere,
                    id_appreciation
                )
                VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                candidatAppreciation.getIdUserInformation(),
                candidatAppreciation.getIdRh(),
                candidatAppreciation.getIdCritere(),
                candidatAppreciation.getIdAppreciation()
        );
    }

    public void update(
            CandidatAppreciation candidatAppreciation) {

        String sql = """
                UPDATE candidat_appreciation
                SET
                    id_user_information = ?,
                    id_rh = ?,
                    id_critere = ?,
                    id_appreciation = ?
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                candidatAppreciation.getIdUserInformation(),
                candidatAppreciation.getIdRh(),
                candidatAppreciation.getIdCritere(),
                candidatAppreciation.getIdAppreciation(),
                candidatAppreciation.getId()
        );
    }

    public void delete(Long id) {

        String sql = """
                DELETE FROM candidat_appreciation
                WHERE id = ?
                """;

        jdbcTemplate.update(sql, id);
    }
}