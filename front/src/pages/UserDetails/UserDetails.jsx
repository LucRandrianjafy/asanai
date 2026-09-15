import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaArrowLeft,
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaVenusMars,
  FaHome,
  FaEdit,
  FaCalendarAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";

import Sidebar from "../../pages/Sidebar";
import Header from "../../component/Header/Header";

import styles from "./UserDetails.module.css";

import { getUserById } from "../../api/user";
import { getAllRoles } from "../../api/role";

function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  =========================================================
  CHARGEMENT DE L'UTILISATEUR ET DES ROLES
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
        "Récupération de l'utilisateur avec ID :",
        id
      );

      /*
      =====================================================
      RÉCUPÉRATION DE L'UTILISATEUR
      =====================================================
      */

      const userData = await getUserById(id);

      console.log(
        "Utilisateur récupéré :",
        userData
      );

      /*
      =====================================================
      RÉCUPÉRATION DE TOUS LES RÔLES
      =====================================================
      */

      const rolesData = await getAllRoles();

      console.log(
        "Rôles récupérés :",
        rolesData
      );

      setUser(userData);

      setRoles(
        Array.isArray(rolesData)
          ? rolesData
          : []
      );

    } catch (err) {
      console.error(
        "Erreur récupération utilisateur :",
        err
      );

      console.error(err.stack);

      setError(
        err.message ||
          "Erreur lors de la récupération de l'utilisateur."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  FORMAT DATE
  =========================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "Non renseignée";
    }

    try {
      return new Date(date).toLocaleDateString(
        "fr-FR"
      );
    } catch (err) {
      console.error(
        "Erreur formatage date :",
        err
      );

      console.error(err.stack);

      return date;
    }
  };

  /*
  =========================================================
  GENRE
  =========================================================
  */

  const getGenre = () => {
    if (!user?.genre) {
      return "Non renseigné";
    }

    if (
      user.genre === "M" ||
      user.genre === "H" ||
      user.genre === "Masculin"
    ) {
      return "Masculin";
    }

    if (
      user.genre === "F" ||
      user.genre === "Féminin"
    ) {
      return "Féminin";
    }

    return user.genre;
  };

  /*
  =========================================================
  RESIDENCE TANA
  =========================================================
  */

  const getResidenceTana = () => {
    if (
      user?.residenceTana === null ||
      user?.residenceTana === undefined ||
      user?.residenceTana === ""
    ) {
      return "Non renseignée";
    }

    if (
      user.residenceTana === true ||
      user.residenceTana === "true"
    ) {
      return "Oui";
    }

    if (
      user.residenceTana === false ||
      user.residenceTana === "false"
    ) {
      return "Non";
    }

    return user.residenceTana;
  };

  /*
  =========================================================
  ROLE
  =========================================================
  */

  const getRole = () => {
    /*
    Si le backend retourne déjà directement le nom
    du rôle, on l'utilise.
    */

    if (user?.roleNom) {
      return user.roleNom;
    }

    /*
    Si le backend retourne un objet role :
    {
      role: {
        id: 1,
        nom: "Administrateur"
      }
    }
    */

    if (user?.role?.nom) {
      return user.role.nom;
    }

    /*
    Sinon, on cherche le rôle dans la liste récupérée
    avec getAllRoles().
    */

    if (
      user?.roleId !== null &&
      user?.roleId !== undefined
    ) {
      const role = roles.find(
        (item) =>
          Number(item.id) ===
          Number(user.roleId)
      );

      if (role) {
        return role.nom;
      }

      /*
      Si aucun rôle correspondant n'est trouvé,
      on affiche l'identifiant pour éviter une
      erreur silencieuse.
      */

      return `Rôle ${user.roleId}`;
    }

    return "Non renseigné";
  };

  /*
  =========================================================
  RÉGION
  =========================================================
  */

  const getRegion = () => {
    if (
      user?.regionNom
    ) {
      return user.regionNom;
    }

    if (
      user?.region?.nom
    ) {
      return user.region.nom;
    }

    if (
      user?.regionId !== null &&
      user?.regionId !== undefined
    ) {
      return `Région ${user.regionId}`;
    }

    return "Non renseignée";
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
  MODIFIER
  =========================================================
  */

  const handleModifier = () => {
    navigate(`/admin/users/${id}/edit`);
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
          <Header title="Utilisateur" />

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
  ERROR
  =========================================================
  */

  if (error || !user) {
    return (
      <div className={styles.adminContainer}>
        <Sidebar />

        <div className={styles.mainContent}>
          <Header title="Utilisateur" />

          <div className={styles.content}>

            <button
              type="button"
              className={styles.backButton}
              onClick={handleBack}
            >
              <FaArrowLeft />
              Retour aux utilisateurs
            </button>

            <div className="alert alert-danger">
              {error ||
                "Utilisateur introuvable."}
            </div>

          </div>
        </div>
      </div>
    );
  }

  /*
  =========================================================
  AFFICHAGE
  =========================================================
  */

  const initials =
    `${user.prenom?.charAt(0) || ""}${user.nom?.charAt(0) || ""}`
      .toUpperCase();

  return (
    <div className={styles.adminContainer}>
      <Sidebar />

      <div className={styles.mainContent}>
        <Header title="Utilisateur" />

        <div className={styles.content}>

          {/* HEADER */}

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

              <div className={styles.titleBlock}>
                <div className={styles.avatar}>
                  {initials || "U"}
                </div>

                <div>
                  <h1 className={styles.title}>
                    {user.prenom} {user.nom}
                  </h1>

                  <p className={styles.subtitle}>
                    Informations de l'utilisateur
                    #{user.id}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={styles.editButton}
              onClick={handleModifier}
            >
              <FaEdit />
              Modifier
            </button>

          </div>

          {/* IDENTITE */}

          <div className={styles.sectionCard}>

            <div className={styles.sectionHeader}>
              <FaUser />

              <div>
                <h2>
                  Informations personnelles
                </h2>

                <p>
                  Informations générales de
                  l'utilisateur
                </p>
              </div>
            </div>

            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Prénom
                </span>

                <span className={styles.value}>
                  {user.prenom ||
                    "Non renseigné"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Nom
                </span>

                <span className={styles.value}>
                  {user.nom ||
                    "Non renseigné"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Date de naissance
                </span>

                <span className={styles.value}>
                  <FaCalendarAlt />
                  {formatDate(
                    user.dateNaissance
                  )}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Genre
                </span>

                <span className={styles.value}>
                  <FaVenusMars />
                  {getGenre()}
                </span>
              </div>

            </div>

          </div>

          {/* CONTACT */}

          <div className={styles.sectionCard}>

            <div className={styles.sectionHeader}>
              <FaPhone />

              <div>
                <h2>
                  Coordonnées
                </h2>

                <p>
                  Informations de contact et
                  localisation
                </p>
              </div>
            </div>

            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Email
                </span>

                <span className={styles.value}>
                  <FaEnvelope />
                  {user.email ||
                    "Non renseigné"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Téléphone
                </span>

                <span className={styles.value}>
                  <FaPhone />
                  {user.telephone ||
                    "Non renseigné"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Adresse
                </span>

                <span className={styles.value}>
                  <FaMapMarkerAlt />
                  {user.adresse ||
                    "Non renseignée"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Résidence à Tana
                </span>

                <span className={styles.value}>
                  <FaHome />
                  {getResidenceTana()}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Région
                </span>

                <span className={styles.value}>
                  <FaMapMarkedAlt />
                  {getRegion()}
                </span>
              </div>

            </div>

          </div>

          {/* CIN */}

          <div className={styles.sectionCard}>

            <div className={styles.sectionHeader}>
              <FaIdCard />

              <div>
                <h2>
                  Informations CIN
                </h2>

                <p>
                  Informations liées à la carte
                  d'identité nationale
                </p>
              </div>
            </div>

            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Numéro CIN
                </span>

                <span className={styles.value}>
                  {user.cin ||
                    "Non renseigné"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Date de délivrance
                </span>

                <span className={styles.value}>
                  {formatDate(
                    user.cinDateDelivrance
                  )}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Lieu de délivrance
                </span>

                <span className={styles.value}>
                  {user.cinLieuDelivrance ||
                    "Non renseigné"}
                </span>
              </div>

            </div>

          </div>

          {/* ETUDES */}

          <div className={styles.sectionCard}>

            <div className={styles.sectionHeader}>
              <FaGraduationCap />

              <div>
                <h2>
                  Formation
                </h2>

                <p>
                  Informations sur le dernier
                  diplôme obtenu
                </p>
              </div>
            </div>

            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Dernier diplôme obtenu
                </span>

                <span className={styles.value}>
                  {user.dernierDiplomeObtenu ||
                    "Non renseigné"}
                </span>
              </div>

            </div>

          </div>

          {/* SYSTEME */}

          <div className={styles.sectionCard}>

            <div className={styles.sectionHeader}>
              <FaUser />

              <div>
                <h2>
                  Informations système
                </h2>

                <p>
                  Informations liées au compte
                </p>
              </div>
            </div>

            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Identifiant
                </span>

                <span className={styles.value}>
                  {user.id}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Rôle
                </span>

                <span className={styles.roleBadge}>
                  {getRole()}
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDetails;