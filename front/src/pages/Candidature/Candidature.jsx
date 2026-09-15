import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaIdCard,
  FaGraduationCap,
  FaFileAlt,
  FaInfoCircle,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaUpload,
  FaFilePdf,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";

import styles from "./Candidature.module.css";

import RecrueSidebar from "../../pages/RecrueSidebar";
import Header from "../../component/Header/Header";

import { createUserInformation } from "../../api/userInformation";
import { getAllProgrammes } from "../../api/programme";

const isProgrammeActive = (programme) => {
  const statut = programme?.statut;

  return (
    statut === true ||
    (typeof statut === "string" &&
      ["actif", "true"].includes(statut.toLowerCase()))
  );
};

const Candidature = () => {
  const [cinFile, setCinFile] = useState(null);
  const [diplomeFile, setDiplomeFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  const [niveauEtudes, setNiveauEtudes] = useState("");
  const [independanceFinanciere, setIndependanceFinanciere] = useState("");
  const [disponibiliteEngagment, setDisponibiliteEngagment] = useState("");
  const [dateDisponibilite, setDateDisponibilite] = useState("");

  const [programmes, setProgrammes] = useState([]);
  const [idProgramme, setIdProgramme] = useState("");

  const [showSkillMatching, setShowSkillMatching] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingProgrammes, setLoadingProgrammes] = useState(false);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoadingProgrammes(true);
        setError("");

        const data = await getAllProgrammes();

        const activeProgrammes = (Array.isArray(data) ? data : []).filter(
          isProgrammeActive
        );

        setProgrammes(activeProgrammes);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des programmes :",
          error
        );

        setError(
          error.message ||
            "Erreur lors de la récupération des programmes."
        );
      } finally {
        setLoadingProgrammes(false);
      }
    };

    fetchProgrammes();
  }, []);

  const validateFile = (file) => {
    if (!file) return false;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
    ];

    return allowedTypes.includes(file.type);
  };

  const handleCinChange = (e) => {
    const file = e.target.files[0];

    setError("");
    setSuccess("");

    if (!file) {
      setCinFile(null);
      return;
    }

    if (!validateFile(file)) {
      setError(
        "La copie CIN doit être au format PDF, JPG ou JPEG."
      );

      e.target.value = "";
      setCinFile(null);
      return;
    }

    setCinFile(file);
  };

  const handleDiplomeChange = (e) => {
    const file = e.target.files[0];

    setError("");
    setSuccess("");

    if (!file) {
      setDiplomeFile(null);
      return;
    }

    if (!validateFile(file)) {
      setError(
        "Le dernier diplôme doit être au format PDF, JPG ou JPEG."
      );

      e.target.value = "";
      setDiplomeFile(null);
      return;
    }

    setDiplomeFile(file);
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];

    setError("");
    setSuccess("");

    if (!file) {
      setCvFile(null);
      return;
    }

    if (!validateFile(file)) {
      setError(
        "Le CV doit être au format PDF, JPG ou JPEG."
      );

      e.target.value = "";
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleContinue = () => {
    setError("");
    setSuccess("");

    if (!idProgramme) {
      setError("Veuillez sélectionner un programme.");
      return;
    }

    if (!cinFile || !diplomeFile || !cvFile) {
      setError(
        "Veuillez fournir les trois pièces justificatives requises."
      );
      return;
    }

    setShowSkillMatching(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getNiveauScore = () => {
    switch (niveauEtudes) {
      case "bac+":
        return 4;

      case "bac":
        return 2;

      case "bac-":
        return 0;

      default:
        return 0;
    }
  };

  const niveauScore = getNiveauScore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!idProgramme) {
      setError("Veuillez sélectionner un programme.");
      return;
    }

    if (
      !niveauEtudes ||
      !independanceFinanciere ||
      !disponibiliteEngagment ||
      !dateDisponibilite
    ) {
      setError(
        "Veuillez compléter tous les champs du Skill Matching."
      );
      return;
    }

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        setError("Utilisateur non connecté.");
        return;
      }

      const candidatureData = {
        idProgramme: Number(idProgramme),
        idUser: Number(user.id),

        niveauEtudes: niveauEtudes,

        independanceFinanciere:
          independanceFinanciere === "oui",

        disponibiliteEngagment:
          disponibiliteEngagment,

        dateDisponibilite:
          dateDisponibilite,

        interetPoste: null,
        niveauFrancais: null,
        clareteOrale: null,
        comprehensionOrale: null,

        cinFichier: cinFile
          ? cinFile.name
          : null,

        dernierDiplomeFichier: diplomeFile
          ? diplomeFile.name
          : null,

        cvFichier: cvFile
          ? cvFile.name
          : null,
      };

      console.log(
        "Données candidature envoyées :",
        candidatureData
      );

      await createUserInformation(candidatureData);

      setSuccess(
        "Votre candidature a été enregistrée avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de la candidature :",
        error
      );

      setError(
        error.message ||
          "Erreur lors de l'enregistrement de la candidature."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowSkillMatching(false);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getFileName = (file) => {
    if (!file) {
      return "Aucun fichier sélectionné";
    }

    return file.name;
  };

  return (
    <div
      className={`d-flex flex-column flex-lg-row ${styles.container}`}
    >
      <RecrueSidebar />

      <div className={styles.mainArea}>
        <Header
          title="Candidature"
          showSearch={false}
        />

        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h2>Déposer une candidature</h2>
          </div>

          <div className={styles.steps}>
            <div
              className={`${styles.step} ${
                !showSkillMatching
                  ? styles.activeStep
                  : styles.completedStep
              }`}
            >
              <div className={styles.stepNumber}>
                {!showSkillMatching ? (
                  "1"
                ) : (
                  <FaCheck />
                )}
              </div>

              <div className={styles.stepText}>
                <strong>
                  Pièces justificatives
                </strong>

                <span>
                  Documents requis
                </span>
              </div>
            </div>

            <div className={styles.stepLine}></div>

            <div
              className={`${styles.step} ${
                showSkillMatching
                  ? styles.activeStep
                  : ""
              }`}
            >
              <div className={styles.stepNumber}>
                2
              </div>

              <div className={styles.stepText}>
                <strong>
                  Skill Matching
                </strong>

                <span>
                  Évaluation
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <FaExclamationCircle
                className={styles.messageIcon}
              />

              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <FaCheck
                className={styles.messageIcon}
              />

              <span>{success}</span>
            </div>
          )}

          {!showSkillMatching && (
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p>
                    Veuillez fournir les documents
                    nécessaires à votre candidature.
                  </p>
                </div>
              </div>

              <div
                className={styles.skillCard}
                style={{ marginBottom: "25px" }}
              >
                <label className={styles.label}>
                  Sélectionnez votre programme

                  <span className={styles.required}>
                    *
                  </span>
                </label>

                <select
                  value={idProgramme}
                  onChange={(e) =>
                    setIdProgramme(e.target.value)
                  }
                  className={styles.select}
                  required
                  disabled={loadingProgrammes}
                >
                  <option value="">
                    {loadingProgrammes
                      ? "Chargement des programmes..."
                      : "Sélectionner un programme"}
                  </option>

                  {programmes.map((programme) => (
                    <option
                      key={programme.id}
                      value={programme.id}
                    >
                      {programme.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.documentsGrid}>
                <div className={styles.documentItem}>
                  <div className={styles.documentIcon}>
                    <FaIdCard />
                  </div>

                  <div className={styles.documentInfo}>
                    <label>
                      Copie CIN

                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <p>
                      Copie de votre carte d'identité
                      nationale.
                    </p>

                    <span className={styles.format}>
                      PDF / JPG / JPEG
                    </span>

                    <input
                      id="cinFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={handleCinChange}
                      className={styles.fileInput}
                    />

                    <label
                      htmlFor="cinFile"
                      className={styles.fileButton}
                    >
                      <FaUpload />

                      Choisir un fichier
                    </label>

                    <div className={styles.fileName}>
                      <FaFilePdf />

                      <span>
                        {getFileName(cinFile)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.documentItem}>
                  <div className={styles.documentIcon}>
                    <FaGraduationCap />
                  </div>

                  <div className={styles.documentInfo}>
                    <label>
                      Dernier diplôme

                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <p>
                      Copie de votre dernier diplôme
                      obtenu.
                    </p>

                    <span className={styles.format}>
                      PDF / JPG / JPEG
                    </span>

                    <input
                      id="diplomeFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={handleDiplomeChange}
                      className={styles.fileInput}
                    />

                    <label
                      htmlFor="diplomeFile"
                      className={styles.fileButton}
                    >
                      <FaUpload />

                      Choisir un fichier
                    </label>

                    <div className={styles.fileName}>
                      <FaFilePdf />

                      <span>
                        {getFileName(diplomeFile)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.documentItem}>
                  <div className={styles.documentIcon}>
                    <FaFileAlt />
                  </div>

                  <div className={styles.documentInfo}>
                    <label>
                      CV

                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <p>
                      Votre curriculum vitae à jour.
                    </p>

                    <span className={styles.format}>
                      PDF / JPG / JPEG
                    </span>

                    <input
                      id="cvFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={handleCvChange}
                      className={styles.fileInput}
                    />

                    <label
                      htmlFor="cvFile"
                      className={styles.fileButton}
                    >
                      <FaUpload />

                      Choisir un fichier
                    </label>

                    <div className={styles.fileName}>
                      <FaFilePdf />

                      <span>
                        {getFileName(cvFile)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infoBox}>
                <FaInfoCircle />

                <p>
                  Le programme et les trois documents
                  sont obligatoires pour continuer.
                  Formats acceptés : PDF, JPG et JPEG.
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleContinue}
                  disabled={loadingProgrammes}
                >
                  Continuer vers Skill Matching

                  <FaArrowRight />
                </button>
              </div>
            </section>
          )}

          {showSkillMatching && (
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p>
                    Complétez les informations demandées
                    pour finaliser votre candidature.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.skillGrid}>

                  <div className={styles.skillCard}>
                    <div className={styles.skillHeader}>
                      <div className={styles.skillIcon}>
                        <FaGraduationCap />
                      </div>

                      <div>
                        <h4>
                          Niveau d'études
                        </h4>
                      </div>
                    </div>

                    <label className={styles.label}>
                      Sélectionnez votre niveau

                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <select
                      value={niveauEtudes}
                      onChange={(e) =>
                        setNiveauEtudes(e.target.value)
                      }
                      className={styles.select}
                      required
                    >
                      <option value="">
                        Sélectionner votre niveau
                      </option>

                      <option value="bac+">
                        Bac+ / Bac+2 et plus
                      </option>

                      <option value="bac">
                        Baccalauréat
                      </option>

                      <option value="bac-">
                        Pré-bac / Non bachelier
                      </option>
                    </select>
                  </div>

                  <div className={styles.skillCard}>
                    <div className={styles.skillHeader}>
                      <div className={styles.skillIcon}>
                        <FaMoneyBillWave />
                      </div>

                      <div>
                        <h4>
                          Indépendance financière
                        </h4>
                      </div>
                    </div>

                    <label className={styles.label}>
                      Êtes-vous financièrement indépendant ?

                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <select
                      value={independanceFinanciere}
                      onChange={(e) =>
                        setIndependanceFinanciere(
                          e.target.value
                        )
                      }
                      className={styles.select}
                      required
                    >
                      <option value="">
                        Sélectionner une réponse
                      </option>

                      <option value="oui">
                        Oui
                      </option>

                      <option value="non">
                        Non
                      </option>
                    </select>
                  </div>

                  <div className={styles.skillCard}>
                    <div className={styles.skillHeader}>
                      <div className={styles.skillIcon}>
                        <FaBriefcase />
                      </div>

                      <div>
                        <h4>
                          Disponibilité / engagement
                        </h4>
                      </div>
                    </div>

                    <label className={styles.label}>
                      Indiquez votre disponibilité

                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <select
                      value={disponibiliteEngagment}
                      onChange={(e) =>
                        setDisponibiliteEngagment(
                          e.target.value
                        )
                      }
                      className={styles.select}
                      required
                    >
                      <option value="">
                        Sélectionner votre disponibilité
                      </option>

                      <option value="non dispo">
                        Non disponible
                      </option>

                      <option value="dispo-">
                        Disponible partiellement
                      </option>

                      <option value="dispo">
                        Disponible et engagé
                      </option>
                    </select>
                  </div>

                  <div className={styles.skillCard}>
                    <div className={styles.skillHeader}>
                      <div className={styles.skillIcon}>
                        <FaCalendarAlt />
                      </div>

                      <div>
                        <h4>
                          Date de disponibilité
                        </h4>
                      </div>
                    </div>

                    <label className={styles.label}>
                      À partir de quelle date êtes-vous disponible ?

                      <span className={styles.required}>
                        *
                      </span>
                    </label>

                    <input
                      type="date"
                      value={dateDisponibilite}
                      onChange={(e) =>
                        setDateDisponibilite(
                          e.target.value
                        )
                      }
                      className={styles.select}
                      required
                    />
                  </div>

                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={handleBack}
                    disabled={loading}
                  >
                    <FaArrowLeft />

                    Retour
                  </button>

                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading}
                  >
                    {loading
                      ? "Enregistrement..."
                      : "Valider ma candidature"}

                    {!loading && <FaCheck />}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidature;