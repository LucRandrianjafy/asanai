package mg.asanai.repository;

import mg.asanai.model.CandidatScoreFinal;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CandidatScoreFinalRepository {

    private final JdbcTemplate jdbcTemplate;

    public CandidatScoreFinalRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CandidatScoreFinal> getAllCandidatsScores() {

        String sql = """
            SELECT *
            FROM vue_candidats_scores_final
            ORDER BY note_generale_sur_100 DESC
            """;

        return jdbcTemplate.query(
                sql,
                new CandidatScoreFinalRowMapper()
        );
    }

    public CandidatScoreFinal getCandidatScoreById(Long idUser) {

        String sql = """
            SELECT *
            FROM vue_candidats_scores_final
            WHERE id_user = ?
            """;

        return jdbcTemplate.queryForObject(
                sql,
                new CandidatScoreFinalRowMapper(),
                idUser
        );
    }

    private static class CandidatScoreFinalRowMapper
            implements RowMapper<CandidatScoreFinal> {

        @Override
        public CandidatScoreFinal mapRow(
                ResultSet rs,
                int rowNum) throws SQLException {

            CandidatScoreFinal candidat =
                    new CandidatScoreFinal();

            candidat.setIdUser(
                    rs.getLong("id_user")
            );

            candidat.setNom(
                    rs.getString("nom")
            );

            candidat.setPrenom(
                    rs.getString("prenom")
            );

            candidat.setCin(
                    rs.getString("cin")
            );

            candidat.setEmail(
                    rs.getString("email")
            );

            candidat.setTelephone(
                    rs.getString("telephone")
            );

            candidat.setAdresse(
                    rs.getString("adresse")
            );

            candidat.setResidenceTana(
                    rs.getString("residence_tana")
            );

            if (rs.getDate("date_naissance") != null) {
                candidat.setDateNaissance(
                        rs.getDate("date_naissance")
                                .toLocalDate()
                );
            }

            candidat.setGenre(
                    rs.getString("genre")
            );

            candidat.setRoleId(
                    rs.getLong("role_id")
            );

            candidat.setRole(
                    rs.getString("role")
            );

            candidat.setRegionId(
                    rs.getLong("region_id")
            );

            candidat.setRegion(
                    rs.getString("region")
            );

            candidat.setIdProgramme(
                    rs.getLong("id_programme")
            );

            candidat.setProgramme(
                    rs.getString("programme")
            );

            candidat.setNiveauEtudes(
                    rs.getString("niveau_etudes")
            );

            candidat.setDisponibiliteEngagment(
                    rs.getString("disponibilite_engagment")
            );

            boolean independanceValue =
                    rs.getBoolean("independance_financiere");

            if (rs.wasNull()) {
                candidat.setIndependanceFinanciere(null);
            } else {
                candidat.setIndependanceFinanciere(
                        independanceValue
                );
            }

            candidat.setNoteRegion(
                    rs.getBigDecimal("note_region")
            );

            candidat.setNoteNiveauEtudes(
                    rs.getBigDecimal("note_niveau_etudes")
            );

            candidat.setNoteDispoEngagement(
                    rs.getBigDecimal("note_dispo_engagement")
            );

            candidat.setNoteIndependanceFinanciere(
                    rs.getBigDecimal("note_independance_financiere")
            );

            candidat.setNoteSkillMatching(
                    rs.getBigDecimal("note_skill_matching")
            );

            candidat.setInteretPoste(
                    rs.getString("interet_poste")
            );

            candidat.setNiveauFrancais(
                    rs.getString("niveau_francais")
            );

            candidat.setClarteOrale(
                    rs.getString("clarete_orale")
            );

            candidat.setComprehensionOrale(
                    rs.getString("comprehension_orale")
            );

            candidat.setNoteInteretPoste(
                    rs.getBigDecimal("note_interet_poste")
            );

            candidat.setNoteNiveauFrancais(
                    rs.getBigDecimal("note_niveau_francais")
            );

            candidat.setNoteClarteOrale(
                    rs.getBigDecimal("note_clarte_orale")
            );

            candidat.setNoteComprehensionOrale(
                    rs.getBigDecimal("note_comprehension_orale")
            );

            candidat.setNotePrequalification(
                    rs.getBigDecimal("note_prequalification")
            );

            candidat.setNoteObtenueTestNiveau(
                    rs.getBigDecimal("note_obtenue_test_niveau")
            );

            candidat.setNoteMaxTestNiveau(
                    rs.getBigDecimal("note_max_test_niveau")
            );

            candidat.setNoteGeneraleSur100(
                    rs.getBigDecimal("note_generale_sur_100")
            );

            return candidat;
        }
    }
}