import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaUser,
  FaSearch,
  FaEllipsisV,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

import styles from "./Users.module.css";

import Sidebar from "../../pages/Sidebar";
import Header from "../../component/Header/Header";

import { getAllUsers } from "../../api/user";
import { getRoleById } from "../../api/role";

const API_URL = import.meta.env.VITE_API_URL;

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* =========================================================
     CHARGEMENT DES UTILISATEURS
  ========================================================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================================================
     FERMETURE DU MENU
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /* =========================================================
     GET ALL USERS + GET ROLES
  ========================================================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      /* =====================================================
         RÉCUPÉRATION DES UTILISATEURS
      ===================================================== */

      const data = await getAllUsers();

      console.log("Utilisateurs récupérés :", data);

      const usersData = Array.isArray(data) ? data : [];

      setUsers(usersData);

      /* =====================================================
         RÉCUPÉRATION DES IDS DES RÔLES
      ===================================================== */

      const roleIds = [
        ...new Set(
          usersData
            .map((user) => user.roleId)
            .filter(
              (id) =>
                id !== null &&
                id !== undefined
            )
        ),
      ];

      console.log("IDs des rôles :", roleIds);

      /* =====================================================
         RÉCUPÉRATION DES RÔLES
      ===================================================== */

      const rolesData = {};

      await Promise.all(
        roleIds.map(async (roleId) => {
          try {
            const role = await getRoleById(roleId);

            console.log(
              `Rôle récupéré pour l'ID ${roleId} :`,
              role
            );

            rolesData[roleId] = role;
          } catch (roleError) {
            console.error(
              `Erreur lors de la récupération du rôle ${roleId} :`,
              roleError
            );

            console.error(roleError.stack);
          }
        })
      );

      console.log("Rôles chargés :", rolesData);

      setRoles(rolesData);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des utilisateurs :",
        err
      );

      console.error(err.stack);

      setError(
        err.message ||
          "Erreur lors de la récupération des utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FONCTIONS POUR LES CHAMPS
  ========================================================= */

  const getUserId = (user) => {
    return user.id;
  };

  const getFirstname = (user) => {
    return user.prenom || "";
  };

  const getLastname = (user) => {
    return user.nom || "";
  };

  const getEmail = (user) => {
    return user.email || "";
  };

  const getPhone = (user) => {
    return user.telephone || "";
  };

  /* =========================================================
     RÉCUPÉRER LE NOM DU RÔLE
  ========================================================= */

  const getRole = (user) => {
    /* ---------------------------------------------------------
       CAS 1 : L'API utilisateur renvoie directement roleNom
    --------------------------------------------------------- */

    if (user.roleNom) {
      return user.roleNom;
    }

    /* ---------------------------------------------------------
       CAS 2 : L'API renvoie un objet role
    --------------------------------------------------------- */

    if (user.role?.nom) {
      return user.role.nom;
    }

    /* ---------------------------------------------------------
       CAS 3 : On utilise roleId pour chercher le rôle
    --------------------------------------------------------- */

    if (
      user.roleId !== null &&
      user.roleId !== undefined
    ) {
      const role = roles[user.roleId];

      /* -------------------------------------------------------
         Si le rôle contient "nom"
      ------------------------------------------------------- */

      if (role?.nom) {
        return role.nom;
      }

      /* -------------------------------------------------------
         Si l'API utilise "name" au lieu de "nom"
      ------------------------------------------------------- */

      if (role?.name) {
        return role.name;
      }

      /* -------------------------------------------------------
         Si le rôle n'est pas encore disponible
      ------------------------------------------------------- */

      return `Rôle ${user.roleId}`;
    }

    return "Non renseigné";
  };

  /* =========================================================
     INITIALES
  ========================================================= */

  const getInitials = (user) => {
    const prenom = getFirstname(user);
    const nom = getLastname(user);

    const first = prenom
      ? prenom.charAt(0).toUpperCase()
      : "";

    const last = nom
      ? nom.charAt(0).toUpperCase()
      : "";

    return `${first}${last}` || "U";
  };

  /* =========================================================
     RECHERCHE
  ========================================================= */

  const filteredUsers = users.filter((user) => {
    const prenom = getFirstname(user);
    const nom = getLastname(user);
    const email = getEmail(user);
    const telephone = getPhone(user);
    const cin = user.cin || "";
    const role = getRole(user);

    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return true;
    }

    const fullName =
      `${prenom} ${nom}`.toLowerCase();

    return (
      fullName.includes(search) ||
      prenom.toLowerCase().includes(search) ||
      nom.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search) ||
      telephone.toLowerCase().includes(search) ||
      cin.toLowerCase().includes(search) ||
      role.toLowerCase().includes(search)
    );
  });

  /* =========================================================
     CRÉER
  ========================================================= */

  const handleCreate = () => {
    navigate("/admin/users/create");
  };

  /* =========================================================
     VOIR
  ========================================================= */

  const handleVoir = (event, user) => {
    event.stopPropagation();

    setOpenMenuId(null);

    const id = user.id;

    console.log(
      "Ouverture de la page utilisateur, ID :",
      id
    );

    navigate(`/admin/users/${id}`);
  };

  /* =========================================================
     MODIFIER
  ========================================================= */

  const handleModifier = (event, user) => {
    event.stopPropagation();

    setOpenMenuId(null);

    const id = user.id;

    console.log(
      "Ouverture de la modification utilisateur, ID :",
      id
    );

    navigate(`/admin/users/${id}/edit`);
  };

  /* =========================================================
     SUPPRIMER
  ========================================================= */

  const handleSupprimer = async (event, user) => {
    event.stopPropagation();

    setOpenMenuId(null);

    const id = user.id;

    const fullName =
      `${user.prenom || ""} ${user.nom || ""}`.trim() ||
      "cet utilisateur";

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer ${fullName} ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const token = localStorage.getItem("token");

      console.log(
        "Suppression de l'utilisateur :",
        id
      );

      const response = await fetch(
        `${API_URL}/api/users/${id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message =
          "Erreur lors de la suppression de l'utilisateur.";

        try {
          const errorData = await response.json();

          if (errorData?.message) {
            message = errorData.message;
          }
        } catch (jsonError) {
          console.error(
            "Erreur lecture réponse suppression :",
            jsonError
          );

          console.error(jsonError.stack);
        }

        throw new Error(message);
      }

      /* -------------------------------------------------------
         Suppression de l'utilisateur de la liste
      ------------------------------------------------------- */

      setUsers((previousUsers) =>
        previousUsers.filter(
          (item) => item.id !== id
        )
      );

      console.log(
        "Utilisateur supprimé avec succès :",
        id
      );
    } catch (err) {
      console.error(
        "Erreur lors de la suppression :",
        err
      );

      console.error(err.stack);

      setError(
        err.message ||
          "Erreur lors de la suppression de l'utilisateur."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     MENU
  ========================================================= */

  const handleMenuClick = (event, userId) => {
    event.stopPropagation();

    setOpenMenuId(
      openMenuId === userId
        ? null
        : userId
    );
  };

  /* =========================================================
     CLIC LIGNE
  ========================================================= */

  const handleUserClick = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className={styles.adminContainer}>

      <Sidebar />

      <div className={styles.mainContent}>

        <Header title="Utilisateurs" />

        <div className={styles.content}>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className={styles.pageHeader}>

            {/* GAUCHE : TITRE ET SOUS-TITRE */}
            <div className={styles.pageHeaderText}>

              <h1 className={styles.title}>
                Gestion des utilisateurs
              </h1>

              <p className={styles.subtitle}>
                Consultez et gérez les utilisateurs
                de l'application
              </p>

            </div>

            {/* DROITE : RECHERCHE + CRÉER */}
            <div className={styles.headerActions}>

              <div className={styles.searchContainer}>

                <FaSearch />

                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />

              </div>

              <button
                type="button"
                className={styles.createButton}
                onClick={handleCreate}
              >
                <FaPlus />

                <span>
                  Créer un utilisateur
                </span>
              </button>

            </div>

          </div>

          {/* =================================================
              STATISTIQUES
          ================================================= */}

          <div className={styles.statsContainer}>

            <div className={styles.statCard}>

              <div className={styles.statIcon}>
                <FaUsers />
              </div>

              <div>

                <div className={styles.statValue}>
                  {users.length}
                </div>

                <div className={styles.statLabel}>
                  Utilisateurs
                </div>

              </div>

            </div>

            <div className={styles.statCard}>

              <div className={styles.statIcon}>
                <FaUser />
              </div>

              <div>

                <div className={styles.statValue}>
                  {filteredUsers.length}
                </div>

                <div className={styles.statLabel}>
                  Résultats affichés
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

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
                Chargement des utilisateurs...
              </p>

            </div>

          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (

            <div className={styles.errorContainer}>

              <div className="alert alert-danger">
                {error}
              </div>

              <button
                type="button"
                className={styles.retryButton}
                onClick={fetchUsers}
              >
                Réessayer
              </button>

            </div>

          )}

          {/* =================================================
              TABLE
          ================================================= */}

          {!loading && !error && (

            <div className={styles.tableContainer}>

              <table
                className={`table ${styles.usersTable}`}
              >

                <thead>

                  <tr>
                    <th>Utilisateur</th>
                    <th>CIN</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className={styles.empty}
                      >
                        {searchTerm
                          ? "Aucun utilisateur ne correspond à votre recherche."
                          : "Aucun utilisateur trouvé."}
                      </td>

                    </tr>

                  ) : (

                    filteredUsers.map((user) => {

                      const id = getUserId(user);

                      return (

                        <tr
                          key={id}
                          className={styles.userRow}
                          onClick={() =>
                            handleUserClick(user)
                          }
                        >

                          {/* =================================================
                              UTILISATEUR
                          ================================================= */}

                          <td>

                            <div
                              className={
                                styles.userInfo
                              }
                            >

                              <div
                                className={
                                  styles.avatar
                                }
                              >
                                {getInitials(user)}
                              </div>

                              <div>

                                <button
                                  type="button"
                                  className={
                                    styles.userName
                                  }
                                  onClick={(event) =>
                                    handleVoir(
                                      event,
                                      user
                                    )
                                  }
                                >
                                  {user.prenom}{" "}
                                  {user.nom}
                                </button>

                                <div
                                  className={
                                    styles.userId
                                  }
                                >
                                  ID : {user.id}
                                </div>

                              </div>

                            </div>

                          </td>

                          {/* =================================================
                              CIN
                          ================================================= */}

                          <td>

                            <span
                              className={
                                styles.cin
                              }
                            >
                              {user.cin ||
                                "Non renseigné"}
                            </span>

                          </td>

                          {/* =================================================
                              EMAIL
                          ================================================= */}

                          <td>

                            <span
                              className={
                                styles.email
                              }
                            >
                              {user.email ||
                                "Non renseigné"}
                            </span>

                          </td>

                          {/* =================================================
                              TELEPHONE
                          ================================================= */}

                          <td>

                            <span
                              className={
                                styles.phone
                              }
                            >
                              {user.telephone ||
                                "Non renseigné"}
                            </span>

                          </td>

                          {/* =================================================
                              ROLE
                          ================================================= */}

                          <td>

                            <span
                              className={
                                styles.roleBadge
                              }
                            >
                              {getRole(user)}
                            </span>

                          </td>

                          {/* =================================================
                              ACTION
                          ================================================= */}

                          <td>

                            <div
                              className={
                                styles.actionContainer
                              }
                            >

                              <button
                                type="button"
                                className={
                                  styles.actionButton
                                }
                                onClick={(event) =>
                                  handleMenuClick(
                                    event,
                                    id
                                  )
                                }
                                aria-label="Actions"
                              >
                                <FaEllipsisV />
                              </button>

                              {openMenuId === id && (

                                <div
                                  className={
                                    styles.actionMenu
                                  }
                                  onClick={(event) =>
                                    event.stopPropagation()
                                  }
                                >

                                  {/* VOIR */}

                                  <button
                                    type="button"
                                    onClick={(event) =>
                                      handleVoir(
                                        event,
                                        user
                                      )
                                    }
                                  >
                                    <FaEye />

                                    <span>
                                      Voir
                                    </span>
                                  </button>

                                  {/* MODIFIER */}

                                  <button
                                    type="button"
                                    onClick={(event) =>
                                      handleModifier(
                                        event,
                                        user
                                      )
                                    }
                                  >
                                    <FaEdit />

                                    <span>
                                      Modifier
                                    </span>
                                  </button>

                                  {/* SUPPRIMER */}

                                  <button
                                    type="button"
                                    className={
                                      styles.deleteAction
                                    }
                                    disabled={
                                      deletingId === id
                                    }
                                    onClick={(event) =>
                                      handleSupprimer(
                                        event,
                                        user
                                      )
                                    }
                                  >

                                    <FaTrash />

                                    <span>
                                      {deletingId === id
                                        ? "Suppression..."
                                        : "Supprimer"}
                                    </span>

                                  </button>

                                </div>

                              )}

                            </div>

                          </td>

                        </tr>

                      );

                    })

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Users;