import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signin } from "../../api/user";

import styles from "./Login.module.css";

/* =========================================================
   ICONES
========================================================= */

const EmailIcon = () => (
  <svg
    className={styles.inputIcon}
    fill="#9ca3af"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const LockIcon = () => (
  <svg
    className={styles.inputIcon}
    fill="#9ca3af"
    viewBox="0 0 24 24"
  >
    <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1.9,2,2,2h12c1.1,0,2-.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
  </svg>
);

const EyeIcon = ({ showPassword }) => (
  <svg fill="#9ca3af" viewBox="0 0 24 24">
    {showPassword ? (
      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
    ) : (
      <path d="M2 4.27L3.27 3L21 20.73L19.73 22L16.81 19.09C15.36 19.61 13.71 19.9 12 19.9C7 19.9 2.73 16.79 1 12.4C1.72 10.57 2.88 8.95 4.33 7.69L2 4.27ZM12 17.5C14.76 17.5 17 15.26 17 12.5C17 11.86 16.87 11.25 16.64 10.69L14.82 8.87C15.13 9.62 15.3 10.5 15.3 11.3C15.3 13.07 13.87 14.02 12.1 14.5C11.3 14.33 10.42 14.02 9.67 13.27L11.48 15.08C11.65 15.11 11.82 15.12 11.98 15.12C14.14 15.12 15.87 13.39 15.87 11.25C15.87 11.07 15.86 10.9 15.83 10.73L17.15 12.05C17.25 11.63 17.3 11.2 17.3 10.75C17.3 7.99 15.06 5.75 12.3 5.75C11.85 5.75 11.42 5.8 11 5.9L2.77 0L1.5 1.27L12 11.77V17.5Z" />
    )}
  </svg>
);

/* =========================================================
   LOGIN
========================================================= */

function Login({ onGoToRegister }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     CONNEXION
  ======================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await signin(
        email,
        password
      );

      /*
       * Sauvegarde du token
       */
      localStorage.setItem(
        "token",
        response.token
      );

      /*
       * Sauvegarde des informations
       * de l'utilisateur connecté
       */
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.id,
          nom: response.nom,
          prenom: response.prenom,
          email: response.email,
          roleId: response.roleId,
          role: response.role
        })
      );

      /*
       * Redirection selon le rôle
       */
      if (
        response.role &&
        response.role.toLowerCase() === "admin"
      ) {

        navigate("/admin/users");

      } else if (
        response.role &&
        response.role.toLowerCase() === "user"
      ) {

        navigate("/recrue/candidature");

      } else if (
        response.role &&
        response.role.toLowerCase() === "it"
      ) {

        navigate("/adminit/candidat");

      } else if (
        response.role &&
        response.role.toLowerCase() === "rh"
      ) {

        navigate("/rh/overview");

      } else if (
        response.role &&
        response.role.toLowerCase() === "formateur"
      ) {

        navigate("/formateur/candidat");

      } else {

        setError(
          "Rôle utilisateur non reconnu."
        );
      }

    } catch (error) {

      setError(
        error.message ||
        "Email ou mot de passe incorrect"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className={styles.formContainer}>

      <div className={styles.loginCard}>

        <form
          onSubmit={handleSubmit}
          className={styles.loginForm}
        >

          {/* HEADER */}

          <div className={styles.loginHeader}>

            <h2 className={styles.loginTitle}>
              Connexion
            </h2>

          </div>

          {/* EMAIL */}

          <div className={styles.formGroup}>

            <label className={styles.label}>
              Adresse email
            </label>

            <div className={styles.inputWrapper}>

              <EmailIcon />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className={styles.input}
                placeholder="admin@gmail.com"
                required
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className={styles.formGroup}>

            <label className={styles.label}>
              Mot de passe
            </label>

            <div className={styles.inputWrapper}>

              <LockIcon />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className={`${styles.input} ${styles.inputWithToggle}`}
                placeholder="••••••••"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className={
                  styles.passwordToggle
                }
              >

                <EyeIcon
                  showPassword={showPassword}
                />

              </button>

            </div>

          </div>

          {/* MESSAGE ERREUR */}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* OPTIONS */}

          <div className={styles.formOptions}>

            <label
              className={
                styles.checkboxLabel
              }
            >

              <input
                type="checkbox"
                className={
                  styles.checkbox
                }
              />

              Se souvenir de moi

            </label>

            <a
              href="#"
              className={
                styles.forgotLink
              }
            >
              Mot de passe oublié ?
            </a>

          </div>

          {/* BOUTON */}

          <button
            type="submit"
            className={
              styles.submitButton
            }
            disabled={loading}
          >

            {loading
              ? "Connexion..."
              : "Se connecter"
            }

          </button>

          {/* INSCRIPTION */}

          <div
            className={
              styles.registerSwitch
            }
          >

            <span>
              Vous n'avez pas encore de compte ?
            </span>

            <button
              type="button"
              onClick={onGoToRegister}
              className={
                styles.registerLink
              }
            >
              S'inscrire
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;