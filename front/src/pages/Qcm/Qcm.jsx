import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";

import styles from "./Qcm.module.css";

import { updateAnswerIdx } from "../../api/testNiveauQuestion";
import RecrueSidebar from "../RecrueSidebar";

/* =========================================================
   NOMBRE D'INFRACTIONS TOLÉRÉES
========================================================= */

const MAX_VIOLATIONS = 3;

/* =========================================================
   QUESTIONS PAR DÉFAUT
   Utilisées uniquement si aucune question n'est reçue
   depuis Evaluation.jsx.
========================================================= */

const DEFAULT_QUESTIONS = [];

const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    console.error(
      "Erreur : les questions reçues ne sont pas un tableau :",
      questions
    );

    return [];
  }

  return questions.map((item, index) => {
    let options = [];

    /* -------------------------------------------------------
       Cas API : answers = "A;B;C;D"
    ------------------------------------------------------- */

    if (typeof item.answers === "string") {
      options = item.answers
        .split(";")
        .map((answer) => answer.trim())
        .filter((answer) => answer !== "");
    }

    /* -------------------------------------------------------
       Cas où answers serait déjà un tableau
    ------------------------------------------------------- */

    else if (Array.isArray(item.answers)) {
      options = item.answers;
    }

    /* -------------------------------------------------------
       Compatibilité avec l'ancien format options
    ------------------------------------------------------- */

    else if (Array.isArray(item.options)) {
      options = item.options;
    }

    return {
      id: item.id ?? index + 1,

      question: item.question ?? "",

      options,

      correctAnswerIdx:
        item.correctAnswerIdx !== undefined &&
        item.correctAnswerIdx !== null
          ? Number(item.correctAnswerIdx)
          : item.reponse !== undefined && item.reponse !== null
          ? Number(item.reponse)
          : null,

      points:
        item.points !== undefined && item.points !== null
          ? Number(item.points)
          : 1,

      dureeMinutes:
        item.dureeMinutes !== undefined && item.dureeMinutes !== null
          ? Number(item.dureeMinutes)
          : 0,
    };
  });
};

/* =========================================================
   COMPOSANT QCM
========================================================= */

const Qcm = ({
  questions: questionsFromProps = DEFAULT_QUESTIONS,
  onFinish,
  onFail,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(location.state?.questions) || location.state.questions.length === 0) {
      navigate("/recrue/evaluation", { replace: true });
    }
  }, [location.state, navigate]);

  /* =========================================================
     QUESTIONS VENANT DE Evaluation.jsx
  ========================================================= */

  const questionsFromNavigation =
    location.state?.questions || [];

  const testNiveau =
    location.state?.testNiveau || null;

  /* =========================================================
     QUESTIONS FINALES
  ========================================================= */

  const initialQuestions =
    questionsFromNavigation.length > 0
      ? questionsFromNavigation
      : questionsFromProps;

  const [questions, setQuestions] = useState(() =>
    normalizeQuestions(initialQuestions)
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(0);

  const [violations, setViolations] = useState(0);

  const [warning, setWarning] = useState("");

  const [examStatus, setExamStatus] = useState("running");
  // running | finished | failed

  const [score, setScore] = useState(null);

  const timerRef = useRef(null);

  const warningTimeoutRef = useRef(null);

  /* =========================================================
     MISE À JOUR DES QUESTIONS
  ========================================================= */

  useEffect(() => {
    const sourceQuestions =
      questionsFromNavigation.length > 0
        ? questionsFromNavigation
        : questionsFromProps;

    const normalized = normalizeQuestions(sourceQuestions);

    console.log(
      "Questions utilisées par le QCM :",
      normalized
    );

    if (testNiveau) {
      console.log(
        "Test de niveau utilisé :",
        testNiveau
      );
    }

    setQuestions(normalized);

    setCurrentIndex(0);
    setAnswers({});
  }, [
    questionsFromNavigation.length,
    questionsFromProps,
    testNiveau,
  ]);

  /* =========================================================
     QUESTION COURANTE
  ========================================================= */

  const currentQuestion =
    questions[currentIndex];

  const isLastQuestion =
    questions.length > 0 &&
    currentIndex === questions.length - 1;

  const hasAnswered =
    currentQuestion &&
    answers[currentQuestion.id] !== undefined;

  /* =========================================================
     DURÉE DE LA QUESTION
  ========================================================= */

  const getQuestionDuration = useCallback(
    (question) => {
      if (
        question &&
        question.dureeMinutes !== undefined &&
        question.dureeMinutes !== null &&
        Number(question.dureeMinutes) > 0
      ) {
        return Number(question.dureeMinutes) * 60;
      }

      /*
       * Si dureeMinutes n'est pas renseigné,
       * on utilise 30 secondes par défaut.
       */
      return 30;
    },
    []
  );

  /* =========================================================
     CALCUL DU SCORE
  ========================================================= */

  const calculateScore = useCallback(() => {
    let totalPoints = 0;
    let obtainedPoints = 0;

    questions.forEach((question) => {
      const questionPoints =
        Number(question.points) || 1;

      totalPoints += questionPoints;

      const selectedAnswer =
        answers[question.id];

      const correctAnswer =
        question.correctAnswerIdx;

      if (
        selectedAnswer !== undefined &&
        correctAnswer !== null &&
        Number(selectedAnswer) === Number(correctAnswer)
      ) {
        obtainedPoints += questionPoints;
      }
    });

    return {
      obtainedPoints,
      totalPoints,
      percentage:
        totalPoints > 0
          ? Math.round(
              (obtainedPoints / totalPoints) * 100
            )
          : 0,
    };
  }, [answers, questions]);

  /* =========================================================
     GESTION DES INFRACTIONS
  ========================================================= */

  const reportViolation = useCallback(
    (message) => {
      if (examStatus !== "running") {
        return;
      }

      console.warn(
        "Infraction détectée :",
        message
      );

      setWarning(message);

      clearTimeout(
        warningTimeoutRef.current
      );

      warningTimeoutRef.current =
        setTimeout(() => {
          setWarning("");
        }, 4000);

      setViolations((prev) => {
        const next = prev + 1;

        console.warn(
          `Nombre d'infractions : ${next}/${MAX_VIOLATIONS}`
        );

        if (next >= MAX_VIOLATIONS) {
          setExamStatus("failed");

          clearInterval(timerRef.current);

          if (typeof onFail === "function") {
            onFail(
              "Comportement suspect détecté à plusieurs reprises."
            );
          }
        }

        return next;
      });
    },
    [examStatus, onFail]
  );

  /* =========================================================
     DÉTECTION DE FRAUDE
  ========================================================= */

  useEffect(() => {
    if (examStatus !== "running") {
      return;
    }

    /* -------------------------------------------------------
       Changement d'onglet
    ------------------------------------------------------- */

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation(
          "Changement d'onglet détecté. Restez sur la page de l'examen."
        );
      }
    };

    /* -------------------------------------------------------
       Perte de focus
    ------------------------------------------------------- */

    const handleBlur = () => {
      reportViolation(
        "Perte de focus de la fenêtre détectée."
      );
    };

    /* -------------------------------------------------------
       Copier / coller / clic droit
    ------------------------------------------------------- */

    const preventAction = (e) => {
      e.preventDefault();

      reportViolation(
        "Action non autorisée détectée (copier/coller/clic droit)."
      );
    };

    /* -------------------------------------------------------
       Raccourcis clavier
    ------------------------------------------------------- */

    const handleKeyDown = (e) => {
      const key = e.key;

      const blockedCombo =
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "u", "s", "p"].includes(
          key.toLowerCase()
        );

      const isPrintScreen =
        key === "PrintScreen";

      const isDevTools =
        key === "F12" ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ["I", "J", "C"].includes(key));

      if (isPrintScreen) {
        navigator.clipboard
          ?.writeText("")
          .catch((error) => {
            console.error(
              "Erreur lors de la tentative de nettoyage du presse-papier :",
              error
            );
          });

        reportViolation(
          "Tentative de capture d'écran détectée."
        );

        return;
      }

      if (
        blockedCombo ||
        isDevTools
      ) {
        e.preventDefault();

        reportViolation(
          "Raccourci clavier non autorisé détecté."
        );
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "blur",
      handleBlur
    );

    document.addEventListener(
      "copy",
      preventAction
    );

    document.addEventListener(
      "paste",
      preventAction
    );

    document.addEventListener(
      "cut",
      preventAction
    );

    document.addEventListener(
      "contextmenu",
      preventAction
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "blur",
        handleBlur
      );

      document.removeEventListener(
        "copy",
        preventAction
      );

      document.removeEventListener(
        "paste",
        preventAction
      );

      document.removeEventListener(
        "cut",
        preventAction
      );

      document.removeEventListener(
        "contextmenu",
        preventAction
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    examStatus,
    reportViolation,
  ]);

  /* =========================================================
     BLOCAGE DU RETOUR ARRIÈRE
  ========================================================= */

  useEffect(() => {
    if (examStatus !== "running") {
      return;
    }

    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handlePopState = () => {
      window.history.pushState(
        null,
        "",
        window.location.href
      );

      reportViolation(
        "Tentative de retour en arrière détectée."
      );
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [
    examStatus,
    reportViolation,
  ]);

  /* =========================================================
     TERMINER LE QCM
  ========================================================= */

  const finishExam = useCallback(() => {
    if (examStatus !== "running") {
      return;
    }

    clearInterval(timerRef.current);

    const result = calculateScore();

    console.log(
      "Résultat du test de niveau :",
      result
    );

    console.log(
      "Réponses données :",
      answers
    );

    setScore(result);

    setExamStatus("finished");

    if (typeof onFinish === "function") {
      onFinish({
        answers,
        violations,
        score: result,
        questions,
        testNiveau,
      });
    }
  }, [
    examStatus,
    calculateScore,
    answers,
    violations,
    questions,
    testNiveau,
    onFinish,
  ]);

  /* =========================================================
     PASSER À LA QUESTION SUIVANTE
  ========================================================= */

  const goToNext = useCallback(() => {
    if (!currentQuestion) {
      console.error(
        "Impossible de passer à la question suivante : aucune question courante."
      );

      return;
    }

    if (!hasAnswered) {
      return;
    }

    if (isLastQuestion) {
      finishExam();
      return;
    }

    setCurrentIndex(
      (prev) => prev + 1
    );
  }, [
    currentQuestion,
    hasAnswered,
    isLastQuestion,
    finishExam,
  ]);

  /* =========================================================
     MINUTEUR PAR QUESTION
  ========================================================= */

  useEffect(() => {
    if (
      examStatus !== "running" ||
      !currentQuestion
    ) {
      return;
    }

    const duration =
      getQuestionDuration(
        currentQuestion
      );

    console.log(
      `Question ${currentIndex + 1} : durée = ${duration} secondes`
    );

    setTimeLeft(duration);

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(
            timerRef.current
          );

          /*
           * Si la question n'a pas reçu de réponse,
           * on passe automatiquement à la suivante.
           */
          if (isLastQuestion) {
            finishExam();
          } else {
            setCurrentIndex(
              (previousIndex) =>
                previousIndex + 1
            );
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [
    currentIndex,
    examStatus,
    currentQuestion,
    getQuestionDuration,
    isLastQuestion,
    finishExam,
  ]);

  /* =========================================================
     NETTOYAGE
  ========================================================= */

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      clearTimeout(
        warningTimeoutRef.current
      );
    };
  }, []);

  /* =========================================================
     SÉLECTION D'UNE RÉPONSE
  ========================================================= */

  const handleSelectOption = async (optionIndex) => {
    if (
      examStatus !== "running" ||
      !currentQuestion
    ) {
      return;
    }

    try {
      // Mise à jour locale
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionIndex,
      }));

      // Mise à jour en base PostgreSQL
      await updateAnswerIdx(
        currentQuestion.id,
        optionIndex
      );

      console.log(
        "Réponse enregistrée :",
        {
          questionId: currentQuestion.id,
          answerIdx: optionIndex,
        }
      );

    } catch (error) {

      console.error(
        "Erreur lors de l'enregistrement de la réponse :",
        error
      );

      console.error(
        "Stack trace :",
        error?.stack
      );
    }
  };

  /* =========================================================
     SI AUCUNE QUESTION
  ========================================================= */

  if (questions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.endScreen}>
          <div
            className={`${styles.endIcon} ${styles.failIcon}`}
          >
            <FaExclamationTriangle />
          </div>

          <h2>
            Aucune question disponible
          </h2>

          <p>
            Impossible de démarrer le test :
            aucune question n'a été récupérée
            pour ce test de niveau.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ÉTAT : ÉCHEC
  ========================================================= */

  if (examStatus === "failed") {
    return (
      <div className={styles.container}>
        <div className={styles.endScreen}>
          <div
            className={`${styles.endIcon} ${styles.failIcon}`}
          >
            <FaExclamationTriangle />
          </div>

          <h2>
            Examen interrompu
          </h2>

          <p>
            Votre examen a été automatiquement
            échoué suite à la détection répétée
            de comportements non autorisés
            ({violations}/{MAX_VIOLATIONS}{" "}
            infractions).
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ÉTAT : TERMINÉ
  ========================================================= */

  if (examStatus === "finished") {
    return (
      <div className={`d-flex flex-column flex-lg-row ${styles.container}`}>
        <RecrueSidebar />

        <div className={styles.endScreen}>
          <div
            className={`${styles.endIcon} ${styles.successIcon}`}
          >
            <FaCheckCircle />
          </div>

          <h2>
            Examen terminé
          </h2>

          <p>
            Vos réponses ont été
            enregistrées avec succès.
          </p>

          {score && (
            <div className="mt-3">
              <h4>
                Résultat
              </h4>

              <p>
                {score.obtainedPoints} /{" "}
                {score.totalPoints} points
              </p>

              <p>
                Score : {score.percentage}%
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER : EXAMEN EN COURS
  ========================================================= */

  return (
    <div
      className={styles.container}
      onDragStart={(e) =>
        e.preventDefault()
      }
    >
      {/* =====================================================
          BARRE SUPÉRIEURE
      ===================================================== */}

      <div className={styles.topBar}>
        <div className={styles.examTitle}>
          <FaShieldAlt />

          <span>
            Examen QCM — Session surveillée
          </span>
        </div>

        <div className={styles.timer}>
          <FaClock />

          <span>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* =====================================================
          MESSAGE D'AVERTISSEMENT
      ===================================================== */}

      {warning && (
        <div
          className={styles.warningBanner}
        >
          <FaExclamationTriangle />

          <span>
            {warning} (
            {violations}/
            {MAX_VIOLATIONS})
          </span>
        </div>
      )}

      {/* =====================================================
          CONTENU
      ===================================================== */}

      <div className={styles.content}>
        {/* ---------------------------------------------------
            PROGRESSION
        --------------------------------------------------- */}

        <div className={styles.progress}>
          Question {currentIndex + 1} /{" "}
          {questions.length}
        </div>

        {/* ---------------------------------------------------
            CARTE QUESTION
        --------------------------------------------------- */}

        <section className={styles.card}>
          <h3
            className={
              styles.questionText
            }
          >
            {currentQuestion.question}
          </h3>

          {/* -------------------------------------------------
              RÉPONSES
          ------------------------------------------------- */}

          <div
            className={
              styles.optionsList
            }
          >
            {currentQuestion.options.map(
              (option, index) => {
                const isSelected =
                  answers[
                    currentQuestion.id
                  ] === index;

                return (
                  <button
                    key={index}
                    type="button"
                    className={`${
                      styles.optionItem
                    } ${
                      isSelected
                        ? styles.optionSelected
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectOption(
                        index
                      )
                    }
                  >
                    <span
                      className={
                        styles.optionBullet
                      }
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span>
                      {option}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* -------------------------------------------------
              ACTIONS
          ------------------------------------------------- */}

          <div
            className={
              styles.actions
            }
          >
            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={goToNext}
              disabled={!hasAnswered}
            >
              {isLastQuestion
                ? "Terminer"
                : "Suivant"}

              <FaArrowRight />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Qcm;