import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./ItCandidat.module.css";

import ItSidebar from "../../pages/ItSidebar";
import Header from "../../component/Header/Header";

import CandidatListe from "../../pages/CandidatListe";

function ItCandidat() {
  return (
    <div className={styles.itCandidatContainer}>
      <ItSidebar />

      <div className={styles.mainContent}>
        <Header title="Candidats" />

        <CandidatListe
          detailsPath="/adminit/candidat"
          title="Gestion des candidats"
        />
      </div>
    </div>
  );
}

export default ItCandidat;