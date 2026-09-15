import { useState } from "react";

import Login from "../../component/Login/Login";
import Register from "../../component/Register/Register";

import styles from "./Auth.module.css";

function Auth() {
  const [showRegister, setShowRegister] = useState(false);

  const goToRegister = () => {
    setShowRegister(true);
  };

  const goToLogin = () => {
    setShowRegister(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authPanel}>

        {showRegister ? (
          <Register onBackToLogin={goToLogin} />
        ) : (
          <Login onGoToRegister={goToRegister} />
        )}

      </div>
    </div>
  );
}

export default Auth;