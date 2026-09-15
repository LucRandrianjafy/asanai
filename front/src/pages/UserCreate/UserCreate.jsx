import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import styles from "./UserCreate.module.css";

import { getAllRoles } from "../../api/role";

const API_URL = import.meta.env.VITE_API_URL;

function UserCreate() {
  const navigate = useNavigate();

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [roles, setRoles] = useState([]);

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
  CHARGEMENT DES RÔLES
  =========================================================
  */

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      setError("");

      const rolesData = await getAllRoles();

      console.log("Rôles récupérés :", rolesData);

      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (err) {
      console.error("Erreur récupération rôles :", err);
      console.error(err.stack);

      setError(
        err.message || "Erreur lors de la récupération des rôles."
      );
    } finally {
      setLoadingRoles(false);
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
    navigate("/admin/users");
  };

  /*
  =========================================================
  CRÉER
  =========================================================
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.password || formData.password.trim() === "") {
      setError("Le mot de passe est obligatoire à la création.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const userData = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        cin: formData.cin,
        cinDateDelivrance: formData.cinDateDelivrance || null,
        cinLieuDelivrance: formData.cinLieuDelivrance,
        dateNaissance: formData.dateNaissance || null,
        dernierDiplomeObtenu: formData.dernierDiplomeObtenu,
        genre: formData.genre || null,

        residenceTana:
          formData.residenceTana === ""
            ? null
            : formData.residenceTana === "true",

        regionId:
          formData.regionId === "" ? null : Number(formData.regionId),

        roleId:
          formData.roleId === "" ? null : Number(formData.roleId),

        password: formData.password,
      };

      console.log("Données envoyées pour création :", userData);

      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let message = "Erreur lors de la création de l'utilisateur.";

        try {
          const errorData = await response.json();

          console.error("Réponse erreur création :", errorData);

          if (errorData?.message) {
            message = errorData.message;
          }
        } catch (jsonError) {
          console.error(
            "Impossible de lire la réponse d'erreur :",
            jsonError
          );
          console.error(jsonError.stack);
        }

        throw new Error(message);
      }

      let createdUser = null;

      try {
        createdUser = await response.json();
        console.log("Utilisateur créé :", createdUser);
      } catch (jsonError) {
        console.log("La réponse de création ne contient pas de JSON.");
      }

      setSuccess("Utilisateur créé avec succès.");

      setTimeout(() => {
        navigate("/admin/users");
      }, 800);
    } catch (err) {
      console.error("Erreur création utilisateur :", err);
      console.error(err.stack);

      setError(
        err.message || "Erreur lors de la création de l'utilisateur."
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

  if (loadingRoles) {
    return (
      <div className={styles.adminContainer}>
        <Sidebar />

        <div className={styles.mainContent}>
          <Header title="Créer un utilisateur" />

          <div className={styles.loadingContainer}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p>Chargement...</p>
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
        <Header title="Créer un utilisateur" />

        <div className={styles.content}>
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

              <h1 className={styles.title}>Créer un utilisateur</h1>

              <p className={styles.subtitle}>
                Renseignez les informations du nouvel utilisateur
              </p>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* INFORMATIONS PERSONNELLES */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <FaUser />
                <div>
                  <h2>Informations personnelles</h2>
                  <p>Identité et informations générales</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="prenom">Prénom</label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="nom">Nom</label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="dateNaissance">Date de naissance</label>
                  <div className={styles.inputIcon}>
                    <FaCalendarAlt />
                    <input
                      id="dateNaissance"
                      name="dateNaissance"
                      type="date"
                      value={formData.dateNaissance}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="genre">Genre</label>
                  <div className={styles.inputIcon}>
                    <FaVenusMars />
                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                    >
                      <option value="">Non renseigné</option>
                      <option value="H">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <FaPhone />
                <div>
                  <h2>Coordonnées</h2>
                  <p>Coordonnées et localisation</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
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

                <div className={styles.formGroup}>
                  <label htmlFor="telephone">Téléphone</label>
                  <div className={styles.inputIcon}>
                    <FaPhone />
                    <input
                      id="telephone"
                      name="telephone"
                      type="text"
                      value={formData.telephone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="adresse">Adresse</label>
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

                <div className={styles.formGroup}>
                  <label htmlFor="residenceTana">Résidence à Tana</label>
                  <div className={styles.inputIcon}>
                    <FaHome />
                    <select
                      id="residenceTana"
                      name="residenceTana"
                      value={formData.residenceTana}
                      onChange={handleChange}
                    >
                      <option value="">Non renseigné</option>
                      <option value="true">Oui</option>
                      <option value="false">Non</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="regionId">Région</label>
                  <div className={styles.inputIcon}>
                    <FaMapMarkedAlt />
                    <input
                      id="regionId"
                      name="regionId"
                      type="number"
                      min="1"
                      value={formData.regionId}
                      onChange={handleChange}
                      placeholder="ID de la région"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CIN */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <FaIdCard />
                <div>
                  <h2>Informations CIN</h2>
                  <p>Carte d'identité nationale</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="cin">Numéro CIN</label>
                  <input
                    id="cin"
                    name="cin"
                    type="text"
                    value={formData.cin}
                    onChange={handleChange}
                    maxLength="12"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cinDateDelivrance">
                    Date de délivrance
                  </label>
                  <input
                    id="cinDateDelivrance"
                    name="cinDateDelivrance"
                    type="date"
                    value={formData.cinDateDelivrance}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cinLieuDelivrance">
                    Lieu de délivrance
                  </label>
                  <input
                    id="cinLieuDelivrance"
                    name="cinLieuDelivrance"
                    type="text"
                    value={formData.cinLieuDelivrance}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* FORMATION */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <FaGraduationCap />
                <div>
                  <h2>Formation</h2>
                  <p>Dernier diplôme obtenu</p>
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
                    value={formData.dernierDiplomeObtenu}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* COMPTE */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <FaLock />
                <div>
                  <h2>Compte</h2>
                  <p>Rôle et mot de passe</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="roleId">Rôle</label>
                  <div className={styles.inputIcon}>
                    <FaLock />
                    <select
                      id="roleId"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner un rôle</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Mot de passe</label>
                  <div className={styles.inputIcon}>
                    <FaLock />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mot de passe de l'utilisateur"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <small>Obligatoire à la création du compte.</small>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
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
                {saving ? "Création..." : "Créer l'utilisateur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserCreate;