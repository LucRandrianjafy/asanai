import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./Admin.module.css";

import Sidebar from "../../pages/Sidebar";
import Header from "../../component/Header/Header";

import CandidatListe from "../../pages/CandidatListe";

function Admin() {
  return (
    <div className={styles.adminContainer}>
      <Sidebar />

      <div className={styles.mainContent}>
        <Header title="Candidats" />

        <CandidatListe />
      </div>
    </div>
  );
}

export default Admin;