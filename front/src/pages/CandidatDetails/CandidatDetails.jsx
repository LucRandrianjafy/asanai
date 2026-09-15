import React from "react";

import styles from "./CandidatDetails.module.css";

import Sidebar from "../../pages/Sidebar";
import Header from "../../component/Header/Header";

import CandidatDetailsView from "../../pages/CandidatDetailsView";

const CandidatDetails = () => {
  return (
    <div className={`d-flex flex-column flex-lg-row ${styles.container}`}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header title="Détails du candidat" showSearch={false} />

        <div className={styles.content}>
          <CandidatDetailsView />
        </div>
      </div>
    </div>
  );
};

export default CandidatDetails;