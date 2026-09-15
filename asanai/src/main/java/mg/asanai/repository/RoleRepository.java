package mg.asanai.repository;

import mg.asanai.model.Role;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class RoleRepository {

    private final JdbcTemplate jdbcTemplate;

    public RoleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Role> getAllRole() {

        String sql = "SELECT * FROM role ORDER BY id";

        return jdbcTemplate.query(sql, new RowMapper<Role>() {

            @Override
            public Role mapRow(ResultSet rs, int rowNum) throws SQLException {

                Role role = new Role();

                role.setId(rs.getLong("id"));
                role.setNom(rs.getString("nom"));

                return role;
            }
        });
    }

    public Role getRoleById(Long id) {

        String sql = "SELECT * FROM role WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, new RowMapper<Role>() {

            @Override
            public Role mapRow(ResultSet rs, int rowNum) throws SQLException {

                Role role = new Role();

                role.setId(rs.getLong("id"));
                role.setNom(rs.getString("nom"));

                return role;
            }
        }, id);
    }
}