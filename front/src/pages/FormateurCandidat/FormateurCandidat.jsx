import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./FormateurCandidat.module.css";

import FormateurSidebar from "../../pages/FormateurSidebar";
import Header from "../../component/Header/Header";

import CandidatListe from "../../pages/CandidatListe";

function FormateurCandidat() {
  return (
    <div className={styles.formateurCandidatContainer}>
      <FormateurSidebar />

      <div className={styles.mainContent}>
        <Header title="Candidats" />

        <CandidatListe
          detailsPath="/formateur/candidat"
          title="Gestion des candidats"
        />
      </div>
    </div>
  );
}

export default FormateurCandidat;