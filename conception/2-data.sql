INSERT INTO role (id, nom) VALUES
(1, 'admin'),
(2, 'user'),
(3, 'it'),
(4, 'rh'),
(5, 'formateur');

INSERT INTO region (id, nom) VALUES
(1, 'Analamanga'),
(2, 'Diana'),
(3, 'Sava'),
(4, 'Itasy'),
(5, 'Vakinankaratra'),
(6, 'Bongolava'),
(7, 'Sofia'),
(8, 'Boeny'),
(9, 'Betsiboka'),
(10, 'Melaky'),
(11, 'Alaotra-Mangoro'),
(12, 'Atsinanana'),
(13, 'Ambatosoa'),
(14, 'Analanjirofo'),
(15, 'Amoron''i Mania'),
(16, 'Matsiatra Ambony'),
(17, 'Vatovavy'),
(18, 'Atsimo-Atsinanana'),
(19, 'Ihorombe'),
(20, 'Menabe'),
(21, 'Atsimo-Andrefana'),
(22, 'Androy'),
(23, 'Anosy'),
(24, 'Fitovinany');

INSERT INTO programme (id, nom) VALUES
(1, 'cohorte 2'),
(2, 'cohorte 3');

INSERT INTO campus (id, nom) VALUES
(1, 'AAOI Anosivavaka'),
(2, 'Barea Mahamasina');

INSERT INTO test_type (id, description) VALUES
(1, 'technique'),
(2, 'evaluation');

INSERT INTO users (nom, prenom, password, cin, email, telephone, adresse, date_naissance, region_id, role_id, cin_date_delivrance, cin_lieu_delivrance, dernier_diplome_obtenu) VALUES 
('Admin', 'admin', '$2a$12$.SdBkDg2V/9.iV77BDqOEuvps4HINo69i00BI2QA0XNIA23NX/vh6', '102234567890', 'admin@gmail.com', '0341234567', 'Antananarivo', '1995-05-12', 1, 1, '2015-06-10', 'Antananarivo', 'Master'),
('Formateur', 'formateur', '$2a$12$Ki9d.ebx6auNoq2BLAjZNew3tHuSjY5aAERk1zlCykSJ8f9AGh0hm', '101234567890', 'formateur@gmail.com', '0341234567', 'Antananarivo', '1995-05-12', 1, 5, '2015-06-10', 'Antananarivo', 'Master'),
('It', 'it', '$2a$12$PnOxagalGgkUjA05TOkyH.FJ.DEthheMTGmQl2Oglw74v/ywiTREm', '101234567860', 'it@gmail.com', '0341234567', 'Antananarivo', '1995-05-12', 1, 3, '2015-06-10', 'Antananarivo', 'Master'),
('Rh', 'rh', '$2a$12$NVURAtd5MgmVYa8sgpRSK.0UjeAdRqn5xbXdNhlya8wloRL2SYQL.', '101234567870', 'rh@gmail.com', '0341234567', 'Antananarivo', '1995-05-12', 1, 4, '2015-06-10', 'Antananarivo', 'Master'),
('User', 'user', '$2a$12$06McX6QFH2a6i0IsGUHrse/6TQ.31kxOI46/ei8ZdetyPJsUgacD.', '102345678901', 'user@gmail.com', '0322345678', 'Antsirabe', '1998-08-20', 4, 2, '2018-09-15', 'Antsirabe', 'Licence');

INSERT INTO categorie_question (description) VALUES ('Compréhension orale'), ('Clarté orale & Fluidité'), ('Niveau global de français');
INSERT INTO test_niveau (id, description, start_date, end_date, id_users, id_test_type, id_programme) VALUES (1, 'Test de niveau de français', '2026-09-03 10:00:00', '2026-09-03 11:00:00', 5, 1, 1);

INSERT INTO test_niveau_question (question, answers, correct_answer_idx, answer_idx, points, duree_minutes, id_test_niveau, id_categorie_question) VALUES 
('Quel est le thème principal de cet extrait audio ?', 'Le travail;Les vacances;La famille;Les études', 1, NULL, 1.00, 2, 1, 1), 
('Quelle est la bonne prononciation de cette phrase ?', 'Je suis français;Je suis française;Je suis francais;Je suis France', 1, NULL, 1.00, 2, 1, 2), 
('Quel est le niveau de français correspondant à une personne capable de comprendre des conversations simples ?', 'A1;A2;B2;C1', 2, NULL, 1.00, 2, 1, 3);