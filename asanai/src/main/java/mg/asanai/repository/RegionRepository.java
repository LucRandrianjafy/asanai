package mg.asanai.repository;

import mg.asanai.model.Region;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class RegionRepository {

    private final JdbcTemplate jdbcTemplate;

    public RegionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Region> getAllRegion() {

        String sql = "SELECT * FROM region ORDER BY id";

        return jdbcTemplate.query(sql, new RowMapper<Region>() {

            @Override
            public Region mapRow(ResultSet rs, int rowNum) throws SQLException {

                Region region = new Region();

                region.setId(rs.getLong("id"));
                region.setNom(rs.getString("nom"));

                return region;
            }
        });
    }

    public Region getRegionById(Long id) {

        String sql = "SELECT * FROM region WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, new RowMapper<Region>() {

            @Override
            public Region mapRow(ResultSet rs, int rowNum) throws SQLException {

                Region region = new Region();

                region.setId(rs.getLong("id"));
                region.setNom(rs.getString("nom"));

                return region;
            }
        }, id);
    }
}