CREATE OR REPLACE VIEW view_user_programme AS
SELECT
    ui.id AS user_information_id,

    u.id AS user_id,
    u.nom,
    u.prenom,
    u.email,
    u.telephone,
    u.adresse,
    u.residence_tana,
    u.date_naissance,
    u.genre,
    u.cin,
    u.cin_date_delivrance,
    u.cin_lieu_delivrance,
    u.dernier_diplome_obtenu,

    r.id AS region_id,
    r.nom AS region_nom,

    p.id AS programme_id,
    p.nom AS programme_nom,

    ui.niveau_etudes,
    ui.independance_financiere,
    ui.disponibilite_engagment,
    ui.date_disponibilite,

    ui.interet_poste,
    ui.niveau_francais,
    ui.clarete_orale,
    ui.comprehension_orale,

    ui.cin_fichier,
    ui.dernier_diplome_fichier,
    ui.cv_fichier,
    ui.date_info

FROM user_information ui
INNER JOIN users u
    ON u.id = ui.id_user
INNER JOIN programme p
    ON p.id = ui.id_programme
LEFT JOIN region r
    ON r.id = u.region_id;


-- note candidat skill matching
CREATE OR REPLACE VIEW vue_candidats_scores AS
SELECT
    u.id AS id_user,
    u.nom,
    u.prenom,
    u.cin,
    u.email,
    u.telephone,
    u.adresse,
    u.residence_tana,
    u.date_naissance,
    u.genre,

    -- Rôle
    u.role_id,
    ro.nom AS role,

    -- Région
    u.region_id,
    r.nom AS region,

    -- Programme
    ui.id_programme,
    p.nom AS programme,

    -- Niveau d'études
    ui.niveau_etudes,

    -- Disponibilité / engagement
    ui.disponibilite_engagment,

    -- Indépendance financière
    ui.independance_financiere,

    -- Notes
    calculer_note_region(u.region_id) AS note_region,

    calculer_note_niveau_etudes(
        ui.niveau_etudes
    ) AS note_niveau_etudes,
    
    calculer_note_dispo_engagement(
        ui.disponibilite_engagment
    ) AS note_dispo_engagement,

    calculer_note_independance_financiere(
        ui.independance_financiere
    ) AS note_independance_financiere,

    calculer_note_totale(
        u.region_id,
        ui.niveau_etudes,
        ui.disponibilite_engagment,
        ui.independance_financiere
    ) AS note_totale

FROM users u

INNER JOIN user_information ui
    ON ui.id_user = u.id

LEFT JOIN region r
    ON r.id = u.region_id

LEFT JOIN programme p
    ON p.id = ui.id_programme

LEFT JOIN role ro
    ON ro.id = u.role_id

WHERE u.role_id = 2;


-- candidat note niveau
CREATE OR REPLACE VIEW vue_candidats_scores_final AS
WITH scores_test_niveau AS (
    /* =========================================================
       SCORE TEST DE NIVEAU (id_test_type = 1 uniquement)
       Regroupé par candidat + programme
       ========================================================= */
    SELECT
        tn.id_users,
        tn.id_programme,
        SUM(tnq.points) AS note_max_test_niveau,
        SUM(
            CASE
                WHEN tnq.answer_idx = tnq.correct_answer_idx THEN tnq.points
                ELSE 0
            END
        ) AS note_obtenue_test_niveau
    FROM test_niveau tn
    JOIN test_niveau_question tnq
        ON tnq.id_test_niveau = tn.id
    WHERE tn.id_test_type = 1
    GROUP BY tn.id_users, tn.id_programme
)

SELECT
    /* =========================================================
       INFORMATIONS CANDIDAT
       ========================================================= */

    vcs.id_user,
    vcs.nom,
    vcs.prenom,
    vcs.cin,
    vcs.email,
    vcs.telephone,
    vcs.adresse,
    vcs.residence_tana,
    vcs.date_naissance,
    vcs.genre,

    -- Rôle
    vcs.role_id,
    vcs.role,

    -- Région
    vcs.region_id,
    vcs.region,

    -- Programme
    vcs.id_programme,
    vcs.programme,

    /* =========================================================
       SKILL MATCHING
       ========================================================= */

    vcs.niveau_etudes,
    vcs.disponibilite_engagment,
    ui.independance_financiere,

    calculer_note_region(vcs.region_id)
        AS note_region,

    calculer_note_niveau_etudes(vcs.niveau_etudes)
        AS note_niveau_etudes,

    calculer_note_dispo_engagement(vcs.disponibilite_engagment)
        AS note_dispo_engagement,

    calculer_note_independance_financiere(
        ui.independance_financiere
    )
        AS note_independance_financiere,

    (
        calculer_note_region(vcs.region_id)
        + calculer_note_niveau_etudes(vcs.niveau_etudes)
        + calculer_note_dispo_engagement(vcs.disponibilite_engagment)
        + calculer_note_independance_financiere(
            ui.independance_financiere
        )
    ) AS note_skill_matching_brute,

    /* =========================================================
       PREQUALIFICATION
       ========================================================= */

    ui.interet_poste,
    ui.niveau_francais,
    ui.clarete_orale,
    ui.comprehension_orale,

    calculer_note_interet_poste(
        ui.interet_poste
    ) AS note_interet_poste,

    calculer_note_niveau_francais(
        ui.niveau_francais
    ) AS note_niveau_francais,

    calculer_note_clarte_orale(
        ui.clarete_orale
    ) AS note_clarte_orale,

    calculer_note_comprehension_orale(
        ui.comprehension_orale
    ) AS note_comprehension_orale,

    calculer_note_prequalification(
        ui.interet_poste,
        ui.niveau_francais,
        ui.clarete_orale,
        ui.comprehension_orale
    ) AS note_prequalification_brute,

    /* =========================================================
       TEST DE NIVEAU (id_test_type = 1)
       ========================================================= */

    COALESCE(stn.note_obtenue_test_niveau, 0) AS note_obtenue_test_niveau,
    COALESCE(stn.note_max_test_niveau, 0)     AS note_max_test_niveau,

    /* =========================================================
       SCORE FINAL /100
       ========================================================= */

    (
        calculer_note_region(vcs.region_id)
        + calculer_note_niveau_etudes(vcs.niveau_etudes)
        + calculer_note_dispo_engagement(vcs.disponibilite_engagment)
        + calculer_note_independance_financiere(
            ui.independance_financiere
        )
        + calculer_note_prequalification(
            ui.interet_poste,
            ui.niveau_francais,
            ui.clarete_orale,
            ui.comprehension_orale
        )
    ) AS note_generale_sur_100

FROM vue_candidats_scores vcs

LEFT JOIN user_information ui
    ON ui.id_user = vcs.id_user

LEFT JOIN scores_test_niveau stn
    ON stn.id_users = vcs.id_user
    AND stn.id_programme = vcs.id_programme;