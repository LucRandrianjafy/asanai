package mg.asanai.repository;

import mg.asanai.model.UserInformation;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserInformationRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserInformationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<UserInformation> getAllUserInformation() {

        String sql = """
                SELECT
                    id,
                    id_programme,
                    id_user,
                    niveau_etudes,
                    independance_financiere,
                    disponibilite_engagment,
                    date_disponibilite,
                    interet_poste,
                    niveau_francais,
                    clarete_orale,
                    comprehension_orale,
                    cin_fichier,
                    dernier_diplome_fichier,
                    cv_fichier,
                    date_info
                FROM user_information
                ORDER BY id
                """;

        return jdbcTemplate.query(
                sql,
                new UserInformationRowMapper()
        );
    }

    public UserInformation getUserInformationById(Long id) {

        String sql = """
                SELECT
                    id,
                    id_programme,
                    id_user,
                    niveau_etudes,
                    independance_financiere,
                    disponibilite_engagment,
                    date_disponibilite,
                    interet_poste,
                    niveau_francais,
                    clarete_orale,
                    comprehension_orale,
                    cin_fichier,
                    dernier_diplome_fichier,
                    cv_fichier,
                    date_info
                FROM user_information
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                new UserInformationRowMapper(),
                id
        );
    }

    public UserInformation getUserInformationByUserId(Long idUser) {

        String sql = """
                SELECT
                    id,
                    id_programme,
                    id_user,
                    niveau_etudes,
                    independance_financiere,
                    disponibilite_engagment,
                    date_disponibilite,
                    interet_poste,
                    niveau_francais,
                    clarete_orale,
                    comprehension_orale,
                    cin_fichier,
                    dernier_diplome_fichier,
                    cv_fichier,
                    date_info
                FROM user_information
                WHERE id_user = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                new UserInformationRowMapper(),
                idUser
        );
    }

    public UserInformation createUserInformation(
            UserInformation information
    ) {

        String sql = """
                INSERT INTO user_information (
                    id_programme,
                    id_user,
                    niveau_etudes,
                    independance_financiere,
                    disponibilite_engagment,
                    date_disponibilite,
                    interet_poste,
                    niveau_francais,
                    clarete_orale,
                    comprehension_orale,
                    cin_fichier,
                    dernier_diplome_fichier,
                    cv_fichier
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )
                RETURNING
                    id,
                    id_programme,
                    id_user,
                    niveau_etudes,
                    independance_financiere,
                    disponibilite_engagment,
                    date_disponibilite,
                    interet_poste,
                    niveau_francais,
                    clarete_orale,
                    comprehension_orale,
                    cin_fichier,
                    dernier_diplome_fichier,
                    cv_fichier,
                    date_info
                """;

        return jdbcTemplate.queryForObject(
                sql,
                new UserInformationRowMapper(),

                information.getIdProgramme(),
                information.getIdUser(),
                information.getNiveauEtudes(),
                information.getIndependanceFinanciere(),
                information.getDisponibiliteEngagment(),
                information.getDateDisponibilite(),

                information.getInteretPoste(),
                information.getNiveauFrancais(),
                information.getClareteOrale(),
                information.getComprehensionOrale(),

                information.getCinFichier(),
                information.getDernierDiplomeFichier(),
                information.getCvFichier()
        );
    }

    public UserInformation updateUserInformation(
            Long id,
            UserInformation information
    ) {

        String sql = """
                UPDATE user_information
                SET
                    id_programme = ?,
                    niveau_etudes = ?,
                    independance_financiere = ?,
                    disponibilite_engagment = ?,
                    date_disponibilite = ?,
                    interet_poste = ?,
                    niveau_francais = ?,
                    clarete_orale = ?,
                    comprehension_orale = ?,
                    cin_fichier = ?,
                    dernier_diplome_fichier = ?,
                    cv_fichier = ?
                WHERE id = ?
                RETURNING
                    id,
                    id_programme,
                    id_user,
                    niveau_etudes,
                    independance_financiere,
                    disponibilite_engagment,
                    date_disponibilite,
                    interet_poste,
                    niveau_francais,
                    clarete_orale,
                    comprehension_orale,
                    cin_fichier,
                    dernier_diplome_fichier,
                    cv_fichier,
                    date_info
                """;

        return jdbcTemplate.queryForObject(
                sql,
                new UserInformationRowMapper(),

                information.getIdProgramme(),
                information.getNiveauEtudes(),
                information.getIndependanceFinanciere(),
                information.getDisponibiliteEngagment(),
                information.getDateDisponibilite(),

                information.getInteretPoste(),
                information.getNiveauFrancais(),
                information.getClareteOrale(),
                information.getComprehensionOrale(),

                information.getCinFichier(),
                information.getDernierDiplomeFichier(),
                information.getCvFichier(),

                id
        );
    }

    public void deleteUserInformation(Long id) {

        String sql = """
                DELETE FROM user_information
                WHERE id = ?
                """;

        jdbcTemplate.update(sql, id);
    }

    private static class UserInformationRowMapper
            implements RowMapper<UserInformation> {

        @Override
        public UserInformation mapRow(
                ResultSet rs,
                int rowNum
        ) throws SQLException {

            UserInformation information = new UserInformation();

            information.setId(
                    rs.getLong("id")
            );

            information.setIdProgramme(
                    rs.getLong("id_programme")
            );

            information.setIdUser(
                    rs.getLong("id_user")
            );

            information.setNiveauEtudes(
                    rs.getString("niveau_etudes")
            );

            information.setIndependanceFinanciere(
                    (Boolean) rs.getObject("independance_financiere")
            );

            information.setDisponibiliteEngagment(
                    rs.getString("disponibilite_engagment")
            );

            if (rs.getDate("date_disponibilite") != null) {
                information.setDateDisponibilite(
                        rs.getDate("date_disponibilite")
                                .toLocalDate()
                );
            }

            information.setInteretPoste(
                    rs.getString("interet_poste")
            );

            information.setNiveauFrancais(
                    rs.getString("niveau_francais")
            );

            information.setClareteOrale(
                    rs.getString("clarete_orale")
            );

            information.setComprehensionOrale(
                    rs.getString("comprehension_orale")
            );

            information.setCinFichier(
                    rs.getString("cin_fichier")
            );

            information.setDernierDiplomeFichier(
                    rs.getString("dernier_diplome_fichier")
            );

            information.setCvFichier(
                    rs.getString("cv_fichier")
            );

            if (rs.getTimestamp("date_info") != null) {
                information.setDateInfo(
                        rs.getTimestamp("date_info")
                                .toLocalDateTime()
                );
            }

            return information;
        }
    }
}