import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Overview.module.css";
import RecrueSidebar from "../../pages/RecrueSidebar";
import Header from "../../component/Header/Header";

const Overview = () => {

  return (
    <div className={`d-flex flex-column flex-lg-row ${styles.container}`}>
      <RecrueSidebar />
      <Header title="Overview" showSearch={false} />

      <div className={styles.content}>

      </div>
    </div>
  );
};

export default Overview;