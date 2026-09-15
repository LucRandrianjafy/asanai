import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FaPaperPlane,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

import styles from "./RecrueSidebar.module.css";

import { getCandidatScoreById } from "../../api/vueCandidatScore";


const RecrueSidebar = () => {

  const [open, setOpen] = useState(false);

  // ============================================================
  // SCORE DU CANDIDAT
  // ============================================================

  const [score, setScore] = useState(null);

  const [loadingScore, setLoadingScore] = useState(true);


  // ============================================================
  // RÉCUPÉRER LE SCORE DU CANDIDAT CONNECTÉ
  // ============================================================

  useEffect(() => {

    const fetchScore = async () => {

      try {

        setLoadingScore(true);

        const userStorage = localStorage.getItem("user");

        if (!userStorage) {
          console.error("Utilisateur non trouvé dans le localStorage");
          setLoadingScore(false);
          return;
        }

        const user = JSON.parse(userStorage);

        /*
         * Selon ton objet user, l'id peut être stocké
         * sous "id" ou "idUser".
         */
        const idUser = user.id || user.idUser;

        if (!idUser) {
          console.error("ID utilisateur introuvable");
          setLoadingScore(false);
          return;
        }

        console.log(
          "Récupération du score pour l'utilisateur :",
          idUser
        );

        const candidatScore =
          await getCandidatScoreById(idUser);

        console.log(
          "Score du candidat :",
          candidatScore
        );

        setScore(candidatScore);

      } catch (error) {

        console.error(
          "Erreur récupération du score du candidat :",
          error
        );

        setScore(null);

      } finally {

        setLoadingScore(false);
      }
    };


    fetchScore();

  }, []);


  // ============================================================
  // MENU DE BASE
  // ============================================================

  const menuItems = [
    // {
    //   path: "/recrue/overview",
    //   icon: FaTachometerAlt,
    //   label: "Overview"
    // },

    {
      path: "/recrue/candidature",
      icon: FaPaperPlane,
      label: "Candidature"
    }
  ];


  // ============================================================
  // AJOUTER EVALUATION SEULEMENT SI NOTE >= 10
  // ============================================================

  if (
    !loadingScore &&
    score &&
    score.noteTotale >= 10
  ) {

    menuItems.push({
      path: "/recrue/evaluation",
      icon: FaClipboardList,
      label: "Test"
    });

  }


  const handleCloseSidebar = () => {
    setOpen(false);
  };


  return (
    <>
      {/* ====================================================== */}
      {/* MOBILE TOGGLE BUTTON */}
      {/* ====================================================== */}

      <div className="d-md-none p-2">

        <button
          className={`btn btn-outline-light ${styles.mobileToggle}`}
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
        >

          <FaBars className="me-2" />

          <span>Candidat</span>

        </button>

      </div>


      {/* ====================================================== */}
      {/* SIDEBAR */}
      {/* ====================================================== */}

      <aside
        className={`${styles.sidebar} ${
          open ? styles.open : ""
        }`}
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <header className={styles.sidebarHeader}>

          <h1 className={styles.logo}>
            CANDIDAT
          </h1>

          <button
            className={`${styles.closeBtn} d-md-none`}
            onClick={handleCloseSidebar}
            aria-label="Fermer le menu"
          >

            <FaTimes />

          </button>

        </header>


        {/* ================================================== */}
        {/* NAVIGATION */}
        {/* ================================================== */}

        <nav className={styles.nav}>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.link} ${
                    isActive ? styles.active : ""
                  }`
                }
                onClick={handleCloseSidebar}
              >

                <Icon className={styles.icon} />

                <span className={styles.linkText}>
                  {item.label}
                </span>

              </NavLink>
            );

          })}

        </nav>


        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <footer className={styles.footer}>

          <NavLink
            to="/login"
            className={styles.logout}
            onClick={handleCloseSidebar}
          >

            <FaSignOutAlt className={styles.icon} />

            <span className={styles.linkText}>
              Se déconnecter
            </span>

          </NavLink>

        </footer>

      </aside>


      {/* ====================================================== */}
      {/* OVERLAY MOBILE */}
      {/* ====================================================== */}

      {open && (

        <div
          className={styles.overlay}
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />

      )}

    </>
  );
};


export default RecrueSidebar;