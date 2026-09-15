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
    id_user INTEGER NOT NULL UNIQUE,

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