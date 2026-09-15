import React from "react";

import styles from "./FormateurCandidatDetails.module.css";

import FormateurSidebar from "../../pages/FormateurSidebar";
import Header from "../../component/Header/Header";

import CandidatDetailsView from "../../pages/CandidatDetailsView";

const FormateurCandidatDetails = () => {
  return (
    <div className={`d-flex flex-column flex-lg-row ${styles.container}`}>
      <FormateurSidebar />

      <div className={styles.mainArea}>
        <Header title="Détails du candidat" showSearch={false} />

        <div className={styles.content}>
          <CandidatDetailsView />
        </div>
      </div>
    </div>
  );
};

export default FormateurCandidatDetails;