import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaExclamationCircle,
  FaBriefcase,
  FaGraduationCap,
  FaIdCard,
  FaMapMarkerAlt,
  FaRedo,
  FaSearch,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import styles from "./Rh.module.css";
import RhSidebar from "../../pages/RhSidebar";
import Header from "../../component/Header/Header";
import DecisionFinale from "../../component/DecisionFinale/DecisionFinale";
import { getAllCandidatsScores } from "../../api/candidatScoreFinal";
import { getAllProgrammes } from "../../api/programme";
import { getAllCritereAppreciationActif } from "../../api/critereAppreciation";
import { getAllAppreciationActif } from "../../api/appreciation";
import {
  createCandidatAppreciation,
  getCandidatAppreciationByUserInformationId,
  updateCandidatAppreciation,
} from "../../api/candidatAppreciation";
import {
  getAllUserInformation,
} from "../../api/userInformation";

const Rh = () => {
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateTab, setCandidateTab] = useState("interview");
  const [programmes, setProgrammes] = useState([]);
  const [candidateProgrammes, setCandidateProgrammes] = useState([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState("");
  const [interviewCriteria, setInterviewCriteria] = useState([]);
  const [interviewGrid, setInterviewGrid] = useState({});
  const [candidateAppreciations, setCandidateAppreciations] = useState([]);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewSaving, setInterviewSaving] = useState(false);
  const [interviewError, setInterviewError] = useState("");
  const [interviewSuccess, setInterviewSuccess] = useState("");
  const [userInformationId, setUserInformationId] = useState(null);
  const decisionFinaleRef = useRef(null);

  const getId = (item, ...keys) => {
    for (const key of keys) {
      if (item?.[key] !== undefined && item?.[key] !== null) {
        return item[key];
      }
    }

    return null;
  };

  const getCritereId = (critere) =>
    getId(critere, "id", "idCritere", "id_critere");

  const getAppreciationId = (appreciation) =>
    getId(appreciation, "id", "idAppreciation", "id_appreciation");

  const getAppreciationCritereId = (appreciation) =>
    getId(appreciation, "idCritere", "id_critere");

  const getAppreciationLabel = (appreciation) =>
    appreciation.libelle ?? appreciation.libelleAppreciation ?? "Sans libellé";

  const getAppreciationPoints = (appreciation) =>
    Number(appreciation?.points) || 0;

  const getUserId = (candidate) =>
    candidate.idUser ?? candidate.id_user ?? candidate.id;

  const getUserInformationId = (information) =>
    getId(information, "id", "idUserInformation", "userInformationId");

  const getUserInformationUserId = (information) =>
    getId(information, "idUser", "id_user");

  const getUserInformationProgrammeId = (information) =>
    getId(information, "idProgramme", "id_programme");

  useEffect(() => {
    const fetchInterviewCriteria = async () => {
      try {
        const [criteres, appreciations] = await Promise.all([
          getAllCritereAppreciationActif(),
          getAllAppreciationActif(),
        ]);
        const activeAppreciations = Array.isArray(appreciations)
          ? appreciations
          : [];

        setInterviewCriteria(
          (Array.isArray(criteres) ? criteres : []).map((critere) => ({
            ...critere,
            options: activeAppreciations.filter(
              (appreciation) =>
                String(getAppreciationCritereId(appreciation)) ===
                String(getCritereId(critere))
            ),
          }))
        );
      } catch (err) {
        setInterviewError(
          err.message || "Impossible de charger les critères d'entretien."
        );
      }
    };

    fetchInterviewCriteria();
  }, []);

  const loadInterviewForProgramme = async (candidat, programmeId) => {
    setInterviewGrid({});
    setCandidateAppreciations([]);
    setUserInformationId(null);
    setInterviewError("");
    setInterviewSuccess("");

    try {
      setInterviewLoading(true);

      const informationList = await getAllUserInformation();
      const candidateInformationList = (Array.isArray(informationList)
        ? informationList
        : []
      ).filter(
        (information) =>
          Number(getUserInformationUserId(information)) ===
          Number(getUserId(candidat))
      );

      const candidateProgrammeIds = new Set(
        candidateInformationList.map((information) =>
          String(getUserInformationProgrammeId(information))
        )
      );
      const programmeList = programmes.length
        ? programmes
        : await getAllProgrammes();

      if (!programmes.length) {
        setProgrammes(Array.isArray(programmeList) ? programmeList : []);
      }

      setCandidateProgrammes(
        (Array.isArray(programmeList) ? programmeList : []).filter((programme) =>
          candidateProgrammeIds.has(String(getProgrammeId(programme)))
        )
      );

      const selectedInformation = candidateInformationList.find(
        (information) =>
          Number(getUserInformationProgrammeId(information)) ===
          Number(programmeId)
      );
      const candidateInformation =
        selectedInformation ?? candidateInformationList[0];

      if (!candidateInformation) {
        setSelectedProgrammeId("");
        return;
      }

      const resolvedProgrammeId = getUserInformationProgrammeId(
        candidateInformation
      );
      setSelectedProgrammeId(resolvedProgrammeId);

      const resolvedUserInformationId = getUserInformationId(candidateInformation);
      const saved = await getCandidatAppreciationByUserInformationId(
        resolvedUserInformationId
      );
      const savedList = Array.isArray(saved) ? saved : [];

      setUserInformationId(resolvedUserInformationId);
      setCandidateAppreciations(savedList);
      setInterviewGrid(
        savedList.reduce((answers, answer) => {
          answers[String(answer.idCritere ?? answer.id_critere)] = String(
            answer.idAppreciation ?? answer.id_appreciation
          );
          return answers;
        }, {})
      );
    } catch (err) {
      setInterviewError(
        err.message || "Impossible de charger la grille d'entretien."
      );
    } finally {
      setInterviewLoading(false);
    }
  };

  const openInterview = async (candidat) => {
    const programmeId =
      candidat.idProgramme ?? candidat.id_programme ?? "";

    setSelectedCandidate(candidat);
    setCandidateTab("interview");
    setSelectedProgrammeId("");
    setCandidateProgrammes([]);
    await loadInterviewForProgramme(candidat, programmeId);
  };

  const handleProgrammeChange = async (event) => {
    const programmeId = event.target.value;

    setSelectedProgrammeId(programmeId);

    if (selectedCandidate && programmeId) {
      await loadInterviewForProgramme(selectedCandidate, programmeId);
    } else {
      setUserInformationId(null);
      setInterviewGrid({});
      setCandidateAppreciations([]);
      setInterviewError("");
      setInterviewSuccess("");
    }
  };

  const closeInterview = () => {
    setSelectedCandidate(null);
  };

  const updateInterviewCriterion = (criterion, value) => {
    setInterviewGrid((current) => ({
      ...current,
      [criterion]: value,
    }));
  };

  const interviewScore = Object.entries(interviewGrid).reduce(
    (total, [criterionId, appreciationId]) => {
      const appreciation = interviewCriteria
        .find((criterion) => String(getCritereId(criterion)) === String(criterionId))
        ?.options.find(
          (option) => String(getAppreciationId(option)) === String(appreciationId)
        );

      return total + getAppreciationPoints(appreciation);
    },
    0
  );

  const saveInterview = async () => {
    setInterviewSuccess("");

    if (!selectedCandidate || !selectedProgrammeId) {
      setInterviewError("Le candidat et le programme sont obligatoires.");
      return false;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const idRh = currentUser?.id;

    if (!idRh) {
      setInterviewError("Impossible d'identifier le RH connecté.");
      return false;
    }

    try {
      setInterviewSaving(true);
      setInterviewError("");

      if (!userInformationId) {
        setInterviewError(
          "Aucune information n'existe pour ce programme et ce candidat."
        );
        return false;
      }

      const resolvedUserInformationId = userInformationId;

      const savedByCritere = new Map(
        candidateAppreciations.map((item) => [
          String(item.idCritere ?? item.id_critere),
          item,
        ])
      );

      await Promise.all(
        Object.entries(interviewGrid).map(async ([idCritere, idAppreciation]) => {
          const payload = {
            idUserInformation: Number(resolvedUserInformationId),
            idRh: Number(idRh),
            idCritere: Number(idCritere),
            idAppreciation: Number(idAppreciation),
          };
          const existing = savedByCritere.get(String(idCritere));

          if (existing?.id) {
            await updateCandidatAppreciation(existing.id, payload);
          } else {
            await createCandidatAppreciation(payload);
          }
        })
      );

      const refreshed = await getCandidatAppreciationByUserInformationId(
        resolvedUserInformationId
      );
      setCandidateAppreciations(Array.isArray(refreshed) ? refreshed : []);
      return true;
    } catch (err) {
      setInterviewError(
        err.message || "Impossible d'enregistrer l'entretien."
      );
      return false;
    } finally {
      setInterviewSaving(false);
    }
  };

  const saveInterviewAndDecision = async () => {
    const interviewSaved = await saveInterview();

    if (!interviewSaved || !decisionFinaleRef.current) {
      return;
    }

    await decisionFinaleRef.current.save();
  };

  const formatDate = (value) => {
    if (!value) {
      return "Non renseigné";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("fr-FR");
  };

  const formatGenre = (value) => {
    if (value === "H") return "Homme";
    if (value === "F") return "Femme";
    return value || "Non renseigné";
  };

  const formatBoolean = (value) => {
    if (value === true) return "Oui";
    if (value === false) return "Non";
    return "Non renseigné";
  };

  const displayValue = (value) => value || "Non renseigné";

  const getProgrammeId = (programme) =>
    programme.idProgramme ?? programme.id_programme ?? programme.id;

  const getProgrammeName = (programme) =>
    programme.nom ??
    programme.nomProgramme ??
    programme.nom_programme ??
    `Programme ${getProgrammeId(programme)}`;

  const renderProgrammeSelector = () => (
    <label className={styles.programmeSelector}>
      <span>Programme à consulter</span>
      <select
        value={selectedProgrammeId}
        onChange={handleProgrammeChange}
      >
        <option value="">
          {candidateProgrammes.length > 0
            ? "Sélectionner un programme"
            : "Aucun programme lié"}
        </option>
        {candidateProgrammes.map((programme) => (
          <option
            key={getProgrammeId(programme)}
            value={getProgrammeId(programme)}
          >
            {getProgrammeName(programme)}
          </option>
        ))}
      </select>
    </label>
  );

  const getTestNiveauScore = (candidat) => ({
    obtained:
      candidat.noteObtenueTestNiveau ??
      candidat.noteTestNiveau ??
      candidat.noteTestObtenue ??
      candidat.noteTestSur30 ??
      null,
    maximum: candidat.noteMaxTestNiveau ?? null,
  });

  const formatCareerValue = (field, value) => {
    const labels = {
      niveauEtudes: {
        "bac+": "Bac+ / Bac+2 et plus",
        bac: "Baccalauréat",
        "bac-": "Pré-bac / Non bachelier",
      },
      disponibiliteEngagment: {
        "non dispo": "Non disponible",
        "dispo-": "Disponible partiellement",
        dispo: "Disponible et engagé",
      },
      interetPoste: {
        insuffisant: "Insuffisant",
        hesitant: "Hésitant",
        eleve: "Élevé",
      },
      niveauFrancais: {
        "B1-": "B1-",
        B1: "B1",
        "B1+": "B1+",
      },
      clareteOrale: {
        insuffisant: "Insuffisant",
        satisfaisant: "Satisfaisant",
        eleve: "Élevé",
      },
      comprehensionOrale: {
        insuffisant: "Insuffisant",
        satisfaisant: "Satisfaisant",
        eleve: "Élevé",
      },
    };

    return displayValue(labels[field]?.[value] || value);
  };

  useEffect(() => {
    const fetchCandidats = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllCandidatsScores();
        console.log("Candidats récupérés :", data);
        const eligibleCandidates = (Array.isArray(data) ? data : []).filter(
          (candidat) => Number(candidat.noteGeneraleSur100) >= 50
        );

        setCandidats(eligibleCandidates);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des candidats :",
          err
        );
        setError(
          err.message ||
            "Impossible de récupérer la liste des candidats."
        );
        setCandidats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidats();
  }, []);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const data = await getAllProgrammes();
        setProgrammes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des programmes :", err);
        setProgrammes([]);
      }
    };

    fetchProgrammes();
  }, []);

  const filteredCandidates = candidats.filter((candidat) => {
    const searchValue = search.trim().toLowerCase();
    const fullName = `${candidat.prenom ?? ""} ${candidat.nom ?? ""}`
      .trim()
      .toLowerCase();

    return (
      !searchValue ||
      fullName.includes(searchValue) ||
      String(candidat.email ?? "").toLowerCase().includes(searchValue) ||
      String(candidat.cin ?? "").toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className={`d-flex flex-column flex-lg-row ${styles.container}`}>
      <RhSidebar />

      <div className={styles.mainArea}>
        <Header title="Ressource Humaine" showSearch={false} />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div>
              <h1>Candidats éligibles</h1>
            </div>

            <div className={styles.totalBadge}>
              {candidats.length} candidat{candidats.length > 1 ? "s" : ""}
            </div>
          </div>

          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par nom, email ou CIN..."
              aria-label="Rechercher un candidat"
            />
          </div>

          {loading && (
            <div className={styles.stateMessage}>
              <div className="spinner-border" role="status" aria-hidden="true" />
              <span>Chargement des candidats...</span>
            </div>
          )}

          {!loading && error && (
            <div className={styles.stateMessage}>
              <FaExclamationCircle />
              <span>{error}</span>
              <button type="button" onClick={() => window.location.reload()}>
                <FaRedo />
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && filteredCandidates.length === 0 && (
            <div className={styles.emptyState}>
              <FaUser />
              <h2>Aucun candidat trouvé</h2>
              <p>Aucun candidat ne correspond aux critères actuels.</p>
            </div>
          )}

          {!loading && !error && filteredCandidates.length > 0 && (
            <div className={styles.candidatesList}>
              {filteredCandidates.map((candidat) => (
                <article
                  className={styles.candidateCard}
                  key={candidat.idUser ?? candidat.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openInterview(candidat)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openInterview(candidat);
                    }
                  }}
                >
                  <div className={styles.candidateAvatar}>
                    <FaUser />
                  </div>

                  <div className={styles.candidateMain}>
                    <div className={styles.candidateHeader}>
                      <div>
                        <h2>
                          {candidat.prenom ?? ""} {candidat.nom ?? ""}
                        </h2>
                        <p>{candidat.email || "Email non renseigné"}</p>
                      </div>

                      <strong className={styles.scoreBadge}>
                        {candidat.noteGeneraleSur100 ?? "—"} / 100 pts
                      </strong>
                    </div>

                    <div className={styles.candidateDetails}>
                      <span>
                        <FaGraduationCap />
                        {candidat.programme || "Programme non renseigné"}
                      </span>
                      <span>
                        <FaMapMarkerAlt />
                        {candidat.region || "Région non renseignée"}
                      </span>
                      {candidat.cin && <span>CIN : {candidat.cin}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {selectedCandidate && (
          <>
            <div
              className={styles.interviewOverlay}
              onClick={closeInterview}
              aria-hidden="true"
            />

            <aside
              className={styles.interviewPanel}
              aria-label="Grille d'entretien qualitative"
            >
              <div className={styles.interviewHeader}>
                <div>
                  <span>Entretien qualitatif</span>
                  <h2>
                    {selectedCandidate.prenom ?? ""}{" "}
                    {selectedCandidate.nom ?? ""}
                  </h2>
                </div>

                <button
                  type="button"
                  className={styles.closePanelButton}
                  onClick={closeInterview}
                  aria-label="Fermer la grille d'entretien"
                >
                  <FaTimes />
                </button>
              </div>

              <div className={styles.interviewCandidateMeta}>
                <span>{selectedCandidate.email || "Email non renseigné"}</span>
                <strong>
                  {selectedCandidate.noteGeneraleSur100 ?? "—"} / 100 pts
                </strong>
              </div>

              <div className={styles.candidateTabs} role="tablist">
                <button
                  type="button"
                  className={
                    candidateTab === "interview"
                      ? `${styles.candidateTab} ${styles.activeCandidateTab}`
                      : styles.candidateTab
                  }
                  onClick={() => setCandidateTab("interview")}
                >
                  <FaBriefcase />
                  Entretien
                </button>

                <button
                  type="button"
                  className={
                    candidateTab === "personal"
                      ? `${styles.candidateTab} ${styles.activeCandidateTab}`
                      : styles.candidateTab
                  }
                  onClick={() => setCandidateTab("personal")}
                >
                  <FaIdCard />
                  Informations personnelles
                </button>

                <button
                  type="button"
                  className={
                    candidateTab === "career"
                      ? `${styles.candidateTab} ${styles.activeCandidateTab}`
                      : styles.candidateTab
                  }
                  onClick={() => setCandidateTab("career")}
                >
                  <FaGraduationCap />
                  Parcours
                </button>
              </div>

              {candidateTab === "personal" && (
                <section className={styles.candidateInfoSection}>
                  <h3>Informations personnelles</h3>

                  <div className={styles.candidateInfoGrid}>
                    <div>
                      <span>Prénom</span>
                      <strong>{displayValue(selectedCandidate.prenom)}</strong>
                    </div>
                    <div>
                      <span>Nom</span>
                      <strong>{displayValue(selectedCandidate.nom)}</strong>
                    </div>
                    <div>
                      <span>Genre</span>
                      <strong>{formatGenre(selectedCandidate.genre)}</strong>
                    </div>
                    <div>
                      <span>Date de naissance</span>
                      <strong>{formatDate(selectedCandidate.dateNaissance)}</strong>
                    </div>
                    <div>
                      <span>CIN</span>
                      <strong>{displayValue(selectedCandidate.cin)}</strong>
                    </div>
                    <div>
                      <span>Téléphone</span>
                      <strong>{displayValue(selectedCandidate.telephone)}</strong>
                    </div>
                    <div>
                      <span>Email</span>
                      <strong>{displayValue(selectedCandidate.email)}</strong>
                    </div>
                    <div>
                      <span>Région</span>
                      <strong>{displayValue(selectedCandidate.region)}</strong>
                    </div>
                    <div className={styles.fullWidthInfo}>
                      <span>Adresse</span>
                      <strong>{displayValue(selectedCandidate.adresse)}</strong>
                    </div>
                  </div>
                </section>
              )}

              {candidateTab === "career" && (
                <section className={styles.candidateInfoSection}>
                  <h3>Parcours et candidature</h3>

                  {renderProgrammeSelector()}

                  {Number(selectedProgrammeId) !==
                    Number(
                      selectedCandidate.idProgramme ??
                        selectedCandidate.id_programme
                    ) ? (
                      <div className={styles.noProgrammeInfo}>
                        <FaGraduationCap />
                        <span>
                          Ce candidat n&apos;est pas associé au programme sélectionné.
                        </span>
                      </div>
                    ) : (
                      <>

                  <div className={styles.candidateInfoGrid}>
                    <div>
                      <span>Programme</span>
                      <strong>
                        {displayValue(selectedCandidate.programme)}
                      </strong>
                    </div>
                    <div>
                      <span>Niveau d'études</span>
                      <strong>
                        {formatCareerValue(
                          "niveauEtudes",
                          selectedCandidate.niveauEtudes
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>Indépendance financière</span>
                      <strong>{formatBoolean(selectedCandidate.independanceFinanciere)}</strong>
                    </div>
                    <div>
                      <span>Disponibilité / engagement</span>
                      <strong>
                        {formatCareerValue(
                          "disponibiliteEngagment",
                          selectedCandidate.disponibiliteEngagment
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>Date de disponibilité</span>
                      <strong>{formatDate(selectedCandidate.dateDisponibilite)}</strong>
                    </div>
                    <div>
                      <span>Intérêt pour le poste</span>
                      <strong>
                        {formatCareerValue(
                          "interetPoste",
                          selectedCandidate.interetPoste
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>Niveau de français</span>
                      <strong>
                        {formatCareerValue(
                          "niveauFrancais",
                          selectedCandidate.niveauFrancais
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>Clarté orale</span>
                      <strong>
                        {formatCareerValue(
                          "clareteOrale",
                          selectedCandidate.clareteOrale
                        )}
                      </strong>
                    </div>
                    <div>
                      <span>Compréhension orale</span>
                      <strong>
                        {formatCareerValue(
                          "comprehensionOrale",
                          selectedCandidate.comprehensionOrale
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.scoreSummary}>
                    <div>
                      <span>Skill matching</span>
                      <strong>
                        {displayValue(selectedCandidate.noteSkillMatching)} / 52
                      </strong>
                    </div>
                    <div>
                      <span>Préqualification</span>
                      <strong>
                        {displayValue(selectedCandidate.notePrequalification)} / 48
                      </strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>
                        {displayValue(selectedCandidate.noteGeneraleSur100)} / 100
                      </strong>
                    </div>
                  </div>

                  <div className={styles.technicalTestScore}>
                    <div>
                      <span>Test technique</span>
                      <strong>
                        {getTestNiveauScore(selectedCandidate).obtained !== null
                          ? `${getTestNiveauScore(selectedCandidate).obtained} / ${
                              getTestNiveauScore(selectedCandidate).maximum ?? "—"
                            }`
                          : "Non disponible"}
                      </strong>
                    </div>
                  </div>
                      </>
                    )}
                </section>
              )}

              {candidateTab === "interview" && <>
              {renderProgrammeSelector()}

              {interviewLoading && (
                <div className={styles.interviewState}>
                  <div className="spinner-border" role="status" aria-hidden="true" />
                  Chargement de l'entretien...
                </div>
              )}

              {interviewError && (
                <div className={styles.interviewError}>
                  <FaExclamationCircle />
                  <span>{interviewError}</span>
                </div>
              )}

              {interviewSuccess && (
                <div className={styles.interviewSuccess} role="status">
                  <span aria-hidden="true">✓</span>
                  <span>{interviewSuccess}</span>
                </div>
              )}

              {!interviewLoading && interviewCriteria.length === 0 && !interviewError && (
                <div className={styles.interviewState}>
                  Aucun critère actif n'est disponible.
                </div>
              )}

              {!interviewLoading && interviewCriteria.length > 0 && (
                <div className={styles.interviewGrid}>
                  <div className={styles.gridHeader}>
                    <span>Critère</span>
                    <span>Appréciation</span>
                  </div>

                  {interviewCriteria.map((criterion) => {
                    const criterionId = getCritereId(criterion);

                    return (
                      <div className={styles.gridRow} key={criterionId}>
                        <strong>{criterion.nom ?? criterion.label ?? "Sans nom"}</strong>

                        <div className={styles.radioGroup}>
                          {criterion.options.map((option) => {
                            const appreciationId = getAppreciationId(option);

                            return (
                              <label className={styles.radioOption} key={appreciationId}>
                                <input
                                  type="radio"
                                  name={`critere-${criterionId}`}
                                  value={appreciationId}
                                  checked={
                                    interviewGrid[String(criterionId)] ===
                                    String(appreciationId)
                                  }
                                  onChange={(event) =>
                                    updateInterviewCriterion(
                                      String(criterionId),
                                      event.target.value
                                    )
                                  }
                                />
                                <span>{getAppreciationLabel(option)}</span>
                                <small>{getAppreciationPoints(option)} pts</small>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className={styles.interviewScore}>
                <span>Score de l'entretien</span>
                <strong>{interviewScore} / 100</strong>
              </div>

              <DecisionFinale
                ref={decisionFinaleRef}
                idUserInformation={userInformationId}
                idRh={JSON.parse(localStorage.getItem("user") || "null")?.id}
                styles={styles}
                onSuccess={setInterviewSuccess}
                onError={setInterviewError}
              />

              <button
                type="button"
                className={styles.saveInterviewButton}
                onClick={saveInterviewAndDecision}
                disabled={
                  interviewSaving ||
                  interviewLoading ||
                  !selectedProgrammeId ||
                  !userInformationId
                }
              >
                {interviewSaving
                  ? "Enregistrement..."
                  : "Enregistrer "}
              </button>
              </>}
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default Rh;