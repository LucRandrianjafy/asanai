import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaArrowLeft,
  FaSave,
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaVenusMars,
  FaHome,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaLock,
} from "react-icons/fa";

import Sidebar from "../../pages/Sidebar";
import Header from "../../component/Header/Header";

import styles from "./UserEdit.module.css";

import { getUserById } from "../../api/user";
import { getAllRoles } from "../../api/role";

const API_URL = import.meta.env.VITE_API_URL;

function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  =========================================================
  RÔLES
  =========================================================
  */

  const [roles, setRoles] = useState([]);

  /*
  =========================================================
  FORMULAIRE
  =========================================================
  */

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    cin: "",
    cinDateDelivrance: "",
    cinLieuDelivrance: "",
    dateNaissance: "",
    dernierDiplomeObtenu: "",
    genre: "",
    residenceTana: "",
    regionId: "",
    roleId: "",
    password: "",
  });

  /*
  =========================================================
  CHARGEMENT UTILISATEUR + RÔLES
  =========================================================
  */

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Récupération utilisateur pour modification, ID :",
        id
      );

      /*
      =====================================================
      RÉCUPÉRATION UTILISATEUR
      =====================================================
      */

      const userData = await getUserById(id);

      console.log(
        "Utilisateur à modifier :",
        userData
      );

      /*
      =====================================================
      RÉCUPÉRATION DES RÔLES
      =====================================================
      */

      const rolesData = await getAllRoles();

      console.log(
        "Rôles récupérés :",
        rolesData
      );

      setRoles(
        Array.isArray(rolesData)
          ? rolesData
          : []
      );

      /*
      =====================================================
      REMPLISSAGE DU FORMULAIRE
      =====================================================
      */

      setFormData({
        prenom: userData.prenom || "",
        nom: userData.nom || "",
        email: userData.email || "",
        telephone: userData.telephone || "",
        adresse: userData.adresse || "",
        cin: userData.cin || "",

        cinDateDelivrance:
          userData.cinDateDelivrance || "",

        cinLieuDelivrance:
          userData.cinLieuDelivrance || "",

        dateNaissance:
          userData.dateNaissance || "",

        dernierDiplomeObtenu:
          userData.dernierDiplomeObtenu || "",

        genre:
          userData.genre || "",

        residenceTana:
          userData.residenceTana === null ||
          userData.residenceTana === undefined
            ? ""
            : String(userData.residenceTana),

        regionId:
          userData.regionId === null ||
          userData.regionId === undefined
            ? ""
            : String(userData.regionId),

        roleId:
          userData.roleId === null ||
          userData.roleId === undefined
            ? ""
            : String(userData.roleId),

        /*
        =====================================================
        IMPORTANT :
        NE PAS RÉCUPÉRER LE MOT DE PASSE EXISTANT
        =====================================================
        */

        password: "",
      });

    } catch (err) {
      console.error(
        "Erreur récupération données pour modification :",
        err
      );

      console.error(err.stack);

      setError(
        err.message ||
          "Erreur lors de la récupération des données."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  CHANGEMENT INPUT
  =========================================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /*
  =========================================================
  RETOUR
  =========================================================
  */

  const handleBack = () => {
    navigate(`/admin/users/${id}`);
  };

  /*
  =========================================================
  ENREGISTRER
  =========================================================
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      /*
      =====================================================
      DONNÉES ENVOYÉES
      =====================================================
      */

      const userData = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        cin: formData.cin,

        cinDateDelivrance:
          formData.cinDateDelivrance || null,

        cinLieuDelivrance:
          formData.cinLieuDelivrance,

        dateNaissance:
          formData.dateNaissance || null,

        dernierDiplomeObtenu:
          formData.dernierDiplomeObtenu,

        genre:
          formData.genre || null,

        residenceTana:
          formData.residenceTana === ""
            ? null
            : formData.residenceTana === "true",

        regionId:
          formData.regionId === ""
            ? null
            : Number(formData.regionId),

        roleId:
          formData.roleId === ""
            ? null
            : Number(formData.roleId),
      };

      /*
      =====================================================
      MOT DE PASSE
      =====================================================
      */

      if (
        formData.password &&
        formData.password.trim() !== ""
      ) {
        userData.password =
          formData.password;
      }

      console.log(
        "Données envoyées pour modification :",
        userData
      );

      /*
      =====================================================
      PUT USER
      =====================================================
      */

      const response = await fetch(
        `${API_URL}/api/users/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(userData),
        }
      );

      /*
      =====================================================
      ERREUR API
      =====================================================
      */

      if (!response.ok) {
        let message =
          "Erreur lors de la modification de l'utilisateur.";

        try {
          const errorData =
            await response.json();

          console.error(
            "Réponse erreur modification :",
            errorData
          );

          if (errorData?.message) {
            message =
              errorData.message;
          }
        } catch (jsonError) {
          console.error(
            "Impossible de lire la réponse d'erreur :",
            jsonError
          );

          console.error(
            jsonError.stack
          );
        }

        throw new Error(message);
      }

      /*
      =====================================================
      RÉPONSE
      =====================================================
      */

      let updatedUser = null;

      try {
        updatedUser =
          await response.json();

        console.log(
          "Utilisateur modifié :",
          updatedUser
        );
      } catch (jsonError) {
        console.log(
          "La réponse de modification ne contient pas de JSON."
        );
      }

      /*
      =====================================================
      SUCCÈS
      =====================================================
      */

      setSuccess(
        "Utilisateur modifié avec succès."
      );

      /*
      =====================================================
      RETOUR PAGE VOIR
      =====================================================
      */

      setTimeout(() => {
        navigate(`/admin/users/${id}`);
      }, 800);

    } catch (err) {
      console.error(
        "Erreur modification utilisateur :",
        err
      );

      console.error(err.stack);

      setError(
        err.message ||
          "Erreur lors de la modification de l'utilisateur."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (loading) {
    return (
      <div className={styles.adminContainer}>

        <Sidebar />

        <div className={styles.mainContent}>

          <Header title="Modifier utilisateur" />

          <div className={styles.loadingContainer}>

            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Chargement...
              </span>
            </div>

            <p>
              Chargement de l'utilisateur...
            </p>

          </div>

        </div>

      </div>
    );
  }

  /*
  =========================================================
  PAGE
  =========================================================
  */

  return (
    <div className={styles.adminContainer}>

      <Sidebar />

      <div className={styles.mainContent}>

        <Header title="Modifier utilisateur" />

        <div className={styles.content}>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className={styles.pageHeader}>

            <div>

              <button
                type="button"
                className={styles.backButton}
                onClick={handleBack}
              >
                <FaArrowLeft />
                Retour
              </button>

              <h1 className={styles.title}>
                Modifier l'utilisateur
              </h1>

              <p className={styles.subtitle}>
                Modification des informations de
                l'utilisateur #{id}
              </p>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* =================================================
              FORMULAIRE
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >

            {/* =================================================
                INFORMATIONS PERSONNELLES
            ================================================= */}

            <div className={styles.sectionCard}>

              <div className={styles.sectionHeader}>

                <FaUser />

                <div>

                  <h2>
                    Informations personnelles
                  </h2>

                  <p>
                    Identité et informations générales
                  </p>

                </div>

              </div>

              <div className={styles.formGrid}>

                {/* PRÉNOM */}

                <div className={styles.formGroup}>

                  <label htmlFor="prenom">
                    Prénom
                  </label>

                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* NOM */}

                <div className={styles.formGroup}>

                  <label htmlFor="nom">
                    Nom
                  </label>

                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* DATE NAISSANCE */}

                <div className={styles.formGroup}>

                  <label htmlFor="dateNaissance">
                    Date de naissance
                  </label>

                  <div className={styles.inputIcon}>

                    <FaCalendarAlt />

                    <input
                      id="dateNaissance"
                      name="dateNaissance"
                      type="date"
                      value={
                        formData.dateNaissance
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* GENRE */}

                <div className={styles.formGroup}>

                  <label htmlFor="genre">
                    Genre
                  </label>

                  <div className={styles.inputIcon}>

                    <FaVenusMars />

                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                    >

                      <option value="">
                        Non renseigné
                      </option>

                      <option value="H">
                        Masculin
                      </option>

                      <option value="F">
                        Féminin
                      </option>

                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                CONTACT
            ================================================= */}

            <div className={styles.sectionCard}>

              <div className={styles.sectionHeader}>

                <FaPhone />

                <div>

                  <h2>
                    Coordonnées
                  </h2>

                  <p>
                    Coordonnées et localisation
                  </p>

                </div>

              </div>

              <div className={styles.formGrid}>

                {/* EMAIL */}

                <div className={styles.formGroup}>

                  <label htmlFor="email">
                    Email
                  </label>

                  <div className={styles.inputIcon}>

                    <FaEnvelope />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* TÉLÉPHONE */}

                <div className={styles.formGroup}>

                  <label htmlFor="telephone">
                    Téléphone
                  </label>

                  <div className={styles.inputIcon}>

                    <FaPhone />

                    <input
                      id="telephone"
                      name="telephone"
                      type="text"
                      value={
                        formData.telephone
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* ADRESSE */}

                <div className={styles.formGroup}>

                  <label htmlFor="adresse">
                    Adresse
                  </label>

                  <div className={styles.inputIcon}>

                    <FaMapMarkerAlt />

                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={formData.adresse}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* RÉSIDENCE TANA */}

                <div className={styles.formGroup}>

                  <label htmlFor="residenceTana">
                    Résidence à Tana
                  </label>

                  <div className={styles.inputIcon}>

                    <FaHome />

                    <select
                      id="residenceTana"
                      name="residenceTana"
                      value={
                        formData.residenceTana
                      }
                      onChange={handleChange}
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

                </div>

                {/* RÉGION */}

                <div className={styles.formGroup}>

                  <label htmlFor="regionId">
                    Région
                  </label>

                  <div className={styles.inputIcon}>

                    <FaMapMarkedAlt />

                    <input
                      id="regionId"
                      name="regionId"
                      type="number"
                      min="1"
                      value={
                        formData.regionId
                      }
                      onChange={handleChange}
                      placeholder="ID de la région"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                CIN
            ================================================= */}

            <div className={styles.sectionCard}>

              <div className={styles.sectionHeader}>

                <FaIdCard />

                <div>

                  <h2>
                    Informations CIN
                  </h2>

                  <p>
                    Carte d'identité nationale
                  </p>

                </div>

              </div>

              <div className={styles.formGrid}>

                {/* CIN */}

                <div className={styles.formGroup}>

                  <label htmlFor="cin">
                    Numéro CIN
                  </label>

                  <input
                    id="cin"
                    name="cin"
                    type="text"
                    value={formData.cin}
                    onChange={handleChange}
                    maxLength="12"
                  />

                </div>

                {/* DATE DÉLIVRANCE */}

                <div className={styles.formGroup}>

                  <label htmlFor="cinDateDelivrance">
                    Date de délivrance
                  </label>

                  <input
                    id="cinDateDelivrance"
                    name="cinDateDelivrance"
                    type="date"
                    value={
                      formData.cinDateDelivrance
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* LIEU DÉLIVRANCE */}

                <div className={styles.formGroup}>

                  <label htmlFor="cinLieuDelivrance">
                    Lieu de délivrance
                  </label>

                  <input
                    id="cinLieuDelivrance"
                    name="cinLieuDelivrance"
                    type="text"
                    value={
                      formData.cinLieuDelivrance
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                FORMATION
            ================================================= */}

            <div className={styles.sectionCard}>

              <div className={styles.sectionHeader}>

                <FaGraduationCap />

                <div>

                  <h2>
                    Formation
                  </h2>

                  <p>
                    Dernier diplôme obtenu
                  </p>

                </div>

              </div>

              <div className={styles.formGrid}>

                <div className={styles.formGroup}>

                  <label htmlFor="dernierDiplomeObtenu">
                    Dernier diplôme obtenu
                  </label>

                  <input
                    id="dernierDiplomeObtenu"
                    name="dernierDiplomeObtenu"
                    type="text"
                    value={
                      formData.dernierDiplomeObtenu
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                COMPTE
            ================================================= */}

            <div className={styles.sectionCard}>

              <div className={styles.sectionHeader}>

                <FaLock />

                <div>

                  <h2>
                    Compte
                  </h2>

                  <p>
                    Rôle et mot de passe
                  </p>

                </div>

              </div>

              <div className={styles.formGrid}>

                {/* =================================================
                    RÔLE
                ================================================= */}

                <div className={styles.formGroup}>

                  <label htmlFor="roleId">
                    Rôle
                  </label>

                  <div className={styles.inputIcon}>

                    <FaLock />

                    <select
                      id="roleId"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleChange}
                    >

                      <option value="">
                        Sélectionner un rôle
                      </option>

                      {roles.map((role) => (

                        <option
                          key={role.id}
                          value={role.id}
                        >
                          {role.nom}
                        </option>

                      ))}

                    </select>

                  </div>

                </div>

                {/* =================================================
                    MOT DE PASSE
                ================================================= */}

                <div className={styles.formGroup}>

                  <label htmlFor="password">
                    Nouveau mot de passe
                  </label>

                  <div className={styles.inputIcon}>

                    <FaLock />

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Laisser vide pour conserver l'actuel"
                      autoComplete="new-password"
                    />

                  </div>

                  <small>
                    Laissez ce champ vide si vous ne
                    souhaitez pas modifier le mot de
                    passe.
                  </small>

                </div>

              </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className={styles.formActions}>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleBack}
                disabled={saving}
              >
                Annuler
              </button>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >

                <FaSave />

                {saving
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default UserEdit;