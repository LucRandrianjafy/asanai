CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE campus (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE region (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE programme (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    statut BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    cin VARCHAR(12) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(30),
    adresse TEXT,
    residence_tana TEXT,
    date_naissance DATE,
    genre VARCHAR(1),
    region_id INTEGER,
    role_id INTEGER NOT NULL,
    cin_date_delivrance DATE,
    cin_lieu_delivrance VARCHAR(150),
    dernier_diplome_obtenu VARCHAR(150),
    CONSTRAINT fk_users_region
        FOREIGN KEY (region_id)
        REFERENCES region(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_users_cin
        CHECK (cin ~ '^[0-9]{12}$'),
    CONSTRAINT chk_users_genre
        CHECK (genre IN ('H', 'F'))
);

CREATE TABLE user_information (
    id SERIAL PRIMARY KEY,
    id_programme INTEGER NOT NULL,
    id_user INTEGER NOT NULL,

    -- candidat
    niveau_etudes VARCHAR(100),
    independance_financiere BOOLEAN,
    disponibilite_engagment VARCHAR(100),
    date_disponibilite DATE,
    
    -- formateur
    interet_poste TEXT,
    niveau_francais VARCHAR(100),
    clarete_orale VARCHAR(100),
    comprehension_orale VARCHAR(100),
    
    cin_fichier VARCHAR(500),
    dernier_diplome_fichier VARCHAR(500),
    cv_fichier VARCHAR(500),
    date_info TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user_programme
        FOREIGN KEY (id_programme)
        REFERENCES programme(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT uq_user_information_programme
        UNIQUE (id_user, id_programme),
    CONSTRAINT fk_user_information_user
        FOREIGN KEY (id_user)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE categorie_question(
    id SERIAL,
    description VARCHAR(250),
    PRIMARY KEY(id)
);

CREATE TABLE test_type(
    id SERIAL,
    description VARCHAR(250),
    PRIMARY KEY(id)
);

CREATE TABLE test_niveau(
    id SERIAL,
    description VARCHAR(250),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    id_programme INTEGER NOT NULL,
    id_test_type INTEGER NOT NULL,
    id_users INTEGER NOT NULL,
    id_campus INTEGER,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_programme
        FOREIGN KEY (id_programme)
        REFERENCES programme(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(id_test_type) REFERENCES test_type(id),
    FOREIGN KEY(id_campus) REFERENCES campus(id),
    FOREIGN KEY(id_users) REFERENCES users(id)
);

CREATE TABLE test_niveau_question(
    id SERIAL,
    question VARCHAR(250) NOT NULL,
    answers TEXT,
    correct_answer_idx INTEGER NOT NULL,
    answer_idx INTEGER,
    points NUMERIC(15,2) NOT NULL,
    duree_minutes INTEGER NOT NULL,
    id_test_niveau INTEGER NOT NULL,
    id_categorie_question INTEGER,
    PRIMARY KEY(id),
    FOREIGN KEY(id_test_niveau) REFERENCES test_niveau(id),
    FOREIGN KEY(id_categorie_question) REFERENCES categorie_question(id)
);

CREATE TABLE critere_appreciation (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    statut BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE appreciation (
    id SERIAL PRIMARY KEY,
    id_critere INTEGER NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    points NUMERIC(5,2) NOT NULL DEFAULT 0,
    statut BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_appreciation_critere
        FOREIGN KEY (id_critere)
        REFERENCES critere_appreciation(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_appreciation_points
        CHECK (points >= 0),

    CONSTRAINT uq_appreciation_critere_libelle
        UNIQUE (id_critere, libelle)
);

CREATE TABLE candidat_appreciation (
    id SERIAL PRIMARY KEY,
    id_user_information INTEGER NOT NULL,
    id_rh INTEGER NOT NULL,
    id_critere INTEGER NOT NULL,
    id_appreciation INTEGER NOT NULL,
    date_appreciation TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_ca_user_information
        FOREIGN KEY (id_user_information)
        REFERENCES user_information(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ca_rh
        FOREIGN KEY (id_rh)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ca_critere
        FOREIGN KEY (id_critere)
        REFERENCES critere_appreciation(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ca_appreciation
        FOREIGN KEY (id_appreciation)
        REFERENCES appreciation(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_ca_user_critere
        UNIQUE (id_user_information, id_critere)
);


CREATE TABLE decision_finale (
    id SERIAL PRIMARY KEY,
    id_user_information INTEGER NOT NULL UNIQUE,
    id_rh INTEGER NOT NULL,
    decision VARCHAR(20) NOT NULL,
    date_evaluation TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_decision_user_information
        FOREIGN KEY (id_user_information)
        REFERENCES user_information(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_decision_rh
        FOREIGN KEY (id_rh)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_decision_valeur
        CHECK (decision IN ('admis', 'non-retenu', 'liste-attente'))
);


CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    titre VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    statut_vu BOOLEAN NOT NULL DEFAULT FALSE,
    date_notification TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notification_user
        FOREIGN KEY (id_user)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);