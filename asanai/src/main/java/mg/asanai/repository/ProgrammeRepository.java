package mg.asanai.repository;

import mg.asanai.model.Programme;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ProgrammeRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProgrammeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Programme> programmeRowMapper = new RowMapper<Programme>() {

        @Override
        public Programme mapRow(ResultSet rs, int rowNum) throws SQLException {

            Programme programme = new Programme();

            programme.setId(rs.getLong("id"));
            programme.setNom(rs.getString("nom"));
            programme.setStatut(rs.getBoolean("statut"));

            return programme;
        }
    };

    public List<Programme> getAllProgramme() {

        String sql = """
                SELECT id, nom, statut
                FROM programme
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, programmeRowMapper);
    }

    public Programme getProgrammeById(Long id) {

        String sql = """
                SELECT id, nom, statut
                FROM programme
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                programmeRowMapper,
                id
        );
    }

    public Programme createProgramme(Programme programme) {

        String sql = """
                INSERT INTO programme (nom, statut)
                VALUES (?, ?)
                RETURNING id, nom, statut
                """;

        return jdbcTemplate.queryForObject(
                sql,
                programmeRowMapper,
                programme.getNom(),
                programme.getStatut() != null
                        ? programme.getStatut()
                        : true
        );
    }

    public Programme updateProgramme(Long id, Programme programme) {

        String sql = """
                UPDATE programme
                SET nom = ?, statut = ?
                WHERE id = ?
                RETURNING id, nom, statut
                """;

        return jdbcTemplate.queryForObject(
                sql,
                programmeRowMapper,
                programme.getNom(),
                programme.getStatut(),
                id
        );
    }
}