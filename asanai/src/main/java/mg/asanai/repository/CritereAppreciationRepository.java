package mg.asanai.repository;

import mg.asanai.model.CritereAppreciation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CritereAppreciationRepository {

    private final JdbcTemplate jdbcTemplate;

    public CritereAppreciationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CritereAppreciation> getAllCritereAppreciation() {

        String sql = "SELECT * FROM critere_appreciation ORDER BY id";

        return jdbcTemplate.query(sql, new RowMapper<CritereAppreciation>() {

            @Override
            public CritereAppreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                CritereAppreciation critere = new CritereAppreciation();

                critere.setId(rs.getLong("id"));
                critere.setNom(rs.getString("nom"));
                critere.setDescription(rs.getString("description"));
                critere.setStatut(rs.getBoolean("statut"));

                return critere;
            }
        });
    }

    public List<CritereAppreciation> getAllCritereAppreciationActif() {

        String sql = "SELECT * FROM critere_appreciation WHERE statut = TRUE ORDER BY id";

        return jdbcTemplate.query(sql, new RowMapper<CritereAppreciation>() {

            @Override
            public CritereAppreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                CritereAppreciation critere = new CritereAppreciation();

                critere.setId(rs.getLong("id"));
                critere.setNom(rs.getString("nom"));
                critere.setDescription(rs.getString("description"));
                critere.setStatut(rs.getBoolean("statut"));

                return critere;
            }
        });
    }

    public CritereAppreciation getCritereAppreciationById(Long id) {

        String sql = "SELECT * FROM critere_appreciation WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, new RowMapper<CritereAppreciation>() {

            @Override
            public CritereAppreciation mapRow(ResultSet rs, int rowNum) throws SQLException {

                CritereAppreciation critere = new CritereAppreciation();

                critere.setId(rs.getLong("id"));
                critere.setNom(rs.getString("nom"));
                critere.setDescription(rs.getString("description"));
                critere.setStatut(rs.getBoolean("statut"));

                return critere;
            }
        }, id);
    }

    public int createCritereAppreciation(CritereAppreciation critere) {

        String sql = """
                INSERT INTO critere_appreciation
                (nom, description, statut)
                VALUES (?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                critere.getNom(),
                critere.getDescription(),
                critere.getStatut()
        );
    }

    public int updateCritereAppreciation(CritereAppreciation critere) {

        String sql = """
                UPDATE critere_appreciation
                SET nom = ?, description = ?, statut = ?
                WHERE id = ?
                """;

        return jdbcTemplate.update(
                sql,
                critere.getNom(),
                critere.getDescription(),
                critere.getStatut(),
                critere.getId()
        );
    }

    public int deleteCritereAppreciation(Long id) {

        String sql = "DELETE FROM critere_appreciation WHERE id = ?";

        return jdbcTemplate.update(sql, id);
    }
}