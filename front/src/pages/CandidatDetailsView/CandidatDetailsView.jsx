import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaFileAlt,
  FaExclamationCircle,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import styles from "./CandidatDetailsView.module.css";

import { getCandidatScoreById } from "../../api/candidatScoreFinal";
import { getAllProgrammes } from "../../api/programme";
import { getAllRegions } from "../../api/region";
import { updateUser } from "../../api/user";
import { updateUserInformation } from "../../api/userInformation";

const niveauEtudesOptions = [
  { value: "bac+", label: "Bac+ / Bac+2 et plus" },
  { value: "bac", label: "Baccalauréat" },
  { value: "bac-", label: "Pré-bac / Non bachelier" },
];

const diplomeOptions = [
  "Baccalauréat",
  "BTS / DUT",
  "Licence",
  "Master",
  "Doctorat",
];

const disponibiliteOptions = [
  { value: "non dispo", label: "Non disponible" },
  { value: "dispo-", label: "Disponible partiellement" },
  { value: "dispo", label: "Disponible et engagé" },
];

const interetPosteOptions = [
  { value: "insuffisant", label: "Insuffisant" },
  { value: "hesitant", label: "Hésitant" },
  { value: "eleve", label: "Élevé" },
];

const niveauFrancaisOptions = [
  { value: "B1-", label: "B1-" },
  { value: "B1", label: "B1" },
  { value: "B1+", label: "B1+" },
];

const oralEvaluationOptions = [
  { value: "insuffisant", label: "Insuffisant" },
  { value: "satisfaisant", label: "Satisfaisant" },
  { value: "eleve", label: "Élevé" },
];

const CandidatDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("personal");

  const [candidatScore, setCandidatScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [scoreError, setScoreError] = useState("");
  const [programmes, setProgrammes] = useState([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(false);
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);

  /*
   * Candidat envoyé depuis CandidatListe
   */
  const initialUser = location.state?.candidate || null;

  console.log("Candidat reçu dans la vue détail :", initialUser);
  console.log(
    "userInformationId reçu dans la vue détail :",
    initialUser?.userInformationId
  );

  const [user, setUser] = useState(initialUser);

  /*
   * Mode modification
   */
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(false);

  /*
   * Formulaires
   */
  const [personalForm, setPersonalForm] = useState({});
  const [careerForm, setCareerForm] = useState({});

  /*
   * Etats de sauvegarde
   */
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingCareer, setSavingCareer] = useState(false);

  const [updateError, setUpdateError] = useState("");

  // =========================================================
  // RECUPERATION DU SCORE
  // =========================================================

  useEffect(() => {
    const fetchCandidatScore = async () => {
      if (!id) {
        return;
      }

      try {
        setLoadingScore(true);
        setScoreError("");

        const data = await getCandidatScoreById(id);

        console.log("Score du candidat récupéré :", data);

        setCandidatScore(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du score du candidat :",
          error
        );

        setScoreError(
          error.message ||
            "Impossible de récupérer le score du candidat."
        );

        setCandidatScore(null);
      } finally {
        setLoadingScore(false);
      }
    };

    fetchCandidatScore();
  }, [id]);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoadingProgrammes(true);
        const data = await getAllProgrammes();
        setProgrammes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des programmes :", error);
      } finally {
        setLoadingProgrammes(false);
      }
    };

    fetchProgrammes();
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoadingRegions(true);
        const data = await getAllRegions();
        setRegions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des régions :", error);
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  // =========================================================
  // RETOUR
  // =========================================================

  const handleBack = () => {
    navigate(-1);
  };

  // =========================================================
  // VERIFIER SI UNE VALEUR EXISTE
  // =========================================================

  const hasValue = (value) => {
    return (
      value !== null &&
      value !== undefined &&
      value !== ""
    );
  };

  // =========================================================
  // VALEUR POUR FORMULAIRE
  // =========================================================

  const formValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return value;
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!hasValue(date)) {
      return null;
    }

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString("fr-FR");
    } catch {
      return date;
    }
  };

  // =========================================================
  // FORMAT DATE + HEURE
  // =========================================================

  const formatDateTime = (date) => {
    if (!hasValue(date)) {
      return null;
    }

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return date;
    }
  };

  // =========================================================
  // FORMAT FICHIER
  // =========================================================

  const getFileName = (file) => {
    if (!hasValue(file)) {
      return null;
    }

    return file;
  };

  // =========================================================
  // FORMAT BOOLEAN
  // =========================================================

  const formatBoolean = (value) => {
    if (value === true) {
      return "Oui";
    }

    if (value === false) {
      return "Non";
    }

    return null;
  };

  const formatGenre = (value) => {
    if (value === "H") {
      return "Homme";
    }

    if (value === "F") {
      return "Femme";
    }

    return value;
  };

  const formatNiveauEtudes = (value) =>
    niveauEtudesOptions.find((option) => option.value === value)?.label || value;

  const formatDisponibilite = (value) =>
    disponibiliteOptions.find((option) => option.value === value)?.label || value;

  // =========================================================
  // SCORE
  // =========================================================

  const hasScoreValue = (value) =>
    value !== null &&
    value !== undefined &&
    value !== "";

  const hasCandidateScore =
    candidatScore &&
    (hasScoreValue(candidatScore.noteSkillMatching) ||
      hasScoreValue(candidatScore.notePrequalification) ||
      hasScoreValue(candidatScore.noteGeneraleSur100));

  // =========================================================
  // MODIFICATION INFORMATIONS PERSONNELLES
  // =========================================================

  const handleStartPersonalEdit = () => {
    setUpdateError("");

    setPersonalForm({
      nom: formValue(user.lastname),
      prenom: formValue(user.firstname),
      cin: formValue(user.cin),
      email: formValue(user.email),
      telephone: formValue(user.phone),
      adresse: formValue(user.adresse),
      residenceTana: formValue(user.residenceTana),
      dateNaissance: formValue(user.dateNaissance),
      genre: formValue(user.genre),
      regionId: formValue(user.regionId),
      cinDateDelivrance: formValue(
        user.cinDateDelivrance
      ),
      cinLieuDelivrance: formValue(
        user.cinLieuDelivrance
      ),
      dernierDiplomeObtenu: formValue(
        user.dernierDiplomeObtenu
      ),
    });

    setEditingPersonal(true);
  };

  // =========================================================
  // ANNULER MODIFICATION PERSONNELLE
  // =========================================================

  const handleCancelPersonalEdit = () => {
    setEditingPersonal(false);
    setUpdateError("");
  };

  // =========================================================
  // CHANGEMENT FORMULAIRE PERSONNEL
  // =========================================================

  const handlePersonalChange = (event) => {
    const { name, value } = event.target;

    setPersonalForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SAUVEGARDER INFORMATIONS PERSONNELLES
  // =========================================================

  const handleSavePersonal = async () => {
    if (!id) {
      return;
    }

    try {
      setSavingPersonal(true);
      setUpdateError("");

      /*
       * On prépare les données attendues par l'API users.
       *
       * Les champs vides deviennent null.
       *
       * Le password n'est volontairement PAS envoyé.
       */
      const userData = {
        nom:
          personalForm.nom?.trim() !== ""
            ? personalForm.nom.trim()
            : null,

        prenom:
          personalForm.prenom?.trim() !== ""
            ? personalForm.prenom.trim()
            : null,

        cin:
          personalForm.cin?.trim() !== ""
            ? personalForm.cin.trim()
            : null,

        email:
          personalForm.email?.trim() !== ""
            ? personalForm.email.trim()
            : null,

        telephone:
          personalForm.telephone?.trim() !== ""
            ? personalForm.telephone.trim()
            : null,

        adresse:
          personalForm.adresse?.trim() !== ""
            ? personalForm.adresse.trim()
            : null,

        residenceTana:
          personalForm.residenceTana?.trim() !== ""
            ? personalForm.residenceTana.trim()
            : null,

        dateNaissance:
          personalForm.dateNaissance !== ""
            ? personalForm.dateNaissance
            : null,

        genre:
          personalForm.genre !== ""
            ? personalForm.genre
            : null,

        regionId:
          personalForm.regionId !== ""
            ? Number(personalForm.regionId)
            : null,

        cinDateDelivrance:
          personalForm.cinDateDelivrance !== ""
            ? personalForm.cinDateDelivrance
            : null,

        cinLieuDelivrance:
          personalForm.cinLieuDelivrance?.trim() !== ""
            ? personalForm.cinLieuDelivrance.trim()
            : null,

        dernierDiplomeObtenu:
          personalForm.dernierDiplomeObtenu?.trim() !== ""
            ? personalForm.dernierDiplomeObtenu.trim()
            : null,

        // IMPORTANT :
        // Cette page modifie uniquement des candidats.
        roleId: 2
      };


      console.log(
        "Données utilisateur envoyées :",
        userData
      );

      const updatedUser = await updateUser(
        id,
        userData
      );

      console.log(
        "Utilisateur modifié :",
        updatedUser
      );

      /*
       * On met à jour les données affichées.
       *
       * Certains backends retournent l'objet complet,
       * d'autres retournent seulement un message.
       * On utilise donc les données du formulaire pour
       * garantir l'affichage immédiat.
       */
      setUser((previous) => ({
        ...previous,

        lastname: personalForm.nom,
        firstname: personalForm.prenom,
        cin: personalForm.cin,
        email: personalForm.email,
        phone: personalForm.telephone,
        adresse: personalForm.adresse,
        residenceTana: personalForm.residenceTana,
        dateNaissance: personalForm.dateNaissance,
        genre: personalForm.genre,
        regionId:
          personalForm.regionId !== ""
            ? Number(personalForm.regionId)
            : null,
        regionNom:
          regions.find(
            (region) =>
              Number(region.id) === Number(personalForm.regionId)
          )?.nom || null,
        cinDateDelivrance:
          personalForm.cinDateDelivrance,
        cinLieuDelivrance:
          personalForm.cinLieuDelivrance,
        dernierDiplomeObtenu:
          personalForm.dernierDiplomeObtenu,
      }));

      setEditingPersonal(false);

    } catch (error) {
      console.error(
        "Erreur lors de la modification de l'utilisateur :",
        error
      );

      setUpdateError(
        error.message ||
          "Impossible de modifier les informations personnelles."
      );
    } finally {
      setSavingPersonal(false);
    }
  };

  // =========================================================
  // MODIFICATION PARCOURS
  // =========================================================

  const handleStartCareerEdit = () => {
    setUpdateError("");

    setCareerForm({
      idProgramme: formValue(user.programmeId),

      niveauEtudes: formValue(
        user.niveauEtudes
      ),

      independanceFinanciere:
        user.independanceFinanciere === true
          ? "true"
          : user.independanceFinanciere === false
          ? "false"
          : "",

      disponibiliteEngagment: formValue(
        user.disponibiliteEngagment
      ),

      dateDisponibilite: formValue(
        user.dateDisponibilite
      ),

      interetPoste: formValue(
        user.interetPoste
      ),

      niveauFrancais: formValue(
        user.niveauFrancais
      ),

      clareteOrale: formValue(
        user.clareteOrale
      ),

      comprehensionOrale: formValue(
        user.comprehensionOrale
      ),
    });

    setEditingCareer(true);
  };

  // =========================================================
  // ANNULER MODIFICATION PARCOURS
  // =========================================================

  const handleCancelCareerEdit = () => {
    setEditingCareer(false);
    setUpdateError("");
  };

  // =========================================================
  // CHANGEMENT FORMULAIRE PARCOURS
  // =========================================================

  const handleCareerChange = (event) => {
    const { name, value } = event.target;

    setCareerForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SAUVEGARDER PARCOURS
  // =========================================================

  const handleSaveCareer = async () => {
    const userInformationId =
      user.userInformationId;

    console.log("Sauvegarde parcours - utilisateur :", user);
    console.log(
      "Sauvegarde parcours - userInformationId utilisé :",
      userInformationId,
      "type :",
      typeof userInformationId
    );

    if (!userInformationId) {
      setUpdateError(
        "Impossible de modifier les informations : identifiant user_information introuvable."
      );

      return;
    }

    try {
      setSavingCareer(true);
      setUpdateError("");

      /*
       * Les champs vides deviennent null.
       *
       * id_programme reste obligatoire en base.
       * On conserve donc la valeur existante si elle
       * n'est pas modifiée.
       */
      const idProgramme =
        careerForm.idProgramme !== ""
          ? Number(careerForm.idProgramme)
          : user.programmeId;

      if (!idProgramme) {
        throw new Error(
          "Le programme est obligatoire."
        );
      }

      let independanceFinanciere = null;

      if (
        careerForm.independanceFinanciere ===
        "true"
      ) {
        independanceFinanciere = true;
      } else if (
        careerForm.independanceFinanciere ===
        "false"
      ) {
        independanceFinanciere = false;
      }

      const informationData = {
        idProgramme: idProgramme,

        niveauEtudes:
          careerForm.niveauEtudes?.trim() !== ""
            ? careerForm.niveauEtudes.trim()
            : null,

        independanceFinanciere:
          independanceFinanciere,

        disponibiliteEngagment:
          careerForm.disponibiliteEngagment?.trim() !== ""
            ? careerForm.disponibiliteEngagment.trim()
            : null,

        dateDisponibilite:
          careerForm.dateDisponibilite !== ""
            ? careerForm.dateDisponibilite
            : null,

        interetPoste:
          careerForm.interetPoste?.trim() !== ""
            ? careerForm.interetPoste.trim()
            : null,

        niveauFrancais:
          careerForm.niveauFrancais?.trim() !== ""
            ? careerForm.niveauFrancais.trim()
            : null,

        clareteOrale:
          careerForm.clareteOrale?.trim() !== ""
            ? careerForm.clareteOrale.trim()
            : null,

        comprehensionOrale:
          careerForm.comprehensionOrale?.trim() !== ""
            ? careerForm.comprehensionOrale.trim()
            : null,
      };

      console.log(
        "Données user_information envoyées :",
        informationData
      );

      const updatedInformation =
        await updateUserInformation(
          userInformationId,
          informationData
        );

      console.log(
        "Informations candidat modifiées :",
        updatedInformation
      );

      /*
       * Mise à jour immédiate de l'affichage.
       */
      setUser((previous) => ({
        ...previous,

        programmeId: idProgramme,

        niveauEtudes:
          careerForm.niveauEtudes,

        independanceFinanciere:
          independanceFinanciere,

        disponibiliteEngagment:
          careerForm.disponibiliteEngagment,

        dateDisponibilite:
          careerForm.dateDisponibilite,

        interetPoste:
          careerForm.interetPoste,

        niveauFrancais:
          careerForm.niveauFrancais,

        clareteOrale:
          careerForm.clareteOrale,

        comprehensionOrale:
          careerForm.comprehensionOrale,
      }));

      setEditingCareer(false);

    } catch (error) {
      console.error(
        "Erreur lors de la modification des informations candidat :",
        error
      );

      setUpdateError(
        error.message ||
          "Impossible de modifier les informations de candidature."
      );
    } finally {
      setSavingCareer(false);
    }
  };

  // =========================================================
  // SI AUCUN CANDIDAT
  // =========================================================

  if (!user) {
    return (
      <div className={styles.viewContainer}>

        <div className={styles.errorMessage}>
          <FaExclamationCircle />

          <span>
            Aucune information disponible pour ce candidat.
          </span>
        </div>

        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
        >
          <FaArrowLeft />
          Retour
        </button>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className={styles.viewContainer}>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className={styles.pageHeader}>

        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
        >
          <FaArrowLeft />
          Retour
        </button>

        <div className={styles.navigation}>

          <button
            type="button"
            className={
              activeSection === "personal"
                ? `${styles.navButton} ${styles.active}`
                : styles.navButton
            }
            onClick={() =>
              setActiveSection("personal")
            }
          >
            <FaUser />
            Informations personnelles
          </button>

          <button
            type="button"
            className={
              activeSection === "career"
                ? `${styles.navButton} ${styles.active}`
                : styles.navButton
            }
            onClick={() =>
              setActiveSection("career")
            }
          >
            <FaGraduationCap />
            Parcours
          </button>

        </div>
      </div>

      {/* =====================================================
          MESSAGE ERREUR MODIFICATION
      ====================================================== */}

      {updateError && (
        <div className={styles.errorMessage}>
          <FaExclamationCircle />

          <span>
            {updateError}
          </span>
        </div>
      )}

      {/* =====================================================
          INFORMATIONS PERSONNELLES
      ====================================================== */}

      {activeSection === "personal" && (

        <section className={styles.section}>

          {/* =================================================
              IDENTITE
          ================================================== */}

          <div className={styles.card}>

            <div className={styles.cardHeader}>

              <h3>
                <FaUser />
                Identité
              </h3>

              {!editingPersonal && (
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={
                    handleStartPersonalEdit
                  }
                >
                  <FaEdit />
                  Modifier
                </button>
              )}

            </div>

            {!editingPersonal ? (

              <div className={styles.infoGrid}>

                {hasValue(user.firstname) && (
                  <div className={styles.infoItem}>
                    <span>Prénom</span>
                    <strong>
                      {user.firstname}
                    </strong>
                  </div>
                )}

                {hasValue(user.lastname) && (
                  <div className={styles.infoItem}>
                    <span>Nom</span>
                    <strong>
                      {user.lastname}
                    </strong>
                  </div>
                )}

                {hasValue(user.cin) && (
                  <div className={styles.infoItem}>
                    <span>
                      Numéro CIN
                    </span>
                    <strong>
                      {user.cin}
                    </strong>
                  </div>
                )}

                {hasValue(user.dateNaissance) && (
                  <div className={styles.infoItem}>
                    <span>
                      Date de naissance
                    </span>
                    <strong>
                      {formatDate(
                        user.dateNaissance
                      )}
                    </strong>
                  </div>
                )}

                {hasValue(user.genre) && (
                  <div className={styles.infoItem}>
                    <span>Genre</span>
                    <strong>
                      {formatGenre(user.genre)}
                    </strong>
                  </div>
                )}

              </div>

            ) : (

              <div className={styles.editForm}>

                <div className={styles.formGrid}>

                  <div className={styles.formGroup}>
                    <label>
                      Prénom
                    </label>

                    <input
                      type="text"
                      name="prenom"
                      value={
                        personalForm.prenom
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Nom
                    </label>

                    <input
                      type="text"
                      name="nom"
                      value={
                        personalForm.nom
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Numéro CIN
                    </label>

                    <input
                      type="text"
                      name="cin"
                      maxLength="12"
                      value={
                        personalForm.cin
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Date de naissance
                    </label>

                    <input
                      type="date"
                      name="dateNaissance"
                      value={
                        personalForm.dateNaissance
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Genre
                    </label>

                    <select
                      name="genre"
                      value={
                        personalForm.genre
                      }
                      onChange={
                        handlePersonalChange
                      }
                    >
                      <option value="">
                        Non renseigné
                      </option>

                      <option value="H">
                        Homme
                      </option>

                      <option value="F">
                        Femme
                      </option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Région
                    </label>

                    <select
                      name="regionId"
                      value={
                        personalForm.regionId || ""
                      }
                      onChange={
                        handlePersonalChange
                      }
                      disabled={loadingRegions}
                    >
                      <option value="">
                        {loadingRegions
                          ? "Chargement des régions..."
                          : "Sélectionner une région"}
                      </option>

                      {personalForm.regionId &&
                        !regions.some(
                          (region) =>
                            Number(region.id) ===
                            Number(personalForm.regionId)
                        ) && (
                          <option value={personalForm.regionId}>
                            {user.regionNom || "Région actuelle"}
                          </option>
                        )}

                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              COORDONNEES
          ================================================== */}

          <div className={styles.card}>

            <div className={styles.cardHeader}>

              <h3>
                <FaPhone />
                Coordonnées
              </h3>

            </div>

            {!editingPersonal ? (

              <div className={styles.infoGrid}>

                {hasValue(user.email) && (
                  <div className={styles.infoItem}>
                    <span>
                      <FaEnvelope />
                      Email
                    </span>

                    <strong>
                      {user.email}
                    </strong>
                  </div>
                )}

                {hasValue(user.phone) && (
                  <div className={styles.infoItem}>
                    <span>
                      <FaPhone />
                      Téléphone
                    </span>

                    <strong>
                      {user.phone}
                    </strong>
                  </div>
                )}

                {hasValue(user.adresse) && (
                  <div className={styles.infoItem}>
                    <span>
                      <FaMapMarkerAlt />
                      Adresse
                    </span>

                    <strong>
                      {user.adresse}
                    </strong>
                  </div>
                )}

                {hasValue(user.residenceTana) && (
                  <div className={styles.infoItem}>
                    <span>
                      Résidence à Tana
                    </span>

                    <strong>
                      {user.residenceTana}
                    </strong>
                  </div>
                )}

                {hasValue(user.regionNom) && (
                  <div className={styles.infoItem}>
                    <span>
                      Région
                    </span>

                    <strong>
                      {user.regionNom}
                    </strong>
                  </div>
                )}

              </div>

            ) : (

              <div className={styles.editForm}>

                <div className={styles.formGrid}>

                  <div className={styles.formGroup}>
                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        personalForm.email
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Téléphone
                    </label>

                    <input
                      type="text"
                      name="telephone"
                      value={
                        personalForm.telephone
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Adresse
                    </label>

                    <input
                      type="text"
                      name="adresse"
                      value={
                        personalForm.adresse
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Résidence à Tana
                    </label>

                    <input
                      type="text"
                      name="residenceTana"
                      value={
                        personalForm.residenceTana
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              INFORMATIONS CIN
          ================================================== */}

          <div className={styles.card}>

            <div className={styles.cardHeader}>

              <h3>
                <FaIdCard />
                Informations CIN
              </h3>

            </div>

            {!editingPersonal ? (

              (hasValue(user.cin) ||
                hasValue(
                  user.cinDateDelivrance
                ) ||
                hasValue(
                  user.cinLieuDelivrance
                ) ||
                hasValue(user.cinFichier)) && (

                <div className={styles.infoGrid}>

                  {hasValue(user.cin) && (
                    <div className={styles.infoItem}>
                      <span>
                        Numéro CIN
                      </span>

                      <strong>
                        {user.cin}
                      </strong>
                    </div>
                  )}

                  {hasValue(
                    user.cinDateDelivrance
                  ) && (
                    <div className={styles.infoItem}>
                      <span>
                        Date de délivrance
                      </span>

                      <strong>
                        {formatDate(
                          user.cinDateDelivrance
                        )}
                      </strong>
                    </div>
                  )}

                  {hasValue(
                    user.cinLieuDelivrance
                  ) && (
                    <div className={styles.infoItem}>
                      <span>
                        Lieu de délivrance
                      </span>

                      <strong>
                        {
                          user.cinLieuDelivrance
                        }
                      </strong>
                    </div>
                  )}

                  {hasValue(
                    user.cinFichier
                  ) && (
                    <div className={styles.infoItem}>
                      <span>
                        Fichier CIN
                      </span>

                      <strong>
                        {getFileName(
                          user.cinFichier
                        )}
                      </strong>
                    </div>
                  )}

                </div>
              )

            ) : (

              <div className={styles.editForm}>

                <div className={styles.formGrid}>

                  <div className={styles.formGroup}>
                    <label>
                      Date de délivrance
                    </label>

                    <input
                      type="date"
                      name="cinDateDelivrance"
                      value={
                        personalForm.cinDateDelivrance
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Lieu de délivrance
                    </label>

                    <input
                      type="text"
                      name="cinLieuDelivrance"
                      value={
                        personalForm.cinLieuDelivrance
                      }
                      onChange={
                        handlePersonalChange
                      }
                    />
                  </div>

                </div>

                <p className={styles.editInfo}>
                  Le fichier CIN existant n'est pas
                  modifié depuis cette interface.
                </p>

              </div>
            )}

          </div>

          {/* =================================================
              DERNIER DIPLOME
          ================================================== */}

          {editingPersonal && (
            <div className={styles.card}>

              <div className={styles.editForm}>

                <div className={styles.formGrid}>

                  <div className={styles.formGroup}>
                    <label>
                      Dernier diplôme obtenu
                    </label>

                    <input
                      type="text"
                      name="dernierDiplomeObtenu"
                      value={
                        personalForm.dernierDiplomeObtenu
                      }
                      onChange={
                        handlePersonalChange
                      }
                      placeholder="Ex. Licence en informatique"
                    />
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              BOUTONS SAUVEGARDE PERSONNELLE
          ================================================== */}

          {editingPersonal && (
            <div className={styles.formActions}>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={
                  handleCancelPersonalEdit
                }
                disabled={savingPersonal}
              >
                <FaTimes />
                Annuler
              </button>

              <button
                type="button"
                className={styles.saveButton}
                onClick={
                  handleSavePersonal
                }
                disabled={savingPersonal}
              >
                <FaSave />

                {savingPersonal
                  ? "Enregistrement..."
                  : "Enregistrer"}
              </button>

            </div>
          )}

        </section>
      )}

      {/* =====================================================
          PARCOURS / CANDIDATURE
      ====================================================== */}

      {activeSection === "career" && (

        <section className={styles.section}>

          <div className={styles.card}>

            <div className={styles.cardHeader}>

              <h3>
                <FaGraduationCap />
                Informations de candidature
              </h3>

              {!editingCareer && (
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={
                    handleStartCareerEdit
                  }
                >
                  <FaEdit />
                  Modifier
                </button>
              )}

            </div>

            {!editingCareer ? (

              <div className={styles.infoGrid}>

                {hasValue(user.programmeNom) && (
                  <div className={styles.infoItem}>
                    <span>
                      Programme
                    </span>

                    <strong>
                      {user.programmeNom}
                    </strong>
                  </div>
                )}

                {hasValue(user.niveauEtudes) && (
                  <div className={styles.infoItem}>
                    <span>
                      Niveau d'études
                    </span>

                    <strong>
                      {formatNiveauEtudes(user.niveauEtudes)}
                    </strong>
                  </div>
                )}

                {hasValue(
                  user.dernierDiplomeObtenu
                ) && (
                  <div className={styles.infoItem}>
                    <span>
                      Dernier diplôme obtenu
                    </span>

                    <strong>
                      {
                        user.dernierDiplomeObtenu
                      }
                    </strong>
                  </div>
                )}

                {user.independanceFinanciere !==
                  null &&
                  user.independanceFinanciere !==
                    undefined && (
                    <div className={styles.infoItem}>
                      <span>
                        Indépendance financière
                      </span>

                      <strong>
                        {formatBoolean(
                          user.independanceFinanciere
                        )}
                      </strong>
                    </div>
                  )}

                {hasValue(
                  user.disponibiliteEngagment
                ) && (
                  <div className={styles.infoItem}>
                    <span>
                      Disponibilité / engagement
                    </span>

                    <strong>
                      {formatDisponibilite(
                        user.disponibiliteEngagment
                      )}
                    </strong>
                  </div>
                )}

                {hasValue(
                  user.dateDisponibilite
                ) && (
                  <div className={styles.infoItem}>
                    <span>
                      Date de disponibilité
                    </span>

                    <strong>
                      {formatDate(
                        user.dateDisponibilite
                      )}
                    </strong>
                  </div>
                )}

                {hasValue(
                  user.interetPoste
                ) && (
                  <div className={styles.infoItem}>
                    <span>
                      Intérêt pour le poste
                    </span>

                    <strong>
                      {user.interetPoste}
                    </strong>
                  </div>
                )}

                {hasValue(
                  user.niveauFrancais
                ) && (
                  <div className={styles.infoItem}>
                    <span>
                      Niveau de français
                    </span>

                    <strong>
                      {user.niveauFrancais}
                    </strong>
                  </div>
                )}

                {hasValue(
                  user.clareteOrale
                ) && (
                  <div className={styles.infoItem}>
                    <span>
                      Clarté orale
                    </span>

                    <strong>
                      {user.clareteOrale}
                    </strong>
                  </div>
                )}

                {hasValue(
                  user.comprehensionOrale
                ) && (
                  <div className={styles.infoItem}>
                    <span>
                      Compréhension orale
                    </span>

                    <strong>
                      {user.comprehensionOrale}
                    </strong>
                  </div>
                )}

                {hasValue(user.dateInfo) && (
                  <div className={styles.infoItem}>
                    <span>
                      Date de candidature
                    </span>

                    <strong>
                      {formatDateTime(
                        user.dateInfo
                      )}
                    </strong>
                  </div>
                )}

              </div>

            ) : (

              <div className={styles.editForm}>

                <div className={styles.formGrid}>

                  <div className={styles.formGroup}>
                    <label>
                      Programme
                    </label>

                    <select
                      name="idProgramme"
                      value={
                        careerForm.idProgramme
                      }
                      onChange={
                        handleCareerChange
                      }
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

                    <small>
                      Programme actuellement associé au candidat.
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Niveau d'études
                    </label>

                    <select
                      name="niveauEtudes"
                      value={
                        careerForm.niveauEtudes
                      }
                      onChange={
                        handleCareerChange
                      }
                    >
                      <option value="">
                        Sélectionner un niveau
                      </option>

                      {niveauEtudesOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Indépendance financière
                    </label>

                    <select
                      name="independanceFinanciere"
                      value={
                        careerForm.independanceFinanciere
                      }
                      onChange={
                        handleCareerChange
                      }
                    >
                      <option value="">
                        Non renseigné
                      </option>

                      <option value="true">
                        Oui
                      </option>

                      <option value="false">
                        Non
                      </option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Disponibilité / engagement
                    </label>

                    <select
                      name="disponibiliteEngagment"
                      value={
                        careerForm.disponibiliteEngagment
                      }
                      onChange={
                        handleCareerChange
                      }
                    >
                      <option value="">
                        Sélectionner une disponibilité
                      </option>

                      {disponibiliteOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Date de disponibilité
                    </label>

                    <input
                      type="date"
                      name="dateDisponibilite"
                      value={
                        careerForm.dateDisponibilite
                      }
                      onChange={
                        handleCareerChange
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Intérêt pour le poste
                    </label>

                    <select
                      name="interetPoste"
                      value={
                        careerForm.interetPoste
                      }
                      onChange={
                        handleCareerChange
                      }
                    >
                      <option value="">
                        Sélectionner un niveau
                      </option>

                      {careerForm.interetPoste &&
                        !interetPosteOptions.some(
                          (option) =>
                            option.value === careerForm.interetPoste
                        ) && (
                          <option value={careerForm.interetPoste}>
                            {careerForm.interetPoste}
                          </option>
                        )}

                      {interetPosteOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Niveau de français
                    </label>

                    <select
                      name="niveauFrancais"
                      value={
                        careerForm.niveauFrancais
                      }
                      onChange={
                        handleCareerChange
                      }
                    >
                      <option value="">
                        Sélectionner un niveau
                      </option>

                      {careerForm.niveauFrancais &&
                        !niveauFrancaisOptions.some(
                          (option) =>
                            option.value === careerForm.niveauFrancais
                        ) && (
                          <option value={careerForm.niveauFrancais}>
                            {careerForm.niveauFrancais}
                          </option>
                        )}

                      {niveauFrancaisOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Clarté orale
                    </label>

                    <select
                      name="clareteOrale"
                      value={
                        careerForm.clareteOrale
                      }
                      onChange={
                        handleCareerChange
                      }
                    >
                      <option value="">
                        Sélectionner une évaluation
                      </option>

                      {careerForm.clareteOrale &&
                        !oralEvaluationOptions.some(
                          (option) =>
                            option.value === careerForm.clareteOrale
                        ) && (
                          <option value={careerForm.clareteOrale}>
                            {careerForm.clareteOrale}
                          </option>
                        )}

                      {oralEvaluationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Compréhension orale
                    </label>

                    <select
                      name="comprehensionOrale"
                      value={
                        careerForm.comprehensionOrale
                      }
                      onChange={
                        handleCareerChange
                      }
                    >
                      <option value="">
                        Sélectionner une évaluation
                      </option>

                      {careerForm.comprehensionOrale &&
                        !oralEvaluationOptions.some(
                          (option) =>
                            option.value === careerForm.comprehensionOrale
                        ) && (
                          <option value={careerForm.comprehensionOrale}>
                            {careerForm.comprehensionOrale}
                          </option>
                        )}

                      {oralEvaluationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                DOCUMENTS
            ================================================== */}

            {(hasValue(user.cinFichier) ||
              hasValue(
                user.dernierDiplomeFichier
              ) ||
              hasValue(user.cvFichier)) && (

              <div className={styles.documentsList}>

                {hasValue(user.cinFichier) && (
                  <div className={styles.fileCard}>

                    <FaIdCard />

                    <div>
                      <span>
                        Copie CIN
                      </span>

                      <strong>
                        {user.cinFichier}
                      </strong>
                    </div>

                  </div>
                )}

                {hasValue(
                  user.dernierDiplomeFichier
                ) && (
                  <div className={styles.fileCard}>

                    <FaGraduationCap />

                    <div>
                      <span>
                        Dernier diplôme
                      </span>

                      <strong>
                        {
                          user.dernierDiplomeFichier
                        }
                      </strong>
                    </div>

                  </div>
                )}

                {hasValue(user.cvFichier) && (
                  <div className={styles.fileCard}>

                    <FaFileAlt />

                    <div>
                      <span>
                        CV
                      </span>

                      <strong>
                        {user.cvFichier}
                      </strong>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* =================================================
                SCORE
            ================================================== */}

            {!loadingScore &&
              !scoreError &&
              hasCandidateScore && (

                <div className={styles.scoreSection}>

                  <h4>
                    Score du candidat
                  </h4>

                  <div className={styles.scoreGrid}>

                    {hasScoreValue(
                      candidatScore.noteSkillMatching
                    ) && (

                      <div className={styles.scoreItem}>

                        <span>
                          Note au skill matching
                        </span>

                        <strong>
                          {
                            candidatScore.noteSkillMatching
                          }{" "}
                          / 52
                        </strong>

                      </div>
                    )}

                    {hasScoreValue(
                      candidatScore.notePrequalification
                    ) && (

                      <div className={styles.scoreItem}>

                        <span>
                          Note de préqualification
                        </span>

                        <strong>
                          {
                            candidatScore.notePrequalification
                          }{" "}
                          / 48
                        </strong>

                      </div>
                    )}

                  </div>

                </div>
              )}

          </div>

          {/* =================================================
              BOUTONS SAUVEGARDE PARCOURS
          ================================================== */}

          {editingCareer && (

            <div className={styles.formActions}>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={
                  handleCancelCareerEdit
                }
                disabled={savingCareer}
              >
                <FaTimes />
                Annuler
              </button>

              <button
                type="button"
                className={styles.saveButton}
                onClick={
                  handleSaveCareer
                }
                disabled={savingCareer}
              >
                <FaSave />

                {savingCareer
                  ? "Enregistrement..."
                  : "Enregistrer"}
              </button>

            </div>
          )}

        </section>
      )}

    </div>
  );
};

export default CandidatDetailsView;