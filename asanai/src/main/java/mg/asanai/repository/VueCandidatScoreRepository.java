package mg.asanai.repository;

import mg.asanai.model.VueCandidatScore;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class VueCandidatScoreRepository {

    private final JdbcTemplate jdbcTemplate;


    // ============================================================
    // CONSTRUCTEUR
    // ============================================================

    public VueCandidatScoreRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // ============================================================
    // GET ALL CANDIDATS
    // ============================================================

    public List<VueCandidatScore> getAllCandidats() {

        String sql = """
                SELECT *
                FROM vue_candidats_scores
                ORDER BY note_totale DESC
                """;

        return jdbcTemplate.query(
                sql,
                new RowMapper<VueCandidatScore>() {

                    @Override
                    public VueCandidatScore mapRow(
                            ResultSet rs,
                            int rowNum
                    ) throws SQLException {

                        return mapResultSet(rs);
                    }
                }
        );
    }


    // ============================================================
    // GET CANDIDAT BY ID
    // ============================================================

    public VueCandidatScore getCandidatById(Long idUser) {

        String sql = """
                SELECT *
                FROM vue_candidats_scores
                WHERE id_user = ?
                """;

        List<VueCandidatScore> result =
                jdbcTemplate.query(
                        sql,
                        new RowMapper<VueCandidatScore>() {

                            @Override
                            public VueCandidatScore mapRow(
                                    ResultSet rs,
                                    int rowNum
                            ) throws SQLException {

                                return mapResultSet(rs);
                            }
                        },
                        idUser
                );

        if (result.isEmpty()) {
            return null;
        }

        return result.get(0);
    }


    // ============================================================
    // MAPPING
    // ============================================================

    private VueCandidatScore mapResultSet(
            ResultSet rs
    ) throws SQLException {

        VueCandidatScore candidat =
                new VueCandidatScore();


        // ========================================================
        // INFORMATIONS USER
        // ========================================================

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


        // ========================================================
        // DATE DE NAISSANCE
        // ========================================================

        if (rs.getDate("date_naissance") != null) {

            candidat.setDateNaissance(
                    rs.getDate("date_naissance").toString()
            );
        }


        // ========================================================
        // GENRE
        // ========================================================

        candidat.setGenre(
                rs.getString("genre")
        );


        // ========================================================
        // ROLE
        // ========================================================

        candidat.setRoleId(
                rs.getLong("role_id")
        );

        candidat.setRole(
                rs.getString("role")
        );


        // ========================================================
        // REGION
        // ========================================================

        candidat.setRegionId(
                rs.getLong("region_id")
        );

        candidat.setRegion(
                rs.getString("region")
        );


        // ========================================================
        // PROGRAMME
        // ========================================================

        candidat.setIdProgramme(
                rs.getLong("id_programme")
        );

        candidat.setProgramme(
                rs.getString("programme")
        );


        // ========================================================
        // INFORMATIONS CANDIDAT
        // ========================================================

        candidat.setNiveauEtudes(
                rs.getString("niveau_etudes")
        );


        // ========================================================
        // DISPONIBILITE / ENGAGEMENT
        // ========================================================

        candidat.setDisponibiliteEngagment(
                rs.getString("disponibilite_engagment")
        );


        // ========================================================
        // INDEPENDANCE FINANCIERE
        // ========================================================

        Boolean independanceFinanciere =
                (Boolean) rs.getObject(
                        "independance_financiere"
                );

        candidat.setIndependanceFinanciere(
                independanceFinanciere
        );


        // ========================================================
        // NOTES
        // ========================================================

        candidat.setNoteRegion(
                rs.getInt("note_region")
        );

        candidat.setNoteNiveauEtudes(
                rs.getInt("note_niveau_etudes")
        );

        candidat.setNoteDispoEngagement(
                rs.getInt("note_dispo_engagement")
        );

        candidat.setNoteIndependanceFinanciere(
                rs.getInt("note_independance_financiere")
        );

        candidat.setNoteTotale(
                rs.getInt("note_totale")
        );


        return candidat;
    }
}