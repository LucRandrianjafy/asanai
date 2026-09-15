package mg.asanai.repository;

import mg.asanai.model.Appreciation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class AppreciationRepository {

    private final JdbcTemplate jdbcTemplate;

    public AppreciationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Appreciation> getAllAppreciation() {

        String sql = "SELECT * FROM appreciation ORDER BY id";

        return jdbcTemplate.query(sql, new RowMapper<Appreciation>() {

            @Override
            public Appreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                Appreciation appreciation = new Appreciation();

                appreciation.setId(rs.getLong("id"));
                appreciation.setIdCritere(rs.getLong("id_critere"));
                appreciation.setLibelle(rs.getString("libelle"));
                appreciation.setPoints(rs.getDouble("points"));
                appreciation.setStatut(rs.getBoolean("statut"));

                return appreciation;
            }
        });
    }

    public List<Appreciation> getAllAppreciationActif() {

        String sql = """
                SELECT *
                FROM appreciation
                WHERE statut = TRUE
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, new RowMapper<Appreciation>() {

            @Override
            public Appreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                Appreciation appreciation = new Appreciation();

                appreciation.setId(rs.getLong("id"));
                appreciation.setIdCritere(rs.getLong("id_critere"));
                appreciation.setLibelle(rs.getString("libelle"));
                appreciation.setPoints(rs.getDouble("points"));
                appreciation.setStatut(rs.getBoolean("statut"));

                return appreciation;
            }
        });
    }

    public List<Appreciation> getAppreciationByCritereId(Long idCritere) {

        String sql = """
                SELECT *
                FROM appreciation
                WHERE id_critere = ?
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, new RowMapper<Appreciation>() {

            @Override
            public Appreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                Appreciation appreciation = new Appreciation();

                appreciation.setId(rs.getLong("id"));
                appreciation.setIdCritere(rs.getLong("id_critere"));
                appreciation.setLibelle(rs.getString("libelle"));
                appreciation.setPoints(rs.getDouble("points"));
                appreciation.setStatut(rs.getBoolean("statut"));

                return appreciation;
            }
        }, idCritere);
    }

    public List<Appreciation> getAppreciationActifByCritereId(Long idCritere) {

        String sql = """
                SELECT *
                FROM appreciation
                WHERE id_critere = ?
                AND statut = TRUE
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, new RowMapper<Appreciation>() {

            @Override
            public Appreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                Appreciation appreciation = new Appreciation();

                appreciation.setId(rs.getLong("id"));
                appreciation.setIdCritere(rs.getLong("id_critere"));
                appreciation.setLibelle(rs.getString("libelle"));
                appreciation.setPoints(rs.getDouble("points"));
                appreciation.setStatut(rs.getBoolean("statut"));

                return appreciation;
            }
        }, idCritere);
    }

    public Appreciation getAppreciationById(Long id) {

        String sql = "SELECT * FROM appreciation WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, new RowMapper<Appreciation>() {

            @Override
            public Appreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                Appreciation appreciation = new Appreciation();

                appreciation.setId(rs.getLong("id"));
                appreciation.setIdCritere(rs.getLong("id_critere"));
                appreciation.setLibelle(rs.getString("libelle"));
                appreciation.setPoints(rs.getDouble("points"));
                appreciation.setStatut(rs.getBoolean("statut"));

                return appreciation;
            }
        }, id);
    }

    public int createAppreciation(Appreciation appreciation) {

        String sql = """
                INSERT INTO appreciation
                (id_critere, libelle, points, statut)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                appreciation.getIdCritere(),
                appreciation.getLibelle(),
                appreciation.getPoints(),
                appreciation.getStatut()
        );
    }

    public int updateAppreciation(Appreciation appreciation) {

        String sql = """
                UPDATE appreciation
                SET id_critere = ?, libelle = ?, points = ?, statut = ?
                WHERE id = ?
                """;

        return jdbcTemplate.update(
                sql,
                appreciation.getIdCritere(),
                appreciation.getLibelle(),
                appreciation.getPoints(),
                appreciation.getStatut(),
                appreciation.getId()
        );
    }

    public int deleteAppreciation(Long id) {

        String sql = "DELETE FROM appreciation WHERE id = ?";

        return jdbcTemplate.update(sql, id);
    }
}