import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./Formateur.module.css";

import FormateurSidebar from "../../pages/FormateurSidebar";
import Header from "../../component/Header/Header";

import {
  getAllTestNiveaux,
  createTestNiveau,
} from "../../api/testNiveau";

import {
  getAllCandidatsScores,
} from "../../api/vueCandidatScore";

import {
  getAllProgrammes,
  getProgrammeById,
} from "../../api/programme";

import {
  getUserById,
} from "../../api/user";

import {
  FaClipboardList,
  FaPlus,
  FaQuestionCircle,
  FaClock,
  FaChevronRight,
  FaExclamationCircle,
  FaRedo,
  FaTimes,
  FaSearch,
  FaCheck,
  FaUser,
  FaCalendarAlt,
  FaSave,
  FaGraduationCap,
} from "react-icons/fa";

const Formateur = () => {
  const navigate = useNavigate();

  /* =========================================================
    PRÉQUALIFICATIONS
  ========================================================= */

  const [testNiveaux, setTestNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     DÉTAILS (UTILISATEUR / PROGRAMME) DES TESTS
  ========================================================= */

  const [userMap, setUserMap] = useState({});
  const [programmeDetailsMap, setProgrammeDetailsMap] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* =========================================================
     POPUP CRÉATION
  ========================================================= */

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [createdPrequalificationIds, setCreatedPrequalificationIds] = useState([]);

  /* =========================================================
     FORMULAIRE CRÉATION
  ========================================================= */

  const [formData, setFormData] = useState({
    description: "",
    startDate: "",
    endDate: "",
    idProgramme: "",
    idTestType: 1,
  });

  /* =========================================================
     PROGRAMMES
  ========================================================= */

  const [programmes, setProgrammes] = useState([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(false);
  const [programmeError, setProgrammeError] = useState("");

  /* =========================================================
     CANDIDATS
  ========================================================= */

  const [candidats, setCandidats] = useState([]);
  const [loadingCandidats, setLoadingCandidats] = useState(false);
  const [candidatError, setCandidatError] = useState("");
  const [selectedCandidats, setSelectedCandidats] = useState([]);
  const [searchCandidat, setSearchCandidat] = useState("");

  /* =========================================================
     RÉCUPÉRER ID CANDIDAT
  ========================================================= */

  const getCandidatId = (candidat) => {
    return (
      candidat.idUser ??
      candidat.id_user ??
      candidat.userId ??
      candidat.user_id ??
      candidat.id ??
      candidat.idCandidat ??
      candidat.id_candidat ??
      null
    );
  };

  /* =========================================================
     RÉCUPÉRER NOM CANDIDAT
  ========================================================= */

  const getCandidatNom = (candidat) => {

    const prenom =
      candidat.prenom ??
      candidat.userPrenom ??
      candidat.user_prenom ??
      candidat.firstName ??
      "";

    const nom =
      candidat.nom ??
      candidat.userNom ??
      candidat.user_nom ??
      candidat.lastName ??
      "";

    const fullName =
      `${prenom} ${nom}`.trim();

    return (
      fullName ||
      candidat.nomComplet ||
      candidat.nom_complet ||
      candidat.name ||
      candidat.email ||
      "Candidat"
    );
  };

  /* =========================================================
     RÉCUPÉRER EMAIL
  ========================================================= */

  const getCandidatEmail = (candidat) => {
    return (
      candidat.email ??
      candidat.userEmail ??
      candidat.user_email ??
      ""
    );
  };

  /* =========================================================
     RÉCUPÉRER CIN
  ========================================================= */

  const getCandidatCin = (candidat) => {
    return (
      candidat.cin ??
      candidat.userCin ??
      candidat.user_cin ??
      ""
    );
  };

  /* =========================================================
     RÉCUPÉRER ID PROGRAMME
  ========================================================= */

  const getProgrammeId = (programme) => {
    return (
      programme.idProgramme ??
      programme.id_programme ??
      programme.id ??
      null
    );
  };

  /* =========================================================
     RÉCUPÉRER NOM PROGRAMME
  ========================================================= */

  const getProgrammeNom = (programme) => {
    return (
      programme.nom ??
      programme.nomProgramme ??
      programme.nom_programme ??
      programme.libelle ??
      programme.description ??
      `Programme ${getProgrammeId(programme)}`
    );
  };

  /* =========================================================
     FORMATER UNE DATE (JJ/MM/AAAA HH:mm)
  ========================================================= */

  const formatDateTime = (dateStr) => {

    if (!dateStr) {
      return "—";
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return dateStr;
    }

    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     NOM UTILISATEUR (À PARTIR DU idUsers D'UN TEST)
  ========================================================= */

  const getUserDisplayName = (idUsers) => {

    if (loadingDetails) {
      return "Chargement...";
    }

    const user = userMap[idUsers];

    if (!user) {
      return "Utilisateur inconnu";
    }

    return getCandidatNom(user);
  };

  /* =========================================================
     NOM PROGRAMME (À PARTIR DU idProgramme D'UN TEST)
  ========================================================= */

  const getProgrammeDisplayName = (idProgramme) => {

    if (loadingDetails) {
      return "Chargement...";
    }

    const programme = programmeDetailsMap[idProgramme];

    if (!programme) {
      return "Programme inconnu";
    }

    return getProgrammeNom(programme);
  };

  /* =========================================================
     RÉCUPÉRER LES DÉTAILS (UTILISATEURS + PROGRAMMES)
    DES PRÉQUALIFICATIONS
  ========================================================= */

  const fetchTestNiveauxDetails = async (tests) => {

    try {

      setLoadingDetails(true);

      const uniqueUserIds =
        [...new Set(
          tests
            .map((test) => test.idUsers)
            .filter((id) => id !== null && id !== undefined)
        )];

      const uniqueProgrammeIds =
        [...new Set(
          tests
            .map((test) => test.idProgramme)
            .filter((id) => id !== null && id !== undefined)
        )];

      const userEntries = await Promise.all(
        uniqueUserIds.map(async (id) => {

          try {

            const data = await getUserById(id);

            return [id, data];

          } catch (err) {

            console.error(
              `Erreur lors de la récupération de l'utilisateur ${id} :`,
              err
            );

            return [id, null];

          }

        })
      );

      const programmeEntries = await Promise.all(
        uniqueProgrammeIds.map(async (id) => {

          try {

            const data = await getProgrammeById(id);

            return [id, data];

          } catch (err) {

            console.error(
              `Erreur lors de la récupération du programme ${id} :`,
              err
            );

            return [id, null];

          }

        })
      );

      setUserMap(Object.fromEntries(userEntries));
      setProgrammeDetailsMap(Object.fromEntries(programmeEntries));

    } catch (err) {

      console.error(
        "Erreur lors de la récupération des détails des préqualifications :",
        err
      );

    } finally {

      setLoadingDetails(false);

    }
  };

  /* =========================================================
     RÉCUPÉRER LES TESTS
  ========================================================= */

  const fetchTestNiveaux = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllTestNiveaux();

      console.log(
        "Préqualifications récupérées :",
        data
      );

      const liste = Array.isArray(data) ? data : [];

      // Afficher uniquement les tests de type 1
      const testsType2 = liste.filter(
        (test) => Number(test.idTestType) === 1
      );

      console.log(
        "Préqualifications de type 1 :",
        testsType2
      );

      setTestNiveaux(testsType2);

      fetchTestNiveauxDetails(testsType2);

    } catch (err) {

      console.error(
        "Erreur lors de la récupération des préqualifications :",
        err
      );

      console.error(
        "Stack trace :",
        err.stack
      );

      setError(
        err.message ||
          "Erreur lors de la récupération des préqualifications."
      );

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     CHARGEMENT INITIAL
  ========================================================= */

  useEffect(() => {
    fetchTestNiveaux();
  }, []);

  /* =========================================================
     RÉCUPÉRER PROGRAMMES
  ========================================================= */

  const fetchProgrammes = async () => {

    try {

      setLoadingProgrammes(true);
      setProgrammeError("");

      const data = await getAllProgrammes();

      console.log(
        "Programmes récupérés :",
        data
      );

      setProgrammes(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Erreur lors de la récupération des programmes :",
        err
      );

      setProgrammeError(
        err.message ||
          "Impossible de récupérer les programmes."
      );

      setProgrammes([]);

    } finally {

      setLoadingProgrammes(false);

    }
  };

  /* =========================================================
     RÉCUPÉRER CANDIDATS
  ========================================================= */

  const fetchCandidats = async () => {

    try {

      setLoadingCandidats(true);
      setCandidatError("");

      const data =
        await getAllCandidatsScores();

      console.log(
        "Candidats récupérés :",
        data
      );

      const liste =
        Array.isArray(data)
          ? data
          : [];

      const candidatsEligibles =
        liste.filter(
          (candidat) => Number(candidat.noteTotale) >= 10
        );

      setCandidats(candidatsEligibles);

      /*
       * Tous les candidats sont
       * sélectionnés par défaut.
       */

      const ids =
        candidatsEligibles
          .map((candidat) =>
            getCandidatId(candidat)
          )
          .filter(
            (id) =>
              id !== null &&
              id !== undefined
          );

      setSelectedCandidats(ids);

    } catch (err) {

      console.error(
        "Erreur lors de la récupération des candidats :",
        err
      );

      setCandidatError(
        err.message ||
          "Impossible de récupérer la liste des candidats."
      );

      setCandidats([]);
      setSelectedCandidats([]);

    } finally {

      setLoadingCandidats(false);

    }
  };

  /* =========================================================
     OUVRIR POPUP
  ========================================================= */

  const handleOpenCreateModal = async () => {

    setShowCreateModal(true);

    setCreateError("");
    setCreateSuccess("");
    setCreatedPrequalificationIds([]);

    setSearchCandidat("");

    setFormData({
      description: "",
      startDate: "",
      endDate: "",
      idProgramme: "",
      idTestType: 1,
    });

    /*
     * Charger les programmes et les candidats
     * en même temps.
     */

    await Promise.all([
      fetchProgrammes(),
      fetchCandidats(),
    ]);
  };

  /* =========================================================
     FERMER POPUP
  ========================================================= */

  const handleCloseCreateModal = () => {

    if (creating) {
      return;
    }

    setShowCreateModal(false);

    setCreateError("");
    setCreateSuccess("");
    setCreatedPrequalificationIds([]);
    setSearchCandidat("");

  };

  /* =========================================================
     CHANGEMENT FORMULAIRE
  ========================================================= */

  const handleFormChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     RECHERCHE CANDIDAT
  ========================================================= */

  const filteredCandidats =
    useMemo(() => {

      const search =
        searchCandidat
          .trim()
          .toLowerCase();

      if (!search) {
        return candidats;
      }

      return candidats.filter(
        (candidat) => {

          const nom =
            getCandidatNom(
              candidat
            ).toLowerCase();

          const email =
            getCandidatEmail(
              candidat
            ).toLowerCase();

          const cin =
            String(
              getCandidatCin(
                candidat
              )
            ).toLowerCase();

          return (
            nom.includes(search) ||
            email.includes(search) ||
            cin.includes(search)
          );
        }
      );

    }, [
      candidats,
      searchCandidat,
    ]);

  /* =========================================================
     SÉLECTION / DÉSÉLECTION CANDIDAT
  ========================================================= */

  const handleToggleCandidat = (id) => {

    setSelectedCandidats(
      (prev) => {

        if (prev.includes(id)) {

          return prev.filter(
            (selectedId) =>
              selectedId !== id
          );

        }

        return [
          ...prev,
          id,
        ];

      }
    );
  };

  /* =========================================================
     TOUT SÉLECTIONNER
  ========================================================= */

  const handleSelectAll = () => {

    const visibleIds =
      filteredCandidats
        .map((candidat) =>
          getCandidatId(candidat)
        )
        .filter(
          (id) =>
            id !== null &&
            id !== undefined
        );

    setSelectedCandidats(
      (prev) => {

        const ids =
          new Set(prev);

        visibleIds.forEach(
          (id) => {
            ids.add(id);
          }
        );

        return Array.from(ids);
      }
    );
  };

  /* =========================================================
     TOUT DÉCOCHER
  ========================================================= */

  const handleDeselectAll = () => {

    const visibleIds =
      new Set(
        filteredCandidats
          .map((candidat) =>
            getCandidatId(
              candidat
            )
          )
          .filter(
            (id) =>
              id !== null &&
              id !== undefined
          )
      );

    setSelectedCandidats(
      (prev) =>
        prev.filter(
          (id) =>
            !visibleIds.has(id)
        )
    );
  };

  /* =========================================================
     CRÉER LES TESTS
  ========================================================= */

  const handleCreateTest = async (e) => {

    e.preventDefault();

    setCreateError("");
    setCreateSuccess("");

    /* ---------------------------------------------------------
       VALIDATION DESCRIPTION
    --------------------------------------------------------- */

    if (
      !formData.description.trim()
    ) {

      setCreateError(
        "Veuillez saisir la description du test."
      );

      return;
    }

    /* ---------------------------------------------------------
       VALIDATION DATE DÉBUT
    --------------------------------------------------------- */

    if (!formData.startDate) {

      setCreateError(
        "Veuillez sélectionner la date et l'heure de début."
      );

      return;
    }

    /* ---------------------------------------------------------
       VALIDATION DATE FIN
    --------------------------------------------------------- */

    if (!formData.endDate) {

      setCreateError(
        "Veuillez sélectionner la date et l'heure de fin."
      );

      return;
    }

    /* ---------------------------------------------------------
       VALIDATION ORDRE DATES
    --------------------------------------------------------- */

    const startDate =
      new Date(
        formData.startDate
      );

    const endDate =
      new Date(
        formData.endDate
      );

    if (
      endDate <= startDate
    ) {

      setCreateError(
        "La date et l'heure de fin doivent être postérieures à la date et l'heure de début."
      );

      return;
    }

    /* ---------------------------------------------------------
       VALIDATION PROGRAMME
    --------------------------------------------------------- */

    if (!formData.idProgramme) {

      setCreateError(
        "Veuillez sélectionner un programme."
      );

      return;
    }

    /* ---------------------------------------------------------
       VALIDATION TYPE
    --------------------------------------------------------- */

    if (!formData.idTestType) {

      setCreateError(
        "Veuillez saisir l'identifiant du type de test."
      );

      return;
    }

    /* ---------------------------------------------------------
       VALIDATION CANDIDATS
    --------------------------------------------------------- */

    if (
      selectedCandidats.length === 0
    ) {

      setCreateError(
        "Veuillez sélectionner au moins un candidat."
      );

      return;
    }

    /* =========================================================
       CRÉATION
    ========================================================= */

    try {

      setCreating(true);

      let nombreCrees = 0;
      const newPrequalificationIds = [];

      /*
       * Un INSERT est effectué pour
       * chaque candidat sélectionné.
       */

      for (
        const idUser
        of selectedCandidats
      ) {

        const testNiveau = {

          description:
            formData.description.trim(),

          /*
           * datetime-local retourne :
           *
           * 2026-09-08T14:30
           *
           * Compatible avec LocalDateTime
           * côté Spring.
           */

          startDate:
            formData.startDate,

          endDate:
            formData.endDate,

          idProgramme:
            Number(
              formData.idProgramme
            ),

          idTestType:
            Number(
              formData.idTestType
            ),

          idUsers:
            Number(idUser),
        };

        console.log(
          "Création du test :",
          testNiveau
        );

        const createdTest = await createTestNiveau(testNiveau);

        const createdPrequalificationId =
          createdTest?.id ??
          createdTest?.idTestNiveau ??
          createdTest?.id_test_niveau;

        if (createdPrequalificationId === null || createdPrequalificationId === undefined) {
          throw new Error(
            "L'identifiant du test créé n'a pas été retourné par le serveur."
          );
        }

        newPrequalificationIds.push(createdPrequalificationId);

        nombreCrees++;
      }

      /* =====================================================
         SUCCÈS
      ===================================================== */

      console.log(
        `${nombreCrees} test(s) de niveau créé(s).`
      );

      setCreateSuccess(
        `${nombreCrees} test${
          nombreCrees > 1
            ? "s"
            : ""
        } de niveau créé${
          nombreCrees > 1
            ? "s"
            : ""
        } avec succès.`
      );

      setCreatedPrequalificationIds(newPrequalificationIds);

      /* -------------------------------------------------------
         RECHARGER LES TESTS
      ------------------------------------------------------- */

      await fetchTestNiveaux();

    } catch (err) {

      console.error(
        "Erreur lors de la création des préqualifications :",
        err
      );

      setCreateError(
        err.message ||
          "Une erreur est survenue lors de la création du test."
      );

    } finally {

      setCreating(false);

    }
  };

  /* =========================================================
     RENDU
  ========================================================= */

  return (

    <div
      className={`d-flex ${styles.adminContainer}`}
    >

      <FormateurSidebar />

      <div
        className={styles.mainContent}
      >

        <Header
          title="Formateur"
          showSearch={false}
        />

        <main
          className={styles.content}
        >

          {/* =====================================================
              EN-TÊTE
          ===================================================== */}

          <div
            className={styles.pageHeader}
          >

            <div
              className={styles.pageHeaderText}
            >

              <h1
                className={styles.title}
              >
                Préqualifications
              </h1>

              <p
                className={styles.subtitle}
              >
                Gérez les préqualifications disponibles pour les
                candidats.
              </p>

            </div>

            <div
              className={styles.headerActions}
            >

              <button
                type="button"
                className={
                  styles.createButton
                }
                onClick={
                  handleOpenCreateModal
                }
              >

                <FaPlus />

                <span>
                  Nouveau test
                </span>

              </button>

            </div>

          </div>

          {/* =====================================================
              STATISTIQUES
          ===================================================== */}

          {!loading &&
            !error && (

              <div
                className={
                  styles.statsContainer
                }
              >

                <div
                  className={
                    styles.statCard
                  }
                >

                  <div
                    className={
                      styles.statIcon
                    }
                  >
                    <FaClipboardList />
                  </div>

                  <div>

                    <span
                      className={
                        styles.statValue
                      }
                    >
                      {testNiveaux.length}
                    </span>

                    <span
                      className={
                        styles.statLabel
                      }
                    >
                      Tests disponibles
                    </span>

                  </div>

                </div>

                <div
                  className={
                    styles.statCard
                  }
                >

                  <div
                    className={
                      styles.statIcon
                    }
                  >
                    <FaGraduationCap />
                  </div>

                  <div>

                    <span
                      className={
                        styles.statValue
                      }
                    >

                      {
                        [...new Set(
                          testNiveaux
                            .map((test) => test.idProgramme)
                            .filter((id) => id !== null && id !== undefined)
                        )].length
                      }

                    </span>

                    <span
                      className={
                        styles.statLabel
                      }
                    >
                      Programmes concernés
                    </span>

                  </div>

                </div>

                <div
                  className={
                    styles.statCard
                  }
                >

                  <div
                    className={
                      styles.statIcon
                    }
                  >
                    <FaUser />
                  </div>

                  <div>

                    <span
                      className={
                        styles.statValue
                      }
                    >

                      {
                        [...new Set(
                          testNiveaux
                            .map((test) => test.idUsers)
                            .filter((id) => id !== null && id !== undefined)
                        )].length
                      }

                    </span>

                    <span
                      className={
                        styles.statLabel
                      }
                    >
                      Candidats concernés
                    </span>

                  </div>

                </div>

              </div>

            )}

          {/* =====================================================
              CONTENU
          ===================================================== */}

          <div
            className={
              styles.tableContainer
            }
          >

            {/* LOADING */}

            {loading && (

              <div
                className={
                  styles.loadingContainer
                }
              >

                <div
                  className="spinner-border"
                  role="status"
                  aria-hidden="true"
                ></div>

                <p>
                  Chargement des préqualifications...
                </p>

              </div>

            )}

            {/* ERROR */}

            {!loading &&
              error && (

                <div
                  className={
                    styles.errorContainer
                  }
                >

                  <div
                    className={`alert alert-danger ${styles.errorAlert}`}
                    role="alert"
                  >

                    <div
                      className={
                        styles.errorMessage
                      }
                    >

                      <FaExclamationCircle />

                      <span>
                        {error}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className={
                      styles.retryButton
                    }
                    onClick={
                      fetchTestNiveaux
                    }
                  >

                    <FaRedo />

                    Réessayer

                  </button>

                </div>

              )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              testNiveaux.length === 0 && (

                <div
                  className={
                    styles.empty
                  }
                >

                  <div
                    className={
                      styles.emptyIcon
                    }
                  >
                    <FaClipboardList />
                  </div>

                  <h3>
                    Aucune préqualification
                  </h3>

                  <p>
                    Aucune préqualification n'est actuellement
                    disponible.
                  </p>

                </div>

              )}

            {/* LISTE */}

            {!loading &&
              !error &&
              testNiveaux.length > 0 && (

                <div
                  className={
                    styles.testsList
                  }
                >

                  {testNiveaux.map(
                    (test, index) => {

                      const prequalificationId =
                        test.id ??
                        test.idTestNiveau ??
                        test.id_test_niveau ??
                        index;

                      const description =
                        test.description ||
                        "Aucune description fournie.";

                      const startDate =
                        formatDateTime(
                          test.startDate
                        );

                      const endDate =
                        formatDateTime(
                          test.endDate
                        );

                      const programmeName =
                        getProgrammeDisplayName(
                          test.idProgramme
                        );

                      const userName =
                        getUserDisplayName(
                          test.idUsers
                        );

                      return (

                        <div
                          key={prequalificationId}
                          className={
                            styles.evaluationCard
                          }
                        >

                          <div
                            className={styles.cardIcon}
                          >
                            <FaClipboardList />
                          </div>

                          <div className={styles.cardBody}>

                            <div className={styles.cardHeader}>
                              <div>
                                <h2>
                                  {description}
                                </h2>

                                <p>
                                  Préqualification #{prequalificationId}
                                </p>
                              </div>

                              <span
                                className={`${styles.status} ${styles.available}`}
                              >
                                <FaCheck />
                                Disponible
                              </span>
                            </div>

                            <div className={styles.dateContainer}>
                              <div className={styles.dateItem}>
                                <FaGraduationCap />

                                <div>
                                  <span>Programme</span>
                                  <strong>{programmeName}</strong>
                                </div>
                              </div>

                              <div className={styles.dateSeparator}>|</div>

                              <div className={styles.dateItem}>
                                <FaUser />

                                <div>
                                  <span>Candidat</span>
                                  <strong>{userName}</strong>
                                </div>
                              </div>

                              <div className={styles.dateSeparator}>|</div>

                              <div className={styles.dateItem}>
                                <FaCalendarAlt />

                                <div>
                                  <span>Période</span>
                                  <strong>{startDate} → {endDate}</strong>
                                </div>
                              </div>
                            </div>

                            <div className={styles.cardFooter}>
                              <button
                                type="button"
                                className={styles.startButton}
                                title="Gérer la préqualification"
                                onClick={() => {
                                  console.log(
                                    "ID de la préqualification sélectionnée:",
                                    prequalificationId
                                  );

                                  navigate(
                                    `/formateur/prequalification/${prequalificationId}`
                                  );
                                }}
                              >
                                Gérer la préqualification
                                <FaChevronRight />
                              </button>
                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )}

          </div>

        </main>

      </div>

      {/* =========================================================
          POPUP CRÉATION PRÉQUALIFICATION
      ========================================================= */}

      {showCreateModal && (

        <div
          className={
            styles.modalOverlay
          }
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              handleCloseCreateModal();

            }

          }}
        >

          <div
            className={
              styles.createModal
            }
          >

            {/* =====================================================
                HEADER POPUP
            ===================================================== */}

            <div
              className={
                styles.modalHeader
              }
            >

              <div>

                <h2>
                  Créer une préqualification
                </h2>

                <p>
                  Configurez le test et sélectionnez les candidats
                  concernés.
                </p>

              </div>

              <button
                type="button"
                className={
                  styles.modalCloseButton
                }
                onClick={
                  handleCloseCreateModal
                }
                disabled={creating}
              >
                <FaTimes />
              </button>

            </div>

            {/* =====================================================
                FORMULAIRE
            ===================================================== */}

            <form
              className={
                styles.modalBody
              }
              onSubmit={
                handleCreateTest
              }
            >

              {/* ===================================================
                  INFORMATIONS DU TEST
              =================================================== */}

              <div
                className={
                  styles.modalSection
                }
              >

                <div
                  className={
                    styles.modalSectionTitle
                  }
                >
                  Informations du test
                </div>

                <div
                  className={
                    styles.modalFormGrid
                  }
                >

                  {/* DESCRIPTION */}

                  <div
                    className={`${styles.modalFormGroup} ${styles.modalFormFull}`}
                  >

                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="Ex : Préqualification informatique générale"
                      rows="3"
                    />

                  </div>

                  {/* PROGRAMME */}

                  <div
                    className={`${styles.modalFormGroup} ${styles.modalFormFull}`}
                  >

                    <label>

                      <FaGraduationCap />

                      Programme

                    </label>

                    <select
                      name="idProgramme"
                      value={
                        formData.idProgramme
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={
                        loadingProgrammes ||
                        creating
                      }
                    >

                      <option value="">
                        {loadingProgrammes
                          ? "Chargement des programmes..."
                          : "Sélectionner un programme"}
                      </option>

                      {!loadingProgrammes &&
                        programmes.map(
                          (programme) => {

                            const programmeId =
                              getProgrammeId(
                                programme
                              );

                            return (

                              <option
                                key={
                                  programmeId
                                }
                                value={
                                  programmeId
                                }
                              >
                                {
                                  getProgrammeNom(
                                    programme
                                  )
                                }
                              </option>

                            );

                          }
                        )}

                    </select>

                    {programmeError && (

                      <small
                        className={
                          styles.candidatError
                        }
                      >

                        <FaExclamationCircle />

                        {programmeError}

                      </small>

                    )}

                  </div>

                  {/* DATE / HEURE DÉBUT */}

                  <div
                    className={
                      styles.modalFormGroup
                    }
                  >

                    <label>

                      <FaCalendarAlt />

                      Date et heure de début

                    </label>

                    <input
                      type="datetime-local"
                      name="startDate"
                      value={
                        formData.startDate
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                  </div>

                  {/* DATE / HEURE FIN */}

                  <div
                    className={
                      styles.modalFormGroup
                    }
                  >

                    <label>

                      <FaCalendarAlt />

                      Date et heure de fin

                    </label>

                    <input
                      type="datetime-local"
                      name="endDate"
                      value={
                        formData.endDate
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                  </div>                  

                </div>

              </div>

              {/* ===================================================
                  CANDIDATS
              =================================================== */}

              <div
                className={
                  styles.modalSection
                }
              >

                <div
                  className={
                    styles.candidatHeader
                  }
                >

                  <div>

                    <div
                      className={
                        styles.modalSectionTitle
                      }
                    >
                      Candidats concernés
                    </div>

                    <span
                      className={
                        styles.selectionCounter
                      }
                    >

                      {selectedCandidats.length}

                      {" "}sélectionné
                      {selectedCandidats.length > 1
                        ? "s"
                        : ""}

                      {" "}/{" "}

                      {candidats.length}

                    </span>

                  </div>

                  {/* ACTIONS SÉLECTION */}

                  <div
                    className={
                      styles.selectionActions
                    }
                  >

                    <button
                      type="button"
                      onClick={
                        handleSelectAll
                      }
                      disabled={
                        loadingCandidats ||
                        filteredCandidats.length ===
                          0
                      }
                    >

                      <FaCheck />

                      Tout sélectionner

                    </button>

                    <button
                      type="button"
                      onClick={
                        handleDeselectAll
                      }
                      disabled={
                        loadingCandidats ||
                        filteredCandidats.length ===
                          0
                      }
                    >

                      <FaTimes />

                      Tout décocher

                    </button>

                  </div>

                </div>

                {/* =================================================
                    RECHERCHE
                ================================================= */}

                <div
                  className={
                    styles.candidatSearch
                  }
                >

                  <FaSearch />

                  <input
                    type="text"
                    value={
                      searchCandidat
                    }
                    onChange={(e) =>
                      setSearchCandidat(
                        e.target.value
                      )
                    }
                    placeholder="Rechercher un candidat par nom, email ou CIN..."
                  />

                  {searchCandidat && (

                    <button
                      type="button"
                      onClick={() =>
                        setSearchCandidat(
                          ""
                        )
                      }
                    >
                      <FaTimes />
                    </button>

                  )}

                </div>

                {/* =================================================
                    ERREUR CANDIDATS
                ================================================= */}

                {candidatError && (

                  <div
                    className={
                      styles.candidatError
                    }
                  >

                    <FaExclamationCircle />

                    <span>
                      {candidatError}
                    </span>

                  </div>

                )}

                {/* =================================================
                    CHARGEMENT CANDIDATS
                ================================================= */}

                {loadingCandidats ? (

                  <div
                    className={
                      styles.candidatsLoading
                    }
                  >

                    <div
                      className="spinner-border"
                      role="status"
                    ></div>

                    <span>
                      Chargement des candidats...
                    </span>

                  </div>

                ) : (

                  <div
                    className={
                      styles.candidatsList
                    }
                  >

                    {filteredCandidats.length ===
                    0 ? (

                      <div
                        className={
                          styles.noCandidat
                        }
                      >

                        <FaUser />

                        <span>
                          Aucun candidat trouvé.
                        </span>

                      </div>

                    ) : (

                      filteredCandidats.map(
                        (
                          candidat
                        ) => {

                          const candidatId =
                            getCandidatId(
                              candidat
                            );

                          const nom =
                            getCandidatNom(
                              candidat
                            );

                          const email =
                            getCandidatEmail(
                              candidat
                            );

                          const cin =
                            getCandidatCin(
                              candidat
                            );

                          const isSelected =
                            selectedCandidats.includes(
                              candidatId
                            );

                          return (

                            <label
                              key={
                                candidatId
                              }
                              className={`${styles.candidatItem} ${
                                isSelected
                                  ? styles.candidatSelected
                                  : ""
                              }`}
                            >

                              {/* CHECKBOX */}

                              <input
                                type="checkbox"
                                checked={
                                  isSelected
                                }
                                onChange={() =>
                                  handleToggleCandidat(
                                    candidatId
                                  )
                                }
                              />

                              <span
                                className={
                                  styles.candidatCheckbox
                                }
                              >

                                {isSelected && (
                                  <FaCheck />
                                )}

                              </span>

                              {/* AVATAR */}

                              <span
                                className={
                                  styles.candidatAvatar
                                }
                              >
                                <FaUser />
                              </span>

                              {/* INFORMATIONS */}

                              <span
                                className={
                                  styles.candidatInfo
                                }
                              >

                                <strong>
                                  {nom}
                                </strong>

                                <span>
                                  {email ||
                                    "Email non renseigné"}
                                </span>

                                {cin && (

                                  <small>
                                    CIN : {cin}
                                  </small>

                                )}

                              </span>

                            </label>

                          );

                        }
                      )

                    )}

                  </div>

                )}

              </div>

              {/* ===================================================
                  MESSAGE ERREUR
              =================================================== */}

              {createError && (

                <div
                  className={
                    styles.modalError
                  }
                >

                  <FaExclamationCircle />

                  <span>
                    {createError}
                  </span>

                </div>

              )}

              {/* ===================================================
                  MESSAGE SUCCÈS
              =================================================== */}

              {createSuccess && (

                <div
                  className={
                    styles.modalSuccess
                  }
                >

                  <FaCheck />

                  <span>
                    {createSuccess}
                  </span>

                </div>

              )}

              {/* ===================================================
                  FOOTER
              =================================================== */}

              <div
                className={
                  styles.modalFooter
                }
              >

                <button
                  type="button"
                  className={
                    styles.cancelModalButton
                  }
                  onClick={
                    handleCloseCreateModal
                  }
                  disabled={creating}
                >

                  <FaTimes />

                  Fermer

                </button>

                <button
                  type={
                    createSuccess
                      ? "button"
                      : "submit"
                  }
                  className={
                    styles.confirmCreateButton
                  }
                  onClick={
                    createSuccess
                      ? () =>
                          navigate(
                            `/formateur/prequalification/${createdPrequalificationIds.join(",")}`
                          )
                      : undefined
                  }
                  disabled={
                    creating ||
                    loadingCandidats ||
                    loadingProgrammes ||
                    selectedCandidats.length ===
                      0
                  }
                >

                  {createSuccess ? (

                    <>

                      <FaQuestionCircle />

                      Créer les questions

                    </>

                  ) : creating ? (

                    <>

                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>

                      Création...

                    </>

                  ) : (

                    <>

                      <FaSave />

                      Créer le test pour{" "}

                      {
                        selectedCandidats.length
                      }

                      {" "}candidat
                      {selectedCandidats.length > 1
                        ? "s"
                        : ""}

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Formateur;