import React from "react";

import styles from "./ItCandidatDetails.module.css";

import ItSidebar from "../../pages/ItSidebar";
import Header from "../../component/Header/Header";

import CandidatDetailsView from "../../pages/CandidatDetailsView";

const ItCandidatDetails = () => {
  return (
    <div className={`d-flex flex-column flex-lg-row ${styles.container}`}>
      <ItSidebar />

      <div className={styles.mainArea}>
        <Header title="Détails du candidat" showSearch={false} />

        <div className={styles.content}>
          <CandidatDetailsView />
        </div>
      </div>
    </div>
  );
};

export default ItCandidatDetails;