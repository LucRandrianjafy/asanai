-- SKILL MATCHING SCORE
CREATE OR REPLACE FUNCTION calculer_note_region(p_region_id INTEGER)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN p_region_id = 1 THEN 7
        ELSE 2
    END;
$$;


CREATE OR REPLACE FUNCTION calculer_note_niveau_etudes(p_niveau_etudes VARCHAR)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN LOWER(TRIM(p_niveau_etudes)) = 'bac+' THEN 15
        WHEN LOWER(TRIM(p_niveau_etudes)) = 'bac' THEN 8
        WHEN LOWER(TRIM(p_niveau_etudes)) = 'bac-' THEN 0
        ELSE 0
    END;
$$;


CREATE OR REPLACE FUNCTION calculer_note_dispo_engagement(p_dispo_engagement TEXT)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN LOWER(TRIM(p_dispo_engagement)) = 'dispo' THEN 15
        WHEN LOWER(TRIM(p_dispo_engagement)) = 'dispo-' THEN 8
        WHEN LOWER(TRIM(p_dispo_engagement)) = 'non dispo' THEN 0
        ELSE 0
    END;
$$;


CREATE OR REPLACE FUNCTION calculer_note_independance_financiere(
    p_independance_financiere BOOLEAN
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN p_independance_financiere = TRUE THEN 11
        WHEN p_independance_financiere = FALSE THEN 1
        ELSE 0
    END;
$$;


CREATE OR REPLACE FUNCTION calculer_note_totale(
    p_region_id INTEGER,
    p_niveau_etudes VARCHAR,
    p_interet_poste TEXT,
    p_dispo_engagement TEXT,
    p_independance_financiere BOOLEAN
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT
        calculer_note_region(p_region_id)
        + calculer_note_niveau_etudes(p_niveau_etudes)
        + calculer_note_dispo_engagement(p_dispo_engagement)
        + calculer_note_independance_financiere(p_independance_financiere);
$$;

-- PREQUALIFICATION SCORE
CREATE OR REPLACE FUNCTION calculer_note_interet_poste(
    p_interet_poste VARCHAR
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN LOWER(TRIM(p_interet_poste)) = 'eleve' THEN 11
        WHEN LOWER(TRIM(p_interet_poste)) = 'hesitant' THEN 6
        WHEN LOWER(TRIM(p_interet_poste)) = 'insuffisant' THEN 0
        ELSE 0
    END;
$$;


CREATE OR REPLACE FUNCTION calculer_note_niveau_francais(
    p_niveau_francais VARCHAR
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN LOWER(TRIM(p_niveau_francais)) = 'b1-' THEN 0
        WHEN LOWER(TRIM(p_niveau_francais)) = 'b1' THEN 8
        WHEN LOWER(TRIM(p_niveau_francais)) = 'b1+' THEN 15
        ELSE 0
    END;
$$;


CREATE OR REPLACE FUNCTION calculer_note_clarte_orale(
    p_clarte_orale VARCHAR
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN LOWER(TRIM(p_clarte_orale)) = 'insuffisant' THEN 0
        WHEN LOWER(TRIM(p_clarte_orale)) = 'satisfaisant' THEN 8
        WHEN LOWER(TRIM(p_clarte_orale)) = 'eleve' THEN 11
        ELSE 0
    END;
$$;


CREATE OR REPLACE FUNCTION calculer_note_comprehension_orale(
    p_comprehension_orale VARCHAR
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE
        WHEN LOWER(TRIM(p_comprehension_orale)) = 'insuffisant' THEN 0
        WHEN LOWER(TRIM(p_comprehension_orale)) = 'satisfaisant' THEN 8
        WHEN LOWER(TRIM(p_comprehension_orale)) = 'eleve' THEN 11
        ELSE 0
    END;
$$;


-- PREQUALIFICATION SCORE TOTAL
CREATE OR REPLACE FUNCTION calculer_note_prequalification(
    p_interet_poste VARCHAR,
    p_niveau_francais VARCHAR,
    p_clarte_orale VARCHAR,
    p_comprehension_orale VARCHAR
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT
        calculer_note_interet_poste(p_interet_poste)
        + calculer_note_niveau_francais(p_niveau_francais)
        + calculer_note_clarte_orale(p_clarte_orale)
        + calculer_note_comprehension_orale(p_comprehension_orale);
$$;