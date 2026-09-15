package mg.asanai.repository;

import mg.asanai.model.UserProgramme;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserProgrammeRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserProgrammeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<UserProgramme> userProgrammeRowMapper =
            new RowMapper<UserProgramme>() {

        @Override
        public UserProgramme mapRow(ResultSet rs, int rowNum)
                throws SQLException {

            UserProgramme userProgramme = new UserProgramme();

            userProgramme.setUserInformationId(
                    rs.getLong("user_information_id")
            );
            
            userProgramme.setUserId(
                    rs.getLong("user_id")
            );

            userProgramme.setNom(
                    rs.getString("nom")
            );

            userProgramme.setPrenom(
                    rs.getString("prenom")
            );

            userProgramme.setEmail(
                    rs.getString("email")
            );

            userProgramme.setTelephone(
                    rs.getString("telephone")
            );

            userProgramme.setAdresse(
                    rs.getString("adresse")
            );

            userProgramme.setResidenceTana(
                    rs.getString("residence_tana")
            );

            if (rs.getDate("date_naissance") != null) {
                userProgramme.setDateNaissance(
                        rs.getDate("date_naissance").toLocalDate()
                );
            }

            userProgramme.setGenre(
                    rs.getString("genre")
            );

            userProgramme.setCin(
                    rs.getString("cin")
            );

            if (rs.getDate("cin_date_delivrance") != null) {
                userProgramme.setCinDateDelivrance(
                        rs.getDate("cin_date_delivrance").toLocalDate()
                );
            }

            userProgramme.setCinLieuDelivrance(
                    rs.getString("cin_lieu_delivrance")
            );

            userProgramme.setDernierDiplomeObtenu(
                    rs.getString("dernier_diplome_obtenu")
            );

            long regionId = rs.getLong("region_id");

            if (rs.wasNull()) {
                userProgramme.setRegionId(null);
            } else {
                userProgramme.setRegionId(regionId);
            }

            userProgramme.setRegionNom(
                    rs.getString("region_nom")
            );

            long programmeId = rs.getLong("programme_id");

            if (rs.wasNull()) {
                userProgramme.setProgrammeId(null);
            } else {
                userProgramme.setProgrammeId(programmeId);
            }

            userProgramme.setProgrammeNom(
                    rs.getString("programme_nom")
            );

            userProgramme.setNiveauEtudes(
                    rs.getString("niveau_etudes")
            );

            userProgramme.setIndependanceFinanciere(
                    rs.getObject("independance_financiere", Boolean.class)
            );

            userProgramme.setDisponibiliteEngagment(
                    rs.getString("disponibilite_engagment")
            );

            if (rs.getDate("date_disponibilite") != null) {
                userProgramme.setDateDisponibilite(
                        rs.getDate("date_disponibilite").toLocalDate()
                );
            }

            userProgramme.setInteretPoste(
                    rs.getString("interet_poste")
            );

            userProgramme.setNiveauFrancais(
                    rs.getString("niveau_francais")
            );

            userProgramme.setClareteOrale(
                    rs.getString("clarete_orale")
            );

            userProgramme.setComprehensionOrale(
                    rs.getString("comprehension_orale")
            );

            userProgramme.setCinFichier(
                    rs.getString("cin_fichier")
            );

            userProgramme.setDernierDiplomeFichier(
                    rs.getString("dernier_diplome_fichier")
            );

            userProgramme.setCvFichier(
                    rs.getString("cv_fichier")
            );

            if (rs.getTimestamp("date_info") != null) {
                userProgramme.setDateInfo(
                        rs.getTimestamp("date_info").toLocalDateTime()
                );
            }

            return userProgramme;
        }
    };
    
    public List<UserProgramme> getAllUserProgramme() {

        String sql =
                "SELECT * FROM view_user_programme " +
                "ORDER BY nom, prenom";

        return jdbcTemplate.query(
                sql,
                userProgrammeRowMapper
        );
    }

    public UserProgramme getUserProgrammeById(Long id) {

        String sql =
                "SELECT * FROM view_user_programme " +
                "WHERE user_id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                userProgrammeRowMapper,
                id
        );
    }

    public List<UserProgramme> getUserProgrammeByProgrammeId(
            Long programmeId) {

        String sql =
                "SELECT * FROM view_user_programme " +
                "WHERE programme_id = ? " +
                "ORDER BY nom, prenom";

        return jdbcTemplate.query(
                sql,
                userProgrammeRowMapper,
                programmeId
        );
    }
}