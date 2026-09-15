package mg.asanai.repository;

import mg.asanai.model.Campus;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CampusRepository {

    private final JdbcTemplate jdbcTemplate;

    public CampusRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Campus> findAll() {

        String sql = """
            SELECT id, nom
            FROM campus
            ORDER BY id
            """;

        return jdbcTemplate.query(sql, new CampusRowMapper());
    }

    public Campus findById(Long id) {

        String sql = """
            SELECT id, nom
            FROM campus
            WHERE id = ?
            """;

        List<Campus> results = jdbcTemplate.query(
            sql,
            new CampusRowMapper(),
            id
        );

        return results.isEmpty() ? null : results.get(0);
    }

    public Campus save(Campus campus) {

        String sql = """
            INSERT INTO campus (nom)
            VALUES (?)
            RETURNING id, nom
            """;

        return jdbcTemplate.queryForObject(
            sql,
            new CampusRowMapper(),
            campus.getNom()
        );
    }

    public Campus update(Long id, Campus campus) {

        String sql = """
            UPDATE campus
            SET nom = ?
            WHERE id = ?
            RETURNING id, nom
            """;

        List<Campus> results = jdbcTemplate.query(
            sql,
            new CampusRowMapper(),
            campus.getNom(),
            id
        );

        return results.isEmpty() ? null : results.get(0);
    }

    public boolean delete(Long id) {

        String sql = """
            DELETE FROM campus
            WHERE id = ?
            """;

        return jdbcTemplate.update(sql, id) > 0;
    }

    private static class CampusRowMapper implements RowMapper<Campus> {

        @Override
        public Campus mapRow(ResultSet rs, int rowNum) throws SQLException {

            Campus campus = new Campus();

            campus.setId(rs.getLong("id"));
            campus.setNom(rs.getString("nom"));

            return campus;
        }
    }
}