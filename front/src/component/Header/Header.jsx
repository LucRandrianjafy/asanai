import React, { useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";

import styles from "./Header.module.css";

const Header = ({
  title = "",
  showSearch = true,
}) => {

  /* =========================================================
     DONNÉES STATIQUES POUR TEST FRONT
  ========================================================= */

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      description: "Bienvenue sur votre espace utilisateur.",
      dateNotif: new Date(
        Date.now() - 5 * 60 * 1000
      ).toISOString(),
      isRead: false,
    },
    {
      id: 2,
      description: "Votre profil a été créé avec succès.",
      dateNotif: new Date(
        Date.now() - 60 * 60 * 1000
      ).toISOString(),
      isRead: false,
    },
    {
      id: 3,
      description: "Une nouvelle information est disponible.",
      dateNotif: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(),
      isRead: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  /* =========================================================
     UTILISATEUR CONNECTÉ
  ========================================================= */

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : {};
    } catch (error) {
      console.error(
        "Erreur lors de la lecture de l'utilisateur connecté :",
        error
      );

      return {};
    }
  });

  /* =========================================================
     NOMBRE DE NOTIFICATIONS NON LUES
  ========================================================= */

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  /* =========================================================
     OUVRIR LES NOTIFICATIONS
  ========================================================= */

  const handleBellClick = () => {
    setShowModal(true);
  };

  /* =========================================================
     FERMER LES NOTIFICATIONS
  ========================================================= */

  const handleClose = () => {
    setShowModal(false);
  };

  /* =========================================================
     MARQUER COMME LUE
     FRONT UNIQUEMENT
  ========================================================= */

  const handleNotificationClick = (notif) => {
    if (!notif) return;

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === notif.id
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );
  };

  /* =========================================================
     DATE RELATIVE
  ========================================================= */

  const timeAgo = (isoDate) => {
    if (!isoDate) return "";

    const then = new Date(isoDate).getTime();

    if (isNaN(then)) return "";

    const seconds = Math.floor(
      (Date.now() - then) / 1000
    );

    if (seconds < 60) {
      return `Il y a ${seconds} seconde${
        seconds > 1 ? "s" : ""
      }`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `Il y a ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `Il y a ${hours} heure${
        hours > 1 ? "s" : ""
      }`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `Il y a ${days} jour${
        days > 1 ? "s" : ""
      }`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return `Il y a ${months} mois`;
    }

    const years = Math.floor(months / 12);

    return `Il y a ${years} an${
      years > 1 ? "s" : ""
    }`;
  };

  /* =========================================================
     EMAIL AFFICHÉ
  ========================================================= */

  const getDisplayEmail = (email) => {
    if (!email) {
      return "Utilisateur";
    }

    return email.length > 20
      ? `${email.slice(0, 20)}...`
      : email;
  };

  const getDisplayName = (currentUser) => {
    const firstName =
      currentUser?.prenom ??
      currentUser?.firstname ??
      "";

    const lastName =
      currentUser?.nom ??
      currentUser?.lastname ??
      "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || getDisplayEmail(currentUser?.email);
  };

  /* =========================================================
     RÔLE
  ========================================================= */

  const mapRole = (role) => {
    if (typeof role === "string") {
      const normalizedRole = role.toLowerCase();

      if (normalizedRole === "admin" || normalizedRole === "administrateur") {
        return "Administrateur";
      }

      if (normalizedRole === "manager") {
        return "Manager";
      }

      if (normalizedRole === "gestionnaire") {
        return "Gestionnaire";
      }
    }

    if (role === 1) {
      return "Administrateur";
    }

    if (role === 2) {
      return "Manager";
    }

    if (role === 3) {
      return "Gestionnaire";
    }

    return "Utilisateur";
  };

  /* =========================================================
     PROFIL
  ========================================================= */

  const handleUserProfileClick = () => {
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className={styles.header}>
        <div className={styles.headerContent}>

          {/* TITLE */}

          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>
              {title}
            </h1>
          </div>

          {/* ACTIONS */}

          <div className={styles.actionsSection}>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <button
              className={styles.iconBtn}
              aria-label={`Notifications (${unreadCount} non-lues)`}
              onClick={handleBellClick}
            >

              <FaBell
                className={styles.icon}
              />

              {unreadCount > 0 && (
                <span className={styles.badge}>
                  {unreadCount}
                </span>
              )}

            </button>

            {/* =================================================
                USER PROFILE
            ================================================= */}

            <div
              className={styles.userProfile}
              role="button"
              tabIndex={0}
              onClick={handleUserProfileClick}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUserProfileClick();
                }
              }}
            >

              <FaUserCircle
                className={styles.userIcon}
              />

              <span className={styles.userName}>
                {getDisplayName(user)}
              </span>

            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          POPUP NOTIFICATIONS
      ===================================================== */}

      {showModal && (
        <div className={styles.popupOverlay}>

          <div className={styles.popupBox}>

            {/* HEADER */}

            <div className={styles.popupHeader}>

              <h3>
                Notifications
              </h3>

              <button
                className={styles.closeBtn}
                onClick={handleClose}
              >
                ×
              </button>

            </div>

            {/* BODY */}

            <div className={styles.popupBody}>

              {notifications.length === 0 ? (

                <p>
                  Aucune notification
                </p>

              ) : (

                <ul
                  className={
                    styles.notificationList
                  }
                >

                  {notifications.map(
                    (notif) => (

                      <li
                        key={notif.id}
                        className={`
                          ${styles.notificationItem}
                          ${
                            notif.isRead
                              ? styles.read
                              : styles.unread
                          }
                        `}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          handleNotificationClick(
                            notif
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleNotificationClick(
                              notif
                            );
                          }
                        }}
                      >

                        <div
                          className={
                            styles.notifContent
                          }
                        >

                          <p
                            className={
                              styles.notifTitle
                            }
                          >
                            {notif.description}
                          </p>

                          <span
                            className={
                              styles.notifMeta
                            }
                          >
                            {timeAgo(
                              notif.dateNotif
                            )}
                          </span>

                        </div>

                      </li>

                    )
                  )}

                </ul>

              )}

            </div>

            {/* FOOTER */}

            <div
              className={
                styles.popupFooter
              }
            >

              <button
                onClick={handleClose}
              >
                Fermer
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          POPUP PROFIL
      ===================================================== */}

      {showUserModal && (
        <div className={styles.popupOverlay}>

          <div className={styles.popupBox}>

            {/* HEADER */}

            <div className={styles.popupHeader}>
              <h3>Mon profil</h3>

              <button
                className={styles.closeBtn}
                onClick={closeUserModal}
                aria-label="Fermer le profil"
              >
                ×
              </button>
            </div>

            <div className={styles.popupBody}>
              <div className={styles.profileSummary}>
                <div className={styles.profileAvatar}>
                  {getDisplayName(user).charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>{getDisplayName(user)}</strong>
                  <span>{user.email || "Email non renseigné"}</span>
                </div>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.profileDetail}>
                  <span>Rôle</span>
                  <strong>{mapRole(user.roleId ?? user.role)}</strong>
                </div>

                <div className={styles.profileDetail}>
                  <span>Identifiant</span>
                  <strong>{user.id || "Non renseigné"}</strong>
                </div>

                <div className={styles.profileDetail}>
                  <span>Nom</span>
                  <strong>
                    {user.nom || user.lastname || "Non renseigné"}
                  </strong>
                </div>

                <div className={styles.profileDetail}>
                  <span>Prénom</span>
                  <strong>
                    {user.prenom || user.firstname || "Non renseigné"}
                  </strong>
                </div>
              </div>

            </div>

            {/* FOOTER */}

            <div
              className={
                styles.popupFooter
              }
            >

              <button
                onClick={closeUserModal}
              >
                Fermer
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Header;