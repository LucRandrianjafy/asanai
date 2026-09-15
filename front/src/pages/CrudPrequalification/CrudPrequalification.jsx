import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaQuestionCircle,
  FaListOl,
  FaArrowLeft,
} from "react-icons/fa";

import styles from "./CrudPrequalification.module.css";

import FormateurSidebar from "../../pages/FormateurSidebar";
import Header from "../../component/Header/Header";

import {
  getQuestionsByTestNiveauId,
  createTestNiveauQuestion,
  updateTestNiveauQuestion,
  deleteTestNiveauQuestion,
} from "../../api/testNiveauQuestion";


/* =========================================================
   COMPOSANT
========================================================= */

const CrudPrequalification = () => {
  const navigate = useNavigate();
  const { prequalificationId } = useParams();

  const prequalificationIds = prequalificationId
    ? prequalificationId
        .split(",")
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id))
    : [];

  const isMultipleMode = prequalificationIds.length > 1;


  console.log(
    "IDs des tests :",
    prequalificationIds
  );

  console.log(
    "Mode multiple :",
    isMultipleMode
  );


  /* =========================================================
     QCM
  ========================================================= */

  const [qcm, setQcm] = useState({
    id: prequalificationId,
    titre: "Préqualification",
    description:
      "Évaluation générale des connaissances.",
    statut: "Actif",
    questions: [],
  });


  /* =========================================================
     CHARGEMENT
  ========================================================= */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================================================
     ACTION
  ========================================================= */

  const [saving, setSaving] = useState(false);


  /* =========================================================
     MODIFICATION
  ========================================================= */

  const [editingQuestionId, setEditingQuestionId] =
    useState(null);

  const [editingQuestion, setEditingQuestion] =
    useState(null);


  /* =========================================================
     RÉCUPÉRER LES QUESTIONS
     
     IMPORTANT :
     
     - 1 seul test => GET BDD
     - plusieurs tests => AUCUN GET
  ========================================================= */

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!prequalificationId) {
        setError(
          "ID de la préqualification introuvable."
        );

        setLoading(false);

        return;
      }


      /* =====================================================
         MODE CRÉATION MULTIPLE
         
         Aucun accès aux questions de la BDD.
      ===================================================== */

      if (isMultipleMode) {
        console.log(
          "Mode création multiple : aucun GET des questions."
        );

        setLoading(false);
        setError("");

        setQcm((prev) => ({
          ...prev,

          id: prequalificationIds.join(","),

          questions: [],
        }));

        return;
      }


      /* =====================================================
         MODE NORMAL : UN SEUL TEST
      ===================================================== */

      try {
        setLoading(true);
        setError("");

        console.log(
          "Chargement des questions du test :",
          prequalificationIds[0]
        );

        const data =
          await getQuestionsByTestNiveauId(
            prequalificationIds[0]
          );

        console.log(
          "Questions récupérées depuis l'API :",
          data
        );

        const questions =
          Array.isArray(data)
            ? data
            : [];

        setQcm((prev) => ({
          ...prev,

          id: prequalificationIds[0],

          questions:
            questions.map(
              (question) => ({
                ...question,

                id:
                  question.id ??
                  question.idTestNiveauQuestion,

                question:
                  question.question ??
                  "",

                answers:
                  typeof question.answers ===
                  "string"
                    ? question.answers
                        .split(";")
                        .map(
                          (answer) =>
                            answer.trim()
                        )
                        .filter(Boolean)
                    : Array.isArray(
                        question.answers
                      )
                      ? question.answers
                      : [],

                correctAnswerIdx:
                  Number(
                    question.correctAnswerIdx ??
                      0
                  ),

                points:
                  Number(
                    question.points ??
                      question.note ??
                      0
                  ),

                dureeMinutes:
                  Number(
                    question.dureeMinutes ??
                      question.duree ??
                      question.temps ??
                      0
                  ),
              })
            ),
        }));
      } catch (err) {
        console.error(
          "Erreur lors du chargement des questions :",
          err
        );

        setError(
          err.message ||
            "Impossible de récupérer les questions du test."
        );

        setQcm((prev) => ({
          ...prev,

          questions: [],
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

  }, [prequalificationId]);


  /* =========================================================
     STATISTIQUES
  ========================================================= */

  const getTotalPoints = () => {
    return qcm.questions.reduce(
      (total, question) =>
        total +
        Number(question.points || 0),
      0
    );
  };


  const getTotalDuration = () => {
    return qcm.questions.reduce(
      (total, question) =>
        total +
        Number(
          question.dureeMinutes || 0
        ),
      0
    );
  };


  /* =========================================================
     RETOUR
  ========================================================= */

  const handleBack = () => {
    navigate("/formateur/overview");
  };


  /* =========================================================
     MODIFIER UNE QUESTION
  ========================================================= */

  const handleEditQuestion = (question) => {
    setEditingQuestionId(
      question.id
    );

    setEditingQuestion({
      ...question,

      answers: [
        ...question.answers,
      ],
    });
  };


  /* =========================================================
     ANNULER MODIFICATION
  ========================================================= */

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };


  /* =========================================================
     MODIFIER LE TEXTE QUESTION
  ========================================================= */

  const handleQuestionChange = (
    value
  ) => {
    setEditingQuestion((prev) => ({
      ...prev,

      question: value,
    }));
  };


  /* =========================================================
     MODIFIER UNE RÉPONSE
  ========================================================= */

  const handleAnswerChange = (
    index,
    value
  ) => {
    setEditingQuestion((prev) => {
      const answers = [
        ...prev.answers,
      ];

      answers[index] = value;

      return {
        ...prev,

        answers,
      };
    });
  };


  /* =========================================================
     MODIFIER LA BONNE RÉPONSE
  ========================================================= */

  const handleCorrectAnswerChange = (
    index
  ) => {
    setEditingQuestion((prev) => ({
      ...prev,

      correctAnswerIdx: index,
    }));
  };


  /* =========================================================
     MODIFIER LES POINTS
  ========================================================= */

  const handlePointsChange = (
    value
  ) => {
    setEditingQuestion((prev) => ({
      ...prev,

      points: value,
    }));
  };


  /* =========================================================
     MODIFIER LE TEMPS
  ========================================================= */

  const handleDurationChange = (
    value
  ) => {
    setEditingQuestion((prev) => ({
      ...prev,

      dureeMinutes: value,
    }));
  };


  /* =========================================================
     CONSTRUIRE LE PAYLOAD API
     
     idTestNiveau est fourni au moment de l'enregistrement.
  ========================================================= */

  const buildQuestionPayload = (
    question,
    idTestNiveau
  ) => {
    return {
      question:
        question.question?.trim() ||
        "",

      answers:
        Array.isArray(
          question.answers
        )
          ? question.answers
              .map((answer) =>
                answer.trim()
              )
              .join(";")
          : question.answers || "",

      correctAnswerIdx:
        Number(
          question.correctAnswerIdx
        ) || 0,

      /*
       * Réponse donnée par le candidat.
       *
       * Pour l'administration,
       * on ne la modifie pas.
       */

      answerIdx:
        question.answerIdx ??
        null,

      points:
        Number(
          question.points
        ) || 0,

      dureeMinutes:
        Number(
          question.dureeMinutes
        ) || 0,

      idTestNiveau:
        Number(idTestNiveau),

      idCategorieQuestion:
        question.idCategorieQuestion
          ? Number(
              question.idCategorieQuestion
            )
          : null,
    };
  };


  /* =========================================================
     SAUVEGARDER QUESTION EXISTANTE
     
     Utilisé uniquement en mode normal.
  ========================================================= */

  const handleSaveQuestion = async () => {
    if (!editingQuestion) {
      return;
    }

    if (saving) {
      return;
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      !editingQuestion.question ||
      !editingQuestion.question.trim()
    ) {
      alert(
        "Veuillez saisir une question."
      );

      return;
    }


    if (
      !editingQuestion.answers ||
      editingQuestion.answers.length === 0
    ) {
      alert(
        "Veuillez saisir au moins une réponse."
      );

      return;
    }


    const emptyAnswer =
      editingQuestion.answers.some(
        (answer) =>
          !answer ||
          !answer.trim()
      );


    if (emptyAnswer) {
      alert(
        "Toutes les réponses doivent être renseignées."
      );

      return;
    }


    const correctAnswerIdx =
      Number(
        editingQuestion.correctAnswerIdx
      );


    if (
      Number.isNaN(
        correctAnswerIdx
      ) ||
      correctAnswerIdx < 0 ||
      correctAnswerIdx >=
        editingQuestion.answers.length
    ) {
      alert(
        "Veuillez sélectionner une bonne réponse."
      );

      return;
    }


    try {
      setSaving(true);
      setError("");

      const payload =
        buildQuestionPayload(
          editingQuestion,
          prequalificationIds[0]
        );


      console.log(
        "Modification question :",
        editingQuestion.id
      );

      console.log(
        "Payload UPDATE :",
        payload
      );


      await updateTestNiveauQuestion(
        editingQuestion.id,
        payload
      );


      /* =================================================
         MISE À JOUR LOCALE
      ================================================= */

      setQcm((prevQcm) => ({
        ...prevQcm,

        questions:
          prevQcm.questions.map(
            (question) =>
              question.id ===
              editingQuestion.id
                ? {
                    ...editingQuestion,

                    points:
                      Number(
                        editingQuestion.points
                      ) || 0,

                    dureeMinutes:
                      Number(
                        editingQuestion.dureeMinutes
                      ) || 0,
                  }
                : question
          ),
      }));


      handleCancelEdit();


      alert(
        "Question modifiée avec succès."
      );

    } catch (err) {
      console.error(
        "Erreur lors de la modification :",
        err
      );

      alert(
        err.message ||
          "Erreur lors de la modification de la question."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     CRÉER UNE NOUVELLE QUESTION
     
     MODE NORMAL UNIQUEMENT
     
     Ici la question est immédiatement créée en BDD.
  ========================================================= */

  const handleSaveNewQuestion =
    async () => {
      if (
        !editingQuestion ||
        saving
      ) {
        return;
      }


      /* =====================================================
         VALIDATION
      ===================================================== */

      if (
        !editingQuestion.question ||
        !editingQuestion.question.trim()
      ) {
        alert(
          "Veuillez saisir une question."
        );

        return;
      }


      if (
        !editingQuestion.answers ||
        editingQuestion.answers.length === 0
      ) {
        alert(
          "Veuillez saisir au moins une réponse."
        );

        return;
      }


      const emptyAnswer =
        editingQuestion.answers.some(
          (answer) =>
            !answer ||
            !answer.trim()
        );


      if (emptyAnswer) {
        alert(
          "Toutes les réponses doivent être renseignées."
        );

        return;
      }


      const correctAnswerIdx =
        Number(
          editingQuestion.correctAnswerIdx
        );


      if (
        Number.isNaN(
          correctAnswerIdx
        ) ||
        correctAnswerIdx < 0 ||
        correctAnswerIdx >=
          editingQuestion.answers.length
      ) {
        alert(
          "Veuillez sélectionner une bonne réponse."
        );

        return;
      }


      try {
        setSaving(true);
        setError("");


        const payload =
          buildQuestionPayload(
            editingQuestion,
            prequalificationIds[0]
          );


        console.log(
          "Création question :",
          payload
        );


        await createTestNiveauQuestion(
          payload
        );


        /* =================================================
           RECHARGEMENT EN MODE NORMAL
        ================================================= */

        const data =
          await getQuestionsByTestNiveauId(
            prequalificationIds[0]
          );


        const questions =
          Array.isArray(data)
            ? data
            : [];


        setQcm((prev) => ({
          ...prev,

          questions:
            questions.map(
              (question) => ({
                ...question,

                id:
                  question.id ??
                  question.idTestNiveauQuestion,

                question:
                  question.question ??
                  "",

                answers:
                  typeof question.answers ===
                  "string"
                    ? question.answers
                        .split(";")
                        .map(
                          (answer) =>
                            answer.trim()
                        )
                        .filter(Boolean)
                    : Array.isArray(
                        question.answers
                      )
                      ? question.answers
                      : [],

                correctAnswerIdx:
                  Number(
                    question.correctAnswerIdx ??
                      0
                  ),

                points:
                  Number(
                    question.points ??
                      question.note ??
                      0
                  ),

                dureeMinutes:
                  Number(
                    question.dureeMinutes ??
                      question.duree ??
                      question.temps ??
                      0
                  ),
              })
            ),
        }));


        handleCancelEdit();


        alert(
          "Question créée avec succès."
        );

      } catch (err) {
        console.error(
          "Erreur lors de la création :",
          err
        );


        /* =================================================
           SUPPRIMER LA QUESTION TEMPORAIRE
           SI LA CRÉATION ÉCHOUE
        ================================================= */

        setQcm((prev) => ({
          ...prev,

          questions:
            prev.questions.filter(
              (item) =>
                item.id !==
                editingQuestion.id
            ),
        }));


        handleCancelEdit();


        alert(
          err.message ||
            "Erreur lors de la création de la question."
        );

      } finally {
        setSaving(false);
      }
    };


  /* =========================================================
     SAUVEGARDER UNE QUESTION UNIQUEMENT CÔTÉ FRONT
     
     MODE MULTIPLE UNIQUEMENT
     
     IMPORTANT :
     Aucun appel API ici.
  ========================================================= */

  const handleSaveLocalQuestion = () => {
    if (!editingQuestion) {
      return;
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      !editingQuestion.question ||
      !editingQuestion.question.trim()
    ) {
      alert(
        "Veuillez saisir une question."
      );

      return;
    }


    if (
      !editingQuestion.answers ||
      editingQuestion.answers.length === 0
    ) {
      alert(
        "Veuillez saisir au moins une réponse."
      );

      return;
    }


    const emptyAnswer =
      editingQuestion.answers.some(
        (answer) =>
          !answer ||
          !answer.trim()
      );


    if (emptyAnswer) {
      alert(
        "Toutes les réponses doivent être renseignées."
      );

      return;
    }


    const correctAnswerIdx =
      Number(
        editingQuestion.correctAnswerIdx
      );


    if (
      Number.isNaN(
        correctAnswerIdx
      ) ||
      correctAnswerIdx < 0 ||
      correctAnswerIdx >=
        editingQuestion.answers.length
    ) {
      alert(
        "Veuillez sélectionner une bonne réponse."
      );

      return;
    }


    /* =====================================================
       SAUVEGARDE UNIQUEMENT DANS LE STATE
    ===================================================== */

    setQcm((prevQcm) => ({
      ...prevQcm,

      questions:
        prevQcm.questions.map(
          (question) =>
            question.id ===
            editingQuestion.id
              ? {
                  ...editingQuestion,

                  points:
                    Number(
                      editingQuestion.points
                    ) || 0,

                  dureeMinutes:
                    Number(
                      editingQuestion.dureeMinutes
                    ) || 0,
                }
              : question
        ),
    }));


    handleCancelEdit();
  };


  /* =========================================================
     SUPPRIMER QUESTION
     
     MODE NORMAL :
       => DELETE BDD

     MODE MULTIPLE :
       => suppression uniquement du state
  ========================================================= */

  const handleDeleteQuestion = async (
    questionId
  ) => {
    if (!questionId) {
      return;
    }

    if (saving) {
      return;
    }


    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer cette question ?"
      );


    if (!confirmed) {
      return;
    }


    /* =====================================================
       MODE MULTIPLE
       
       La question n'existe pas encore en BDD.
    ===================================================== */

    if (isMultipleMode) {
      setQcm((prevQcm) => ({
        ...prevQcm,

        questions:
          prevQcm.questions.filter(
            (question) =>
              question.id !==
              questionId
          ),
      }));


      if (
        editingQuestionId ===
        questionId
      ) {
        handleCancelEdit();
      }


      return;
    }


    /* =====================================================
       MODE NORMAL
    ===================================================== */

    try {
      setSaving(true);
      setError("");


      console.log(
        "Suppression question :",
        questionId
      );


      await deleteTestNiveauQuestion(
        questionId
      );


      /* =================================================
         SUPPRESSION LOCALE
      ================================================= */

      setQcm((prevQcm) => ({
        ...prevQcm,

        questions:
          prevQcm.questions.filter(
            (question) =>
              question.id !==
              questionId
          ),
      }));


      if (
        editingQuestionId ===
        questionId
      ) {
        handleCancelEdit();
      }


      alert(
        "Question supprimée avec succès."
      );

    } catch (err) {
      console.error(
        "Erreur lors de la suppression :",
        err
      );

      alert(
        err.message ||
          "Erreur lors de la suppression de la question."
      );

    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     AJOUTER QUESTION
     
     En mode multiple :
       => création locale uniquement

     En mode normal :
       => création locale puis API lors du Save
  ========================================================= */

  const handleAddQuestion = () => {
    if (saving) {
      return;
    }


    if (prequalificationIds.length === 0) {
      alert(
        "Aucune préqualification sélectionnée."
      );

      return;
    }


    const newQuestion = {
      id: `new-${Date.now()}`,

      question:
        "Nouvelle question",

      answers: [
        "Réponse A",
        "Réponse B",
        "Réponse C",
        "Réponse D",
      ],

      correctAnswerIdx: 0,

      answerIdx: null,

      points: 1,

      dureeMinutes: 1,

      /*
       * En mode multiple, aucune question
       * n'est encore associée à un test.
       *
       * En mode normal, elle appartient
       * au test courant.
       */

      idTestNiveau:
        isMultipleMode
          ? null
          : prequalificationIds[0],

      idCategorieQuestion:
        null,

      isLocal: true,
    };


    /* =====================================================
       AJOUT LOCAL
    ===================================================== */

    setQcm((prevQcm) => ({
      ...prevQcm,

      questions: [
        ...prevQcm.questions,
        newQuestion,
      ],
    }));


    setEditingQuestionId(
      newQuestion.id
    );


    setEditingQuestion({
      ...newQuestion,

      answers: [
        ...newQuestion.answers,
      ],
    });
  };


  /* =========================================================
     ENREGISTRER TOUTES LES QUESTIONS
     
     MODE MULTIPLE UNIQUEMENT
     
     Exemple :
     
       testIds = [1, 2, 3]

       question1
       question2
       question3

     donne :

       Q1 -> Test 1
       Q1 -> Test 2
       Q1 -> Test 3

       Q2 -> Test 1
       Q2 -> Test 2
       Q2 -> Test 3

       Q3 -> Test 1
       Q3 -> Test 2
       Q3 -> Test 3
  ========================================================= */

  const handleSaveMultipleQuestions =
    async () => {
      if (saving) {
        return;
      }


      if (!isMultipleMode) {
        return;
      }


      if (prequalificationIds.length === 0) {
        alert(
          "Aucune préqualification sélectionnée."
        );

        return;
      }


      if (
        qcm.questions.length === 0
      ) {
        alert(
          "Veuillez ajouter au moins une question."
        );

        return;
      }


      /* =====================================================
         VALIDATION DE TOUTES LES QUESTIONS
      ===================================================== */

      for (
        let i = 0;
        i < qcm.questions.length;
        i++
      ) {
        const question =
          qcm.questions[i];


        if (
          !question.question ||
          !question.question.trim()
        ) {
          alert(
            `La question ${
              i + 1
            } doit être renseignée.`
          );

          return;
        }


        if (
          !question.answers ||
          question.answers.length === 0
        ) {
          alert(
            `La question ${
              i + 1
            } doit avoir au moins une réponse.`
          );

          return;
        }


        const emptyAnswer =
          question.answers.some(
            (answer) =>
              !answer ||
              !answer.trim()
          );


        if (emptyAnswer) {
          alert(
            `Toutes les réponses de la question ${
              i + 1
            } doivent être renseignées.`
          );

          return;
        }


        const correctAnswerIdx =
          Number(
            question.correctAnswerIdx
          );


        if (
          Number.isNaN(
            correctAnswerIdx
          ) ||
          correctAnswerIdx < 0 ||
          correctAnswerIdx >=
            question.answers.length
        ) {
          alert(
            `Veuillez sélectionner une bonne réponse pour la question ${
              i + 1
            }.`
          );

          return;
        }
      }


      try {
        setSaving(true);
        setError("");


        console.log(
          "========================================"
        );

        console.log(
          "ENREGISTREMENT MULTIPLE"
        );

        console.log(
          "Tests :",
          prequalificationIds
        );

        console.log(
          "Questions :",
          qcm.questions.length
        );


        console.log(
          "Nombre total de créations :",
          prequalificationIds.length *
            qcm.questions.length
        );

        console.log(
          "========================================"
        );


        /* =================================================
           CONSTRUIRE TOUTES LES PROMESSES
        ================================================= */

        const promises = [];


        for (
          const question
          of qcm.questions
        ) {
          for (
            const idTestNiveau
            of prequalificationIds
          ) {
            const payload =
              buildQuestionPayload(
                question,
                idTestNiveau
              );


            console.log(
              "Création question :",
              question.question
            );


            console.log(
              "Pour le test :",
              idTestNiveau
            );


            console.log(
              "Payload :",
              payload
            );


            promises.push(
              createTestNiveauQuestion(
                payload
              )
            );
          }
        }


        /* =================================================
           EXÉCUTER TOUS LES INSERTS
           
           Aucun GET ici.
           
           Aucun DELETE.
           
           Aucun UPDATE.
           
           Seulement les CREATE.
        ================================================= */

        await Promise.all(
          promises
        );


        console.log(
          "Toutes les questions ont été créées avec succès."
        );


        /* =================================================
           NETTOYAGE LOCAL
        ================================================= */

        setQcm((prev) => ({
          ...prev,

          questions: [],
        }));


        setEditingQuestionId(
          null
        );

        setEditingQuestion(
          null
        );


        alert(
          `${qcm.questions.length} question(s) créée(s) pour ${prequalificationIds.length} test(s).`
        );


        /* =================================================
           RETOUR À LA LISTE
        ================================================= */

        navigate(
          "/formateur/overview"
        );

      } catch (err) {
        console.error(
          "Erreur lors de l'enregistrement multiple :",
          err
        );


        alert(
          err.message ||
            "Une erreur est survenue lors de l'enregistrement des questions."
        );

      } finally {
        setSaving(false);
      }
    };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className={styles.container}>

      <FormateurSidebar />


      <main
        className={
          styles.mainContent
        }
      >

        <Header />


        <div
          className={
            styles.content
          }
        >

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div
            className={
              styles.pageHeader
            }
          >

            {/* GAUCHE : RETOUR */}

            <div
              className={
                styles.pageHeaderLeft
              }
            >

              <button
                type="button"
                className={
                  styles.backButton
                }
                onClick={
                  handleBack
                }
              >

                <FaArrowLeft />

                <span>
                  Retour aux tests
                </span>

              </button>

            </div>


            {/* CENTRE : TITRE */}

            <div
              className={
                styles.pageHeaderInfo
              }
            >

              <h1>
                {isMultipleMode
                  ? "Création de questions groupées"
                  : "Gestion de la préqualification"}
              </h1>


              <p>

                {isMultipleMode
                  ? "Créez les mêmes questions pour plusieurs préqualifications."
                  : "Consultez et gérez les questions, réponses, points et durées de la préqualification."}

              </p>

            </div>


            {/* DROITE : ACTIONS */}

            <div
              className={
                styles.pageHeaderRight
              }
            >

              <div
                className={
                  styles.pageHeaderActions
                }
              >

                {/* AJOUTER */}

                <button
                  type="button"
                  className={
                    styles.primaryButton
                  }
                  onClick={
                    handleAddQuestion
                  }
                  disabled={
                    loading ||
                    saving
                  }
                >

                  <FaPlus />

                  <span>
                    Ajouter une question
                  </span>

                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              INFORMATIONS DU TEST
          ================================================= */}

          <div
            className={
              styles.qcmHeader
            }
          >

            <div
              className={
                styles.qcmInfo
              }
            >

              <div
                className={
                  styles.qcmTitleRow
                }
              >

                <h2>

                  {isMultipleMode
                    ? "Tests sélectionnés"
                    : qcm.titre}

                </h2>


                <span
                  className={
                    styles.statusBadge
                  }
                >

                  <FaCheckCircle />

                  {isMultipleMode
                    ? `${prequalificationIds.length} tests sélectionnés`
                    : qcm.statut}

                </span>

              </div>


              {/* =================================================
                  TESTS SÉLECTIONNÉS
              ================================================= */}

              {isMultipleMode && (

                <div
                  className={
                    styles.selectedTests
                  }
                >

                  <strong>
                    Tests concernés :
                  </strong>


                  {prequalificationIds.map(
                    (id) => (

                      <span
                        key={id}
                        className={
                          styles.testIdBadge
                        }
                      >

                        Test #{id}

                      </span>

                    )
                  )}

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              STATISTIQUES
          ================================================= */}

          <div
            className={
              styles.statsGrid
            }
          >

            {/* QUESTIONS */}

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

                <FaQuestionCircle />

              </div>


              <div
                className={
                  styles.statContent
                }
              >

                <span>
                  Questions
                </span>

                <strong>
                  {
                    qcm.questions.length
                  }
                </strong>

              </div>

            </div>


            {/* POINTS */}

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

                <FaListOl />

              </div>


              <div
                className={
                  styles.statContent
                }
              >

                <span>
                  Total des points
                </span>

                <strong>
                  {
                    getTotalPoints()
                  }
                </strong>

              </div>

            </div>


            {/* DURÉE */}

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

                <FaClock />

              </div>


              <div
                className={
                  styles.statContent
                }
              >

                <span>
                  Durée totale
                </span>

                <strong>
                  {
                    getTotalDuration()
                  }{" "}
                  min
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              HEADER QUESTIONS
          ================================================= */}

          <div
            className={
              styles.questionsHeader
            }
          >

            <div>

              <h3>
                Questions du test
              </h3>


              <span>

                {
                  qcm.questions.length
                }{" "}
                question
                {
                  qcm.questions.length >
                  1
                    ? "s"
                    : ""
                }

              </span>

            </div>

          </div>


          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div
            className={
              styles.questionsList
            }
          >

            {/* =================================================
                CHARGEMENT
            ================================================= */}

            {loading ? (

              <div
                className={
                  styles.emptyQuestions
                }
              >

                <FaClock />

                <h4>
                  Chargement des questions...
                </h4>

                <p>
                  Veuillez patienter pendant
                  la récupération des questions
                  du test.
                </p>

              </div>


            ) : error ? (

              /* =================================================
                 ERREUR
              ================================================= */

              <div
                className={
                  styles.emptyQuestions
                }
              >

                <FaQuestionCircle />

                <h4>
                  Erreur
                </h4>

                <p>
                  {error}
                </p>

              </div>


            ) : qcm.questions.length === 0 ? (

              /* =================================================
                 AUCUNE QUESTION
              ================================================= */

              <div
                className={
                  styles.emptyQuestions
                }
              >

                <FaQuestionCircle />

                <h4>

                  {isMultipleMode
                    ? "Aucune question créée"
                    : "Aucune question"}

                </h4>


                <p>

                  {isMultipleMode
                    ? "Ajoutez les questions. Elles seront enregistrées pour tous les tests sélectionnés à la fin."
                    : "Ce test ne contient pas encore de question."}

                </p>


                <button
                  type="button"
                  className={
                    styles.primaryButton
                  }
                  onClick={
                    handleAddQuestion
                  }
                >

                  <FaPlus />

                  Ajouter une question

                </button>

              </div>


            ) : (

              /* =================================================
                 LISTE DES QUESTIONS
              ================================================= */

              qcm.questions.map(
                (
                  question,
                  questionIndex
                ) => {

                  const isEditing =
                    editingQuestionId ===
                    question.id;


                  return (

                    <article
                      key={
                        question.id
                      }
                      className={`
                        ${styles.questionCard}
                        ${
                          isEditing
                            ? styles.questionCardEditing
                            : ""
                        }
                      `}
                    >

                      {/* =================================================
                          QUESTION HEADER
                      ================================================= */}

                      <div
                        className={
                          styles.questionHeader
                        }
                      >

                        <div
                          className={
                            styles.questionNumber
                          }
                        >

                          {
                            String(
                              questionIndex +
                                1
                            ).padStart(
                              2,
                              "0"
                            )
                          }

                        </div>


                        <div
                          className={
                            styles.questionMeta
                          }
                        >

                          <span>

                            <FaClock />

                            {
                              question.dureeMinutes
                            }{" "}
                            min

                          </span>


                          <span>

                            {
                              question.points
                            }{" "}
                            point
                            {
                              question.points >
                              1
                                ? "s"
                                : ""
                            }

                          </span>

                        </div>


                        {!isEditing && (

                          <div
                            className={
                              styles.questionActions
                            }
                          >

                            <button
                              type="button"
                              className={
                                styles.editButton
                              }
                              onClick={() =>
                                handleEditQuestion(
                                  question
                                )
                              }
                              disabled={
                                saving
                              }
                            >

                              <FaEdit />

                              <span>
                                Modifier
                              </span>

                            </button>


                            <button
                              type="button"
                              className={
                                styles.deleteButton
                              }
                              onClick={() =>
                                handleDeleteQuestion(
                                  question.id
                                )
                              }
                              disabled={
                                saving
                              }
                            >

                              <FaTrash />

                            </button>

                          </div>

                        )}

                      </div>


                      {/* =================================================
                          MODE EDITION
                      ================================================= */}

                      {isEditing ? (

                        <div
                          className={
                            styles.editForm
                          }
                        >

                          {/* QUESTION */}

                          <div
                            className={
                              styles.formGroup
                            }
                          >

                            <label>
                              Question
                            </label>


                            <textarea
                              value={
                                editingQuestion.question
                              }
                              onChange={(e) =>
                                handleQuestionChange(
                                  e.target.value
                                )
                              }
                              rows="3"
                              disabled={
                                saving
                              }
                            />

                          </div>


                          {/* RÉPONSES */}

                          <div
                            className={
                              styles.answersEdit
                            }
                          >

                            <label>
                              Réponses
                            </label>


                            {editingQuestion.answers.map(
                              (
                                answer,
                                index
                              ) => (

                                <div
                                  key={
                                    index
                                  }
                                  className={
                                    styles.answerEditRow
                                  }
                                >

                                  <span
                                    className={`
                                      ${styles.answerLetter}
                                      ${
                                        editingQuestion.correctAnswerIdx ===
                                        index
                                          ? styles.correctLetter
                                          : ""
                                      }
                                    `}
                                  >

                                    {
                                      String.fromCharCode(
                                        65 +
                                          index
                                      )
                                    }

                                  </span>


                                  <input
                                    type="text"
                                    value={
                                      answer
                                    }
                                    onChange={(e) =>
                                      handleAnswerChange(
                                        index,
                                        e.target
                                          .value
                                      )
                                    }
                                    disabled={
                                      saving
                                    }
                                  />


                                  <label
                                    className={
                                      styles.correctCheckbox
                                    }
                                  >

                                    <input
                                      type="radio"
                                      name={`correct-${question.id}`}
                                      checked={
                                        editingQuestion.correctAnswerIdx ===
                                        index
                                      }
                                      onChange={() =>
                                        handleCorrectAnswerChange(
                                          index
                                        )
                                      }
                                      disabled={
                                        saving
                                      }
                                    />


                                    <span>
                                      Bonne réponse
                                    </span>

                                  </label>

                                </div>

                              )
                            )}

                          </div>


                          {/* POINTS + DURÉE */}

                          <div
                            className={
                              styles.settingsGrid
                            }
                          >

                            <div
                              className={
                                styles.formGroup
                              }
                            >

                              <label>
                                Points
                              </label>


                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={
                                  editingQuestion.points
                                }
                                onChange={(e) =>
                                  handlePointsChange(
                                    e.target
                                      .value
                                  )
                                }
                                disabled={
                                  saving
                                }
                              />

                            </div>


                            <div
                              className={
                                styles.formGroup
                              }
                            >

                              <label>
                                Temps imparti
                              </label>


                              <div
                                className={
                                  styles.inputWithSuffix
                                }
                              >

                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={
                                    editingQuestion.dureeMinutes
                                  }
                                  onChange={(e) =>
                                    handleDurationChange(
                                      e.target
                                        .value
                                    )
                                  }
                                  disabled={
                                    saving
                                  }
                                />


                                <span>
                                  min
                                </span>

                              </div>

                            </div>

                          </div>


                          {/* ACTIONS */}

                          <div
                            className={
                              styles.editActions
                            }
                          >

                            <button
                              type="button"
                              className={
                                styles.secondaryButton
                              }
                              onClick={
                                handleCancelEdit
                              }
                              disabled={
                                saving
                              }
                            >

                              <FaTimes />

                              Annuler

                            </button>


                            <button
                              type="button"
                              className={
                                styles.saveButton
                              }
                              onClick={() => {

                                /*
                                 * MODE MULTIPLE :
                                 * sauvegarde uniquement
                                 * côté React.
                                 */

                                if (
                                  isMultipleMode
                                ) {
                                  handleSaveLocalQuestion();

                                  return;
                                }


                                /*
                                 * MODE NORMAL :
                                 *
                                 * Nouvelle question
                                 * => CREATE
                                 *
                                 * Question existante
                                 * => UPDATE
                                 */

                                if (
                                  question.id
                                    ?.toString()
                                    .startsWith(
                                      "new-"
                                    )
                                ) {
                                  handleSaveNewQuestion();

                                  return;
                                }


                                handleSaveQuestion();

                              }}
                              disabled={
                                saving
                              }
                            >

                              <FaSave />


                              {saving
                                ? "Enregistrement..."
                                : "Enregistrer"}

                            </button>

                          </div>

                        </div>


                      ) : (

                        /* =================================================
                           MODE AFFICHAGE
                        ================================================= */

                        <div
                          className={
                            styles.questionBody
                          }
                        >

                          <h4>
                            {
                              question.question
                            }
                          </h4>


                          {/* RÉPONSES */}

                          <div
                            className={
                              styles.answersList
                            }
                          >

                            {question.answers.map(
                              (
                                answer,
                                answerIndex
                              ) => {

                                const isCorrect =
                                  answerIndex ===
                                  question.correctAnswerIdx;


                                return (

                                  <div
                                    key={
                                      answerIndex
                                    }
                                    className={`
                                      ${styles.answerItem}
                                      ${
                                        isCorrect
                                          ? styles.answerCorrect
                                          : ""
                                      }
                                    `}
                                  >

                                    <span
                                      className={`
                                        ${styles.answerLetter}
                                        ${
                                          isCorrect
                                            ? styles.correctLetter
                                            : ""
                                        }
                                      `}
                                    >

                                      {
                                        String.fromCharCode(
                                          65 +
                                            answerIndex
                                        )
                                      }

                                    </span>


                                    <span
                                      className={
                                        styles.answerText
                                      }
                                    >
                                      {
                                        answer
                                      }
                                    </span>


                                    {isCorrect && (

                                      <span
                                        className={
                                          styles.correctBadge
                                        }
                                      >

                                        <FaCheckCircle />

                                        Bonne réponse

                                      </span>

                                    )}

                                  </div>

                                );
                              }
                            )}

                          </div>


                          {/* FOOTER QUESTION */}

                          <div
                            className={
                              styles.questionFooter
                            }
                          >

                            <div>

                              <FaClock />

                              <span>
                                Temps :
                              </span>

                              <strong>
                                {
                                  question.dureeMinutes
                                }{" "}
                                min
                              </strong>

                            </div>


                            <div>

                              <FaListOl />

                              <span>
                                Note :
                              </span>

                              <strong>

                                {
                                  question.points
                                }{" "}
                                point
                                {
                                  question.points >
                                  1
                                    ? "s"
                                    : ""
                                }

                              </strong>

                            </div>

                          </div>

                        </div>

                      )}

                    </article>

                  );
                }
              )

            )}

          </div>


          {/* =================================================
              BOUTON FINAL EN MODE MULTIPLE
              
              Placé également en bas pour faciliter
              l'enregistrement lorsque la liste est longue.
          ================================================= */}

          {isMultipleMode &&
            qcm.questions.length >
              0 && (

              <div
                className={
                  styles.multipleSaveFooter
                }
              >

                <br/>
                <button
                  type="button"
                  className={
                    styles.saveButton
                  }
                  onClick={
                    handleSaveMultipleQuestions
                  }
                  disabled={
                    saving
                  }
                >

                  <FaSave />

                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer toutes les questions"}

                </button>

              </div>

            )}

        </div>

      </main>

    </div>
  );
};


export default CrudPrequalification;