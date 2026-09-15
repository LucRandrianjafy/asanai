package mg.asanai.repository;

import mg.asanai.model.User;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper =
            new RowMapper<User>() {

                @Override
                public User mapRow(
                        ResultSet rs,
                        int rowNum
                ) throws SQLException {

                    User user = new User();

                    user.setId(rs.getLong("id"));
                    user.setNom(rs.getString("nom"));
                    user.setPrenom(rs.getString("prenom"));
                    user.setPassword(rs.getString("password"));
                    user.setCin(rs.getString("cin"));
                    user.setEmail(rs.getString("email"));
                    user.setTelephone(rs.getString("telephone"));
                    user.setAdresse(rs.getString("adresse"));

                    if (rs.getDate("date_naissance") != null) {
                        user.setDateNaissance(
                                rs.getDate("date_naissance")
                                        .toLocalDate()
                        );
                    }

                    user.setGenre(
                            rs.getString("genre")
                    );

                    user.setResidenceTana(
                            rs.getString("residence_tana")
                    );

                    if (rs.getObject("region_id") != null) {
                        user.setRegionId(
                                rs.getLong("region_id")
                        );
                    }

                    user.setRoleId(
                            rs.getLong("role_id")
                    );

                    if (rs.getDate("cin_date_delivrance") != null) {
                        user.setCinDateDelivrance(
                                rs.getDate("cin_date_delivrance")
                                        .toLocalDate()
                        );
                    }

                    user.setCinLieuDelivrance(
                            rs.getString("cin_lieu_delivrance")
                    );

                    user.setDernierDiplomeObtenu(
                            rs.getString("dernier_diplome_obtenu")
                    );

                    return user;
                }
            };

    public List<User> getAllUser() {

        String sql = """
                SELECT 
                    id, 
                    nom, 
                    prenom, 
                    password, 
                    cin, 
                    email, 
                    telephone, 
                    adresse, 
                    date_naissance, 
                    genre, 
                    residence_tana, 
                    region_id, 
                    role_id, 
                    cin_date_delivrance, 
                    cin_lieu_delivrance, 
                    dernier_diplome_obtenu 
                FROM users 
                ORDER BY id
                """;

        return jdbcTemplate.query(
                sql,
                userRowMapper
        );
    }

    public User getUserById(Long id) {

        String sql = """
                SELECT 
                    id, 
                    nom, 
                    prenom, 
                    password, 
                    cin, 
                    email, 
                    telephone, 
                    adresse, 
                    date_naissance, 
                    genre, 
                    residence_tana, 
                    region_id, 
                    role_id, 
                    cin_date_delivrance, 
                    cin_lieu_delivrance, 
                    dernier_diplome_obtenu 
                FROM users 
                WHERE id = ?
                """;

        List<User> users = jdbcTemplate.query(
                sql,
                userRowMapper,
                id
        );

        if (users.isEmpty()) {
            return null;
        }

        return users.get(0);
    }

    public User login(String email) {

        String sql = """
                SELECT 
                    id, 
                    nom, 
                    prenom, 
                    password, 
                    cin, 
                    email, 
                    telephone, 
                    adresse, 
                    date_naissance, 
                    genre, 
                    residence_tana, 
                    region_id, 
                    role_id, 
                    cin_date_delivrance, 
                    cin_lieu_delivrance, 
                    dernier_diplome_obtenu 
                FROM users 
                WHERE email = ?
                """;

        List<User> users =
                jdbcTemplate.query(
                        sql,
                        userRowMapper,
                        email
                );

        if (users.isEmpty()) {
            return null;
        }

        return users.get(0);
    }

    public User createUser(User user) {

        String sql = """
                INSERT INTO users (
                    nom, 
                    prenom, 
                    password, 
                    cin, 
                    email, 
                    telephone, 
                    adresse, 
                    date_naissance, 
                    genre, 
                    residence_tana, 
                    region_id, 
                    role_id, 
                    cin_date_delivrance, 
                    cin_lieu_delivrance, 
                    dernier_diplome_obtenu 
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                RETURNING *
                """;

        return jdbcTemplate.queryForObject(
                sql,
                userRowMapper,
                user.getNom(),
                user.getPrenom(),
                user.getPassword(),
                user.getCin(),
                user.getEmail(),
                user.getTelephone(),
                user.getAdresse(),
                user.getDateNaissance(),
                user.getGenre(),
                user.getResidenceTana(),
                user.getRegionId(),
                user.getRoleId(),
                user.getCinDateDelivrance(),
                user.getCinLieuDelivrance(),
                user.getDernierDiplomeObtenu()
        );
    }

    /**
     * Modification d'un utilisateur
     */
    public User updateUser(Long id, User user) {

        String sql = """
                UPDATE users
                SET
                    nom = ?,
                    prenom = ?,
                    cin = ?,
                    email = ?,
                    telephone = ?,
                    adresse = ?,
                    date_naissance = ?,
                    genre = ?,
                    residence_tana = ?,
                    region_id = ?,
                    role_id = ?,
                    cin_date_delivrance = ?,
                    cin_lieu_delivrance = ?,
                    dernier_diplome_obtenu = ?
                WHERE id = ?
                RETURNING *
                """;

        List<User> users = jdbcTemplate.query(
                sql,
                userRowMapper,
                user.getNom(),
                user.getPrenom(),
                user.getCin(),
                user.getEmail(),
                user.getTelephone(),
                user.getAdresse(),
                user.getDateNaissance(),
                user.getGenre(),
                user.getResidenceTana(),
                user.getRegionId(),
                user.getRoleId(),
                user.getCinDateDelivrance(),
                user.getCinLieuDelivrance(),
                user.getDernierDiplomeObtenu(),
                id
        );

        if (users.isEmpty()) {
            return null;
        }

        return users.get(0);
    }

    /**
     * Modification du mot de passe uniquement
     */
    public User updateUserPassword(Long id, String password) {

        String sql = """
                UPDATE users
                SET password = ?
                WHERE id = ?
                RETURNING *
                """;

        List<User> users = jdbcTemplate.query(
                sql,
                userRowMapper,
                password,
                id
        );

        if (users.isEmpty()) {
            return null;
        }

        return users.get(0);
    }
}