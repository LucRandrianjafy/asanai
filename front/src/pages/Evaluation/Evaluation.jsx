import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaGraduationCap,
  FaCalendarAlt,
  FaArrowRight,
  FaCheckCircle,
  FaLock,
  FaHourglassHalf,
  FaFileAlt,
} from "react-icons/fa";

import styles from "./Evaluation.module.css";

import RecrueSidebar from "../../pages/RecrueSidebar";
import Header from "../../component/Header/Header";

import { getCampusById } from "../../api/campus";
import { getTestNiveauByUserId } from "../../api/testNiveau";
import { getQuestionsByTestNiveauId } from "../../api/testNiveauQuestion";

const Evaluation = () => {
  const navigate = useNavigate();

  const [testsNiveau, setTestsNiveau] = useState([]);

  const [loadingTests, setLoadingTests] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [errorTests, setErrorTests] = useState("");

  const [completedTests, setCompletedTests] = useState([]);

  const [answeredTestIds, setAnsweredTestIds] = useState([]);

  /*
   * ============================================================
   * RÉCUPÉRATION DES TESTS TERMINÉS
   * ============================================================
   */
  useEffect(() => {
    try {
      const savedTests = localStorage.getItem("completedTests");

      if (savedTests) {
        setCompletedTests(JSON.parse(savedTests));
      }
    } catch (error) {
      console.error(
        "Erreur récupération des tests de niveau terminés :",
        error
      );
    }
  }, []);

  /*
   * ============================================================
   * RÉCUPÉRATION DES TESTS TECHNIQUES
   * ============================================================
   */
  useEffect(() => {
    const fetchTestsNiveau = async () => {
      try {
        setLoadingTests(true);
        setErrorTests("");

        const userData = localStorage.getItem("user");

        if (!userData) {
          setErrorTests("Utilisateur non connecté.");
          setTestsNiveau([]);
          return;
        }

        const user = JSON.parse(userData);

        const idUsers = user?.id ?? user?.userId ?? user?.idUser;

        if (!idUsers) {
          setErrorTests(
            "Impossible de récupérer l'identifiant de l'utilisateur."
          );

          setTestsNiveau([]);
          return;
        }

        const data = await getTestNiveauByUserId(idUsers);
        console.log(
          "Tests techniques récupérés :",
          data
        );

        /*
         * On récupère uniquement les tests techniques :
         * idTestType = 1
         */
        const formattedTests = Array.isArray(data)
          ? data
              .filter(
                (test) => Number(test.idTestType) === 1
              )
              .map((test) => ({
                id: test.id,

                idTestType: Number(test.idTestType),

                titre:
                  test.description ||
                  `Test technique #${test.id}`,

                description:
                  test.description ||
                  "Test permettant d'évaluer votre niveau technique.",

                dateDebut: test.startDate
                  ? test.startDate.substring(0, 10)
                  : null,

                dateFin: test.endDate
                  ? test.endDate.substring(0, 10)
                  : null,

                idCampus:
                  test.idCampus ??
                  test.id_campus ??
                  null,

                campusNom: null,
              }))
          : [];

        /*
         * ========================================================
         * RÉCUPÉRATION DES CAMPUS
         * ========================================================
         */

        const campusIds = [
          ...new Set(
            formattedTests
              .map((test) => test.idCampus)
              .filter(
                (campusId) =>
                  campusId !== null &&
                  campusId !== undefined
              )
          ),
        ];

        const campusEntries = await Promise.all(
          campusIds.map(async (campusId) => {
            try {
              const campus = await getCampusById(campusId);

              return [
                Number(campusId),
                campus?.nom ??
                  campus?.nomCampus ??
                  campus?.nom_campus ??
                  campus?.libelle ??
                  `Campus ${campusId}`,
              ];
            } catch (error) {
              console.error(
                `Erreur lors de la récupération du campus ${campusId} :`,
                error
              );

              return [
                Number(campusId),
                `Campus ${campusId}`,
              ];
            }
          })
        );

        const campusNames = Object.fromEntries(campusEntries);

        const testsWithCampus = formattedTests.map(
          (test) => ({
            ...test,

            campusNom: test.idCampus
              ? campusNames[Number(test.idCampus)]
              : null,
          })
        );

        const questionResults = await Promise.allSettled(
          testsWithCampus.map(async (test) => {
            const questions = await getQuestionsByTestNiveauId(test.id);

            return {
              id: test.id,
              hasAnswers:
                Array.isArray(questions) &&
                questions.some(
                  (question) =>
                    question.answerIdx !== null &&
                    question.answerIdx !== undefined
                ),
            };
          })
        );

        setAnsweredTestIds(
          questionResults
            .filter(
              (result) =>
                result.status === "fulfilled" &&
                result.value.hasAnswers
            )
            .map((result) => result.value.id)
        );

        setTestsNiveau(testsWithCampus);
      } catch (error) {
        console.error(
          "Erreur récupération des tests techniques :",
          error
        );

        setErrorTests(
          "Erreur lors de la récupération des tests techniques."
        );

        setTestsNiveau([]);
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTestsNiveau();
  }, []);

  /*
   * ============================================================
   * FORMATAGE DES DATES
   * ============================================================
   */

  const formatDate = (date) => {
    if (!date) {
      return "Non renseignée";
    }

    try {
      const parsedDate = new Date(
        `${date}T00:00:00`
      );

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString(
        "fr-FR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  /*
   * ============================================================
   * DATES DISPONIBILITÉ
   * ============================================================
   */

  const getToday = () => {
    const today = new Date();

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  };

  const convertDate = (date) => {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate;
  };

  const isAvailable = (item) => {
    const today = getToday();

    const startDate = convertDate(
      item.dateDebut
    );

    const endDate = convertDate(
      item.dateFin
    );

    if (!startDate || !endDate) {
      return false;
    }

    return (
      today >= startDate &&
      today <= endDate
    );
  };

  /*
   * ============================================================
   * STATUT DU TEST
   * ============================================================
   */

  const getStatus = (
    item,
    completed
  ) => {
    if (completed) {
      return {
        label: "Déjà passé",
        type: "completed",
        icon: <FaCheckCircle />,
      };
    }

    const today = getToday();

    const startDate = convertDate(
      item.dateDebut
    );

    const endDate = convertDate(
      item.dateFin
    );

    if (!startDate || !endDate) {
      return {
        label: "Indisponible",
        type: "disabled",
        icon: <FaLock />,
      };
    }

    if (today < startDate) {
      return {
        label: "Pas encore disponible",
        type: "waiting",
        icon: <FaHourglassHalf />,
      };
    }

    if (today > endDate) {
      return {
        label: "Période terminée",
        type: "expired",
        icon: <FaLock />,
      };
    }

    return {
      label: "Disponible",
      type: "available",
      icon: <FaCheckCircle />,
    };
  };

  /*
   * ============================================================
   * DÉMARRER LE TEST TECHNIQUE
   * ============================================================
   */

  const handleStart = async (item) => {
    if (!isAvailable(item)) {
      return;
    }

    try {
      setLoadingQuestions(true);
      setErrorTests("");

      console.log(
        "Récupération des questions :",
        item.id
      );

      const questions =
        await getQuestionsByTestNiveauId(
          item.id
        );

      console.log(
        "Questions récupérées :",
        questions
      );

      if (!Array.isArray(questions)) {
        throw new Error(
          "Les questions reçues ne sont pas dans un format valide."
        );
      }

      if (questions.length === 0) {
        setErrorTests(
          "Aucune question n'est disponible pour ce test technique."
        );

        return;
      }

      const alreadyAnswered = questions.some(
        (question) =>
          question.answerIdx !== null &&
          question.answerIdx !== undefined
      );

      if (alreadyAnswered) {
        setAnsweredTestIds((previous) =>
          previous.includes(item.id)
            ? previous
            : [...previous, item.id]
        );

        setErrorTests(
          "Ce test technique a déjà été passé et ne peut pas être recommencé."
        );

        return;
      }

      /*
       * Envoi des vraies questions à la page QCM
       */
      navigate(
        `/recrue/qcm/${item.id}`,
        {
          state: {
            questions: questions,
            testNiveau: item,
          },
        }
      );
    } catch (error) {
      console.error(
        "Erreur récupération des questions :",
        error
      );

      setErrorTests(
        error?.message ||
          "Erreur lors de la récupération des questions."
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  /*
   * ============================================================
   * VOIR LES RÉPONSES
   * ============================================================
   */

  const handleViewAnswers = (item) => {
    navigate(
      `/recrue/test-niveau/${item.id}/reponses`
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      className={`d-flex flex-column flex-lg-row ${styles.container}`}
    >
      <RecrueSidebar />

      <div className={styles.mainArea}>
        <Header
          title="Test technique"
          showSearch={false}
        />

        <div className={styles.content}>

          {/* ==================================================
              EN-TÊTE
              ================================================== */}

          <div className={styles.pageHeader}>
            <div className={styles.pageTitleIcon}>
              <FaGraduationCap />
            </div>

            <div>
              <h1>
                Mes tests techniques
              </h1>

              <p>
                Consultez et passez vos tests techniques disponibles.
              </p>
            </div>
          </div>

          {/* ==================================================
              LISTE DES TESTS
              ================================================== */}

          <div className={styles.evaluationList}>

            {loadingTests ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaHourglassHalf />
                </div>

                <h3>
                  Chargement...
                </h3>

                <p>
                  Récupération de vos tests techniques.
                </p>
              </div>
            ) : loadingQuestions ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaHourglassHalf />
                </div>

                <h3>
                  Chargement des questions...
                </h3>

                <p>
                  Récupération des questions réelles
                  du test technique.
                </p>
              </div>
            ) : errorTests ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaFileAlt />
                </div>

                <h3>
                  Erreur
                </h3>

                <p>
                  {errorTests}
                </p>
              </div>
            ) : testsNiveau.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaFileAlt />
                </div>

                <h3>
                  Aucun test technique
                </h3>

                <p>
                  Aucun test technique n'est disponible
                  pour le moment.
                </p>
              </div>
            ) : (
              testsNiveau.map((item) => {
                const completed = completedTests.includes(item.id);

                const alreadyAnswered = answeredTestIds.includes(item.id);

                const status =
                  getStatus(
                    item,
                    completed || alreadyAnswered
                  );

                const available =
                  isAvailable(item);

                return (
                  <div
                    className={
                      completed
                        ? `${styles.evaluationCard} ${styles.completedCard}`
                        : styles.evaluationCard
                    }
                    key={item.id}
                  >
                    {/* ==================================================
                        ICÔNE
                        ================================================== */}

                    <div className={styles.cardIcon}>
                      <FaGraduationCap />
                    </div>

                    <div className={styles.cardBody}>

                      {/* ================================================
                          HEADER CARD
                          ================================================ */}

                      <div
                        className={
                          styles.cardHeader
                        }
                      >
                        <div>
                          <h2>
                            {item.titre}
                          </h2>

                          <p>
                            {item.description}
                          </p>
                        </div>

                        <span
                          className={
                            `${styles.status} ${styles[status.type]}`
                          }
                        >
                          {status.icon}

                          {status.label}
                        </span>
                      </div>

                      {/* ================================================
                          INFORMATIONS
                          ================================================ */}

                      <div
                        className={
                          styles.dateContainer
                        }
                      >
                        <div
                          className={
                            styles.dateItem
                          }
                        >
                          <FaCalendarAlt />

                          <div>
                            <span>
                              Date de début
                            </span>

                            <strong>
                              {formatDate(
                                item.dateDebut
                              )}
                            </strong>
                          </div>
                        </div>

                        <div
                          className={
                            styles.dateSeparator
                          }
                        >
                          →
                        </div>

                        <div
                          className={
                            styles.dateItem
                          }
                        >
                          <FaCalendarAlt />

                          <div>
                            <span>
                              Date de fin
                            </span>

                            <strong>
                              {formatDate(
                                item.dateFin
                              )}
                            </strong>
                          </div>
                        </div>

                        <div
                          className={
                            styles.dateItem
                          }
                        >
                          <FaGraduationCap />

                          <div>
                            <span>
                              Campus
                            </span>

                            <strong>
                              {item.idCampus
                                ? item.campusNom ||
                                  `Campus ${item.idCampus}`
                                : "Campus non renseigné"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* ================================================
                          FOOTER
                          ================================================ */}

                      <div
                        className={
                          styles.cardFooter
                        }
                      >
                        {completed ? (
                          <button
                            type="button"
                            className={
                              styles.answerButton
                            }
                            onClick={() =>
                              handleViewAnswers(
                                item
                              )
                            }
                          >
                            <FaCheckCircle />

                            Voir mes réponses

                            <FaArrowRight />
                          </button>
                        ) : alreadyAnswered ? (
                          <button
                            type="button"
                            className={styles.disabledButton}
                            disabled
                          >
                            <FaCheckCircle />

                            Test technique déjà passé
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={
                              available
                                ? styles.startButton
                                : styles.disabledButton
                            }
                            disabled={
                              !available ||
                              loadingQuestions
                            }
                            onClick={() =>
                              handleStart(item)
                            }
                          >
                            {available ? (
                              <>
                                <FaGraduationCap />

                                Passer le test technique

                                <FaArrowRight />
                              </>
                            ) : (
                              <>
                                <FaLock />

                                Test technique indisponible
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;