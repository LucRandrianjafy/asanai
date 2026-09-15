import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaClipboardCheck,
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

  const [activeTab, setActiveTab] = useState("niveau");

  const [evaluations, setEvaluations] = useState([]);

  const [testsNiveau, setTestsNiveau] = useState([]);

  const [loadingTests, setLoadingTests] = useState(false);

  const [errorTests, setErrorTests] = useState("");

  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [completedEvaluations, setCompletedEvaluations] =
    useState([]);

  const [completedTests, setCompletedTests] =
    useState([]);

  useEffect(() => {
    try {
      const savedEvaluations =
        localStorage.getItem("completedEvaluations");

      const savedTests =
        localStorage.getItem("completedTests");

      if (savedEvaluations) {
        setCompletedEvaluations(
          JSON.parse(savedEvaluations)
        );
      }

      if (savedTests) {
        setCompletedTests(
          JSON.parse(savedTests)
        );
      }
    } catch (error) {
      console.error(
        "Erreur récupération tests de niveau terminés :",
        error
      );
    }
  }, []);

  useEffect(() => {
    const fetchTestsNiveau = async () => {
      try {
        setLoadingTests(true);
        setErrorTests("");

        const userData = localStorage.getItem("user");

        if (!userData) {
          setErrorTests(
            "Utilisateur non connecté."
          );

          setEvaluations([]);
          setTestsNiveau([]);

          return;
        }

        const user = JSON.parse(userData);

        const idUsers = user?.id;

        if (!idUsers) {
          setErrorTests(
            "Impossible de récupérer l'identifiant de l'utilisateur."
          );

          setEvaluations([]);
          setTestsNiveau([]);

          return;
        }

        const data =
          await getTestNiveauByUserId(idUsers);

        const formattedTests = Array.isArray(data)
          ? data.map((test) => ({
              id: test.id,
              idTestType: Number(test.idTestType),

              titre:
                test.description ||
                `Test technique #${test.id}`,

              description:
                test.description ||
                "Test permettant d'évaluer votre niveau.",

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

        const campusIds = [
          ...new Set(
            formattedTests
              .map((test) => test.idCampus)
              .filter((campusId) => campusId !== null && campusId !== undefined)
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

              return [Number(campusId), `Campus ${campusId}`];
            }
          })
        );

        const campusNames = Object.fromEntries(campusEntries);

        const testsWithCampus = formattedTests.map((test) => ({
          ...test,
          campusNom: test.idCampus
            ? campusNames[Number(test.idCampus)]
            : null,
        }));

        setEvaluations(
          testsWithCampus.filter(
            (test) => test.idTestType === 2
          )
        );

        setTestsNiveau(
          testsWithCampus.filter(
            (test) => test.idTestType === 1
          )
        );
      } catch (error) {
        console.error(
          "Erreur récupération des tests techniques :",
          error
        );

        setErrorTests(
          "Erreur lors de la récupération des tests techniques."
        );

        setEvaluations([]);
        setTestsNiveau([]);
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTestsNiveau();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "Non renseignée";
    }

    try {
      const parsedDate = new Date(
        `${date}T00:00:00`
      );

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
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

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return null;
    }

    return parsedDate;
  };

  const isAvailable = (item) => {
    const today = getToday();

    const startDate =
      convertDate(item.dateDebut);

    const endDate =
      convertDate(item.dateFin);

    if (!startDate || !endDate) {
      return false;
    }

    return (
      today >= startDate &&
      today <= endDate
    );
  };

  const getStatus = (
    item,
    completed
  ) => {
    if (completed) {
      return {
        label: "Déjà passée",
        type: "completed",
        icon: <FaCheckCircle />,
      };
    }

    const today = getToday();

    const startDate =
      convertDate(item.dateDebut);

    const endDate =
      convertDate(item.dateFin);

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
   * DEMARRER UNE EVALUATION / UN TEST DE NIVEAU
   * ============================================================
   */
  const handleStart = async (item) => {
    if (!isAvailable(item)) {
      return;
    }

    /*
     * Les évaluations et les tests de niveau utilisent
     * les questions réelles avant d'ouvrir le QCM.
     */
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

      /*
       * Vérification de la réponse de l'API.
       */
      if (!Array.isArray(questions)) {
        throw new Error(
          "Les questions reçues ne sont pas dans un format valide."
        );
      }

      if (questions.length === 0) {
        setErrorTests(
          "Aucune question n'est disponible pour cet élément."
        );

        return;
      }

      /*
       * On transmet les vraies questions à la page QCM.
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

  const handleViewAnswers = (item) => {
    if (activeTab === "evaluation") {
      navigate(
        `/recrue/evaluation/${item.id}/reponses`
      );
    } else {
      navigate(
        `/recrue/test-niveau/${item.id}/reponses`
      );
    }
  };

  const currentList =
    activeTab === "evaluation"
      ? evaluations
      : testsNiveau;

  return (
    <div
      className={`d-flex flex-column flex-lg-row ${styles.container}`}
    >
      <RecrueSidebar />

      <div className={styles.mainArea}>
        <Header
          title="Evaluation"
          showSearch={false}
        />

        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.pageTitleIcon}>
              {activeTab === "evaluation" ? (
                <FaClipboardCheck />
              ) : (
                <FaGraduationCap />
              )}
            </div>

            <div>
              <h1>
                {activeTab === "evaluation"
                  ? "Mes évaluations"
                  : "Mes tests techniques"}
              </h1>

              <p>
                {activeTab === "evaluation"
                  ? "Consultez et passez vos évaluations disponibles."
                  : "Consultez et passez vos tests techniques disponibles."}
              </p>
            </div>
          </div>

          <div className={styles.tabs}>
            <button
              type="button"
              className={
                activeTab === "niveau"
                  ? `${styles.tabButton} ${styles.active}`
                  : styles.tabButton
              }
              onClick={() =>
                setActiveTab("niveau")
              }
            >
              <FaGraduationCap />

              <span>
                Test technique
              </span>
            </button>

            <button
              type="button"
              className={
                activeTab === "evaluation"
                  ? `${styles.tabButton} ${styles.active}`
                  : styles.tabButton
              }
              onClick={() =>
                setActiveTab("evaluation")
              }
            >
              <FaClipboardCheck />

              <span>
                Évaluations
              </span>
            </button>
          </div>

          <div className={styles.evaluationList}>
            {activeTab === "niveau" &&
            loadingTests ? (
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
            ) : currentList.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaFileAlt />
                </div>

                <h3>
                  {activeTab === "evaluation"
                    ? "Aucune évaluation"
                    : "Aucun test technique"}
                </h3>

                <p>
                  {activeTab === "evaluation"
                    ? "Aucune évaluation n'est disponible pour le moment."
                    : "Aucun test technique n'est disponible pour le moment."}
                </p>
              </div>
            ) : (
              currentList.map((item) => {
                const completed =
                  activeTab === "evaluation"
                    ? completedEvaluations.includes(
                        item.id
                      )
                    : completedTests.includes(
                        item.id
                      );

                const status =
                  getStatus(
                    item,
                    completed
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
                    <div className={styles.cardIcon}>
                      {activeTab === "evaluation" ? (
                        <FaClipboardCheck />
                      ) : (
                        <FaGraduationCap />
                      )}
                    </div>

                    <div className={styles.cardBody}>
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
                                ? item.campusNom || `Campus ${item.idCampus}`
                                : "Campus non renseigné"}
                            </strong>
                          </div>
                        </div>
                      </div>

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
                                {activeTab === "evaluation" ? (
                                  <FaClipboardCheck />
                                ) : (
                                  <FaGraduationCap />
                                )}

                                {activeTab === "evaluation"
                                  ? "Passer l'évaluation"
                                  : "Passer le test technique"}

                                <FaArrowRight />
                              </>
                            ) : (
                              <>
                                <FaLock />

                                {activeTab === "evaluation"
                                  ? "Évaluation indisponible"
                                  : "Test technique indisponible"}
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