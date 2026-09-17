import React, { useEffect, useState } from "react";

import {
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import styles from "./Header.module.css";

import {
  getNotificationsByUserId,
  countNotificationsNonVuesByUserId,
  marquerCommeVue,
  marquerToutesCommeVues,
} from "../../api/notification";


const Header = ({
  title = "",
  showSearch = true,
}) => {

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const [notificationError, setNotificationError] =
    useState(null);


  /* =========================================================
     POPUPS
  ========================================================= */

  const [showModal, setShowModal] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);


  /* =========================================================
     UTILISATEUR CONNECTÉ
  ========================================================= */

  const [user] = useState(() => {

    try {

      const storedUser =
        localStorage.getItem("user");

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
     ID UTILISATEUR
  ========================================================= */

  const userId =
    user?.id ??
    user?.userId ??
    user?.idUser;


  /* =========================================================
     CHARGER LES NOTIFICATIONS
  ========================================================= */

  const loadNotifications = async () => {

    if (!userId) {
      return;
    }

    try {

      setLoadingNotifications(true);

      setNotificationError(null);

      const [
        notificationData,
        countData
      ] = await Promise.all([

        getNotificationsByUserId(userId),

        countNotificationsNonVuesByUserId(userId)

      ]);

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );

      setUnreadCount(
        typeof countData === "number"
          ? countData
          : Number(countData) || 0
      );

    } catch (error) {

      console.error(
        "Erreur lors du chargement des notifications :",
        error
      );

      setNotificationError(
        "Impossible de charger les notifications."
      );

      setNotifications([]);

      setUnreadCount(0);

    } finally {

      setLoadingNotifications(false);

    }

  };


  /* =========================================================
     CHARGEMENT INITIAL
  ========================================================= */

  useEffect(() => {

    loadNotifications();

  }, [userId]);


  /* =========================================================
     OUVRIR LES NOTIFICATIONS
  ========================================================= */

  const handleBellClick = () => {

    setShowModal(true);

    /*
     * On recharge les notifications lorsque
     * l'utilisateur ouvre le popup.
     */

    loadNotifications();

  };


  /* =========================================================
     FERMER LES NOTIFICATIONS
  ========================================================= */

  const handleClose = () => {

    setShowModal(false);

  };


  /* =========================================================
     MARQUER UNE NOTIFICATION COMME VUE
  ========================================================= */

  const handleNotificationClick = async (notif) => {

    if (!notif) {
      return;
    }

    /*
     * Si elle est déjà vue, rien à faire.
     */

    if (notif.statutVu) {
      return;
    }

    try {

      await marquerCommeVue(notif.id);

      /*
       * Mise à jour immédiate de l'interface.
       */

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notif.id
            ? {
                ...notification,
                statutVu: true,
              }
            : notification
        )
      );

      /*
       * Mise à jour du compteur.
       */

      setUnreadCount((previous) =>
        Math.max(previous - 1, 0)
      );

    } catch (error) {

      console.error(
        "Erreur lors du marquage de la notification comme vue :",
        error
      );

    }

  };


  /* =========================================================
     MARQUER TOUTES LES NOTIFICATIONS COMME VUES
  ========================================================= */

  const handleMarkAllAsRead = async () => {

    if (!userId || unreadCount === 0) {
      return;
    }

    try {

      await marquerToutesCommeVues(userId);

      /*
       * Toutes les notifications deviennent vues
       * immédiatement dans le frontend.
       */

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          statutVu: true,
        }))
      );

      setUnreadCount(0);

    } catch (error) {

      console.error(
        "Erreur lors du marquage de toutes les notifications comme vues :",
        error
      );

    }

  };


  /* =========================================================
     DATE RELATIVE
  ========================================================= */

  const timeAgo = (dateValue) => {

    if (!dateValue) {
      return "";
    }

    const then =
      new Date(dateValue).getTime();

    if (isNaN(then)) {
      return "";
    }

    const seconds = Math.floor(
      (Date.now() - then) / 1000
    );

    if (seconds < 60) {

      return `Il y a ${seconds} seconde${
        seconds > 1 ? "s" : ""
      }`;

    }

    const minutes =
      Math.floor(seconds / 60);

    if (minutes < 60) {

      return `Il y a ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;

    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {

      return `Il y a ${hours} heure${
        hours > 1 ? "s" : ""
      }`;

    }

    const days =
      Math.floor(hours / 24);

    if (days < 30) {

      return `Il y a ${days} jour${
        days > 1 ? "s" : ""
      }`;

    }

    const months =
      Math.floor(days / 30);

    if (months < 12) {

      return `Il y a ${months} mois`;

    }

    const years =
      Math.floor(months / 12);

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


  /* =========================================================
     NOM AFFICHÉ
  ========================================================= */

  const getDisplayName = (currentUser) => {

    const firstName =
      currentUser?.prenom ??
      currentUser?.firstname ??
      "";

    const lastName =
      currentUser?.nom ??
      currentUser?.lastname ??
      "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      getDisplayEmail(currentUser?.email)
    );

  };


  /* =========================================================
     RÔLE
  ========================================================= */

  const mapRole = (role) => {

    if (typeof role === "string") {

      const normalizedRole =
        role.toLowerCase();

      if (
        normalizedRole === "admin" ||
        normalizedRole === "administrateur"
      ) {

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

              {loadingNotifications ? (

                <p>
                  Chargement des notifications...
                </p>

              ) : notificationError ? (

                <p>
                  {notificationError}
                </p>

              ) : notifications.length === 0 ? (

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
                            notif.statutVu
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

                          {/* TITRE */}

                          <p
                            className={
                              styles.notifTitle
                            }
                          >
                            {notif.titre}
                          </p>


                          {/* MESSAGE */}

                          <p>
                            {notif.message}
                          </p>


                          {/* DATE */}

                          <span
                            className={
                              styles.notifMeta
                            }
                          >
                            {timeAgo(
                              notif.dateNotification
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

              {unreadCount > 0 && (

                <button
                  onClick={handleMarkAllAsRead}
                >
                  Tout marquer comme lu
                </button>

              )}


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

              <h3>
                Mon profil
              </h3>

              <button
                className={styles.closeBtn}
                onClick={closeUserModal}
                aria-label="Fermer le profil"
              >
                ×
              </button>

            </div>


            {/* BODY */}

            <div className={styles.popupBody}>

              <div
                className={
                  styles.profileSummary
                }
              >

                <div
                  className={
                    styles.profileAvatar
                  }
                >
                  {getDisplayName(user)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <strong>
                    {getDisplayName(user)}
                  </strong>

                  <span>
                    {user.email ||
                      "Email non renseigné"}
                  </span>

                </div>

              </div>


              <div
                className={
                  styles.profileDetails
                }
              >

                <div
                  className={
                    styles.profileDetail
                  }
                >

                  <span>
                    Rôle
                  </span>

                  <strong>
                    {mapRole(
                      user.roleId ??
                      user.role
                    )}
                  </strong>

                </div>


                <div
                  className={
                    styles.profileDetail
                  }
                >

                  <span>
                    Identifiant
                  </span>

                  <strong>
                    {user.id ||
                      "Non renseigné"}
                  </strong>

                </div>


                <div
                  className={
                    styles.profileDetail
                  }
                >

                  <span>
                    Nom
                  </span>

                  <strong>
                    {user.nom ||
                      user.lastname ||
                      "Non renseigné"}
                  </strong>

                </div>


                <div
                  className={
                    styles.profileDetail
                  }
                >

                  <span>
                    Prénom
                  </span>

                  <strong>
                    {user.prenom ||
                      user.firstname ||
                      "Non renseigné"}
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