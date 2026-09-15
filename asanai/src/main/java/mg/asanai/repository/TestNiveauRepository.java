package mg.asanai.repository;

import mg.asanai.model.TestNiveau;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class TestNiveauRepository {

    private final JdbcTemplate jdbcTemplate;

    public TestNiveauRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TestNiveau> getAllTestNiveau() {

        String sql =
                "SELECT * FROM test_niveau ORDER BY id";

        return jdbcTemplate.query(
                sql,
                new RowMapper<TestNiveau>() {

                    @Override
                    public TestNiveau mapRow(
                            ResultSet rs,
                            int rowNum) throws SQLException {

                        return mapTestNiveau(rs);
                    }
                }
        );
    }

    public TestNiveau getTestNiveauById(Long id) {

        String sql =
                "SELECT * FROM test_niveau WHERE id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                new RowMapper<TestNiveau>() {

                    @Override
                    public TestNiveau mapRow(
                            ResultSet rs,
                            int rowNum) throws SQLException {

                        return mapTestNiveau(rs);
                    }
                },
                id
        );
    }

    public List<TestNiveau> getTestNiveauByUserId(Long idUsers) {

        String sql =
                "SELECT * FROM test_niveau " +
                "WHERE id_users = ? " +
                "ORDER BY id";

        return jdbcTemplate.query(
                sql,
                new RowMapper<TestNiveau>() {

                    @Override
                    public TestNiveau mapRow(
                            ResultSet rs,
                            int rowNum) throws SQLException {

                        return mapTestNiveau(rs);
                    }
                },
                idUsers
        );
    }

    public List<TestNiveau> getTestNiveauByProgrammeId(
            Long idProgramme) {

        String sql =
                "SELECT * FROM test_niveau " +
                "WHERE id_programme = ? " +
                "ORDER BY id";

        return jdbcTemplate.query(
                sql,
                new RowMapper<TestNiveau>() {

                    @Override
                    public TestNiveau mapRow(
                            ResultSet rs,
                            int rowNum) throws SQLException {

                        return mapTestNiveau(rs);
                    }
                },
                idProgramme
        );
    }

    public TestNiveau createTestNiveau(
            TestNiveau testNiveau) {

        String sql =
                "INSERT INTO test_niveau " +
                "(description, start_date, end_date, " +
                "id_programme, id_test_type, id_users, id_campus) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?) " +
                "RETURNING id";

        Long generatedId = jdbcTemplate.queryForObject(
                sql,
                Long.class,

                testNiveau.getDescription(),
                testNiveau.getStartDate(),
                testNiveau.getEndDate(),
                testNiveau.getIdProgramme(),
                testNiveau.getIdTestType(),
                testNiveau.getIdUsers(),
                testNiveau.getIdCampus()
        );

        testNiveau.setId(generatedId);

        return testNiveau;
    }

    private TestNiveau mapTestNiveau(
            ResultSet rs) throws SQLException {

        TestNiveau testNiveau = new TestNiveau();

        testNiveau.setId(
                rs.getLong("id")
        );

        testNiveau.setDescription(
                rs.getString("description")
        );

        if (rs.getTimestamp("start_date") != null) {

            testNiveau.setStartDate(
                    rs.getTimestamp("start_date")
                            .toLocalDateTime()
            );
        }

        if (rs.getTimestamp("end_date") != null) {

            testNiveau.setEndDate(
                    rs.getTimestamp("end_date")
                            .toLocalDateTime()
            );
        }

        testNiveau.setIdProgramme(
                rs.getLong("id_programme")
        );

        testNiveau.setIdTestType(
                rs.getLong("id_test_type")
        );

        testNiveau.setIdUsers(
                rs.getLong("id_users")
        );

        testNiveau.setIdCampus(
                rs.getLong("id_campus")
        );

        return testNiveau;
    }
}