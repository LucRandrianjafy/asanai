import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../api/user";
import { getAllRegions } from "../../api/region";

import styles from "./Register.module.css";

/* =========================================================
   ICONES
========================================================= */

const UserIcon = () => (
  <svg
    className={styles.inputIcon}
    fill="#9ca3af"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

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
    <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1.9,2,2,2h12c1.1,0,2-.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-.9-2-2s0-2,0-2s0,0,0,0c0-1.1.9-2,2-2s2,.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className={styles.inputIcon}
    fill="#9ca3af"
    viewBox="0 0 24 24"
  >
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.11-.9-2-2-2zm0 16H5V9h14v11zM5 7V6h14v1H5z" />
  </svg>
);

const IdCardIcon = () => (
  <svg
    className={styles.inputIcon}
    fill="#9ca3af"
    viewBox="0 0 24 24"
  >
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h5V8H6v2zm0 4h8v-2H6v2zm10-4h2V8h-2v2zm0 4h2v-2h-2v2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className={styles.inputIcon}
    fill="#9ca3af"
    viewBox="0 0 24 24"
  >
    <path d="M6.62 10.79a15.46 15.46 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const LocationIcon = () => (
  <svg
    className={styles.inputIcon}
    fill="#9ca3af"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const EyeIcon = ({ showPassword }) => (
  <svg fill="#9ca3af" viewBox="0 0 24 24">
    {showPassword ? (
      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
    ) : (
      <path d="M2 4.27L3.27 3L21 20.73L19.73 22L16.81 19.09C15.36 19.61 13.71 19.9 12 19.9C7 19.9 2.73 16.79 1 12.4C1.72 10.57 2.88 8.95 4.33 7.69L2 4.27ZM12 17.5C14.76 17.5 17 15.26 17 12.5C17 11.86 16.87 11.25 16.64 10.69L14.82 8.87C15.13 9.62 15.3 10.5 15.3 11.3C15.3 13.07 13.87 14.5 12.1 14.5C11.3 14.33 10.42 14.02 9.67 13.27L11.48 15.08C11.65 15.11 11.82 15.12 11.98 15.12C14.14 15.12 15.87 13.39 15.87 11.25C15.87 11.07 15.86 10.9 15.83 10.73L17.15 12.05C17.25 11.63 17.3 11.2 17.3 10.75C17.3 7.99 15.06 5.75 12.3 5.75C11.85 5.75 11.42 5.8 11 5.9L2.77 0L1.5 1.27L12 11.77V17.5Z" />
    )}
  </svg>
);

/* =========================================================
   REGISTER
========================================================= */

function Register({ onBackToLogin }) {
  const navigate = useNavigate();

  const [registerStep, setRegisterStep] = useState(1);

  /* USERS */
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* USER_INFORMATION */
  const [dateNaissance, setDateNaissance] = useState("");
  const [cin, setCin] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [region, setRegion] = useState("");
  const [genre, setGenre] = useState("");
  const [residenceTana, setResidenceTana] = useState("");
  const [cinDateDelivrance, setCinDateDelivrance] = useState("");
  const [cinLieuDelivrance, setCinLieuDelivrance] = useState("");
  const [dernierDiplome, setDernierDiplome] = useState("");

  /* CANDIDAT_EVALUATION */
  const [niveauEtudes, setNiveauEtudes] = useState("");
  const [interetPoste, setInteretPoste] = useState("");

  /* REGIONS */
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);

  /* ETATS */
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     RÉCUPÉRATION DES RÉGIONS DEPUIS L'API
  ======================================================= */

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoadingRegions(true);

        const data = await getAllRegions();

        console.log("Régions récupérées :", data);

        /*
         * L'API peut retourner directement :
         * [
         *   { id: 1, nom: "Analamanga" },
         *   { id: 2, nom: "Diana" },
         *   ...
         * ]
         *
         * On vérifie aussi si le backend retourne un objet
         * contenant une propriété "data".
         */
        const regionList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setRegions(regionList);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des régions :",
          error
        );

        setError(
          "Impossible de récupérer les régions. Veuillez réessayer."
        );
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  /* =======================================================
     ÉTAPE 1 → ÉTAPE 2
  ======================================================= */

  const handleNextStep = (e) => {
    e.preventDefault();

    setError("");
    setRegisterStep(2);
  };

  /* =======================================================
     RETOUR ÉTAPE 1
  ======================================================= */

  const handlePreviousStep = () => {
    setError("");
    setRegisterStep(1);
  };

  /* =======================================================
     CHANGEMENT DE RÉGION
  ======================================================= */

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;

    setRegion(selectedRegion);

    /*
     * Si Analamanga (id = 1) est sélectionnée,
     * la résidence à Tana n'est pas nécessaire.
     */
    if (selectedRegion === "1") {
      setResidenceTana("");
    }
  };

  /* =======================================================
     INSCRIPTION
  ======================================================= */

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (!/^\d{12}$/.test(cin)) {
    setError("Le numéro CIN doit contenir exactement 12 chiffres.");
    return;
  }

  if (!genre) {
    setError("Veuillez sélectionner votre genre.");
    return;
  }

  if (!region) {
    setError("Veuillez sélectionner votre région.");
    return;
  }

  if (region !== "1" && !residenceTana.trim()) {
    setError("Veuillez renseigner votre résidence à Tana.");
    return;
  }

  setLoading(true);

  try {
    const userData = {
      prenom: prenom,
      nom: nom,
      email: email,
      password: password,

      cin: cin,
      telephone: telephone,
      adresse: adresse,
      dateNaissance: dateNaissance,

      genre: genre,

      residenceTana: region === "1" ? "" : residenceTana,

      regionId: region,

      cinDateDelivrance: cinDateDelivrance,
      cinLieuDelivrance: cinLieuDelivrance,
      dernierDiplomeObtenu: dernierDiplome,
    };

    /*
     * ⚠️ SÉCURITÉ : ne jamais logger userData tel quel,
     * il contient le mot de passe en clair.
     * On masque le champ password avant de logger,
     * uniquement utile en développement.
     */
    if (process.env.NODE_ENV !== "production") {
      console.log("Données envoyées :", {
        ...userData,
        password: "********",
      });
    }

    const response = await signup(userData);

    /*
     * ⚠️ SÉCURITÉ : ne pas logger response en entier,
     * elle peut contenir le hash du mot de passe
     * dans l'objet "user" renvoyé par le backend.
     */
    if (process.env.NODE_ENV !== "production") {
      console.log("Inscription réussie, token reçu :", !!response.token);
    }

    /*
     * Sauvegarde du token pour les requêtes authentifiées suivantes
     */
    localStorage.setItem("token", response.token);

    /*
     * Sauvegarde des infos utilisateur nécessaires,
     * sans jamais inclure le mot de passe (même hashé).
     */
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: response.user?.id,
        nom: response.user?.nom,
        prenom: response.user?.prenom,
        email: response.user?.email,
        roleId: response.user?.roleId,
      })
    );

    navigate("/recrue/candidature");

  } catch (error) {
    console.error(
      "Erreur lors de l'inscription :",
      error?.message || "Erreur inconnue"
    );

    let message =
      error?.message ||
      "Une erreur est survenue lors de l'inscription";

    if (
      message.includes("chk_users_cin") ||
      (message.includes("violates check constraint") &&
        message.includes("users_cin"))
    ) {
      message = "Le numéro CIN doit contenir exactement 12 chiffres.";
    } else if (
      message.includes("chk_users_genre") ||
      (message.includes("violates check constraint") &&
        message.includes("genre"))
    ) {
      message = "Le genre sélectionné n'est pas valide.";
    } else if (message.includes("Email ou CIN déjà utilisé")) {
      message = "Cet email ou ce numéro CIN est déjà utilisé.";
    } else if (
      message.toLowerCase().includes("email") &&
      (message.toLowerCase().includes("duplicate") ||
        message.toLowerCase().includes("unique"))
    ) {
      message = "Cette adresse email est déjà utilisée.";
    } else if (message.includes("DataIntegrityViolationException")) {
      message =
        "Les informations saisies ne sont pas valides. Vérifiez les données puis réessayez.";
    }

    setError(message);
    setRegisterStep(2);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.formContainer}>

      <div className={styles.registerCard}>

        <form
          onSubmit={
            registerStep === 1
              ? handleNextStep
              : handleSubmit
          }
          className={styles.registerForm}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className={styles.loginHeader}>

            <h2 className={styles.loginTitle}>
              {registerStep === 1
                ? "Créer un compte"
                : "Informations personnelles"}
            </h2>

            <div className={styles.stepIndicator}>
              Étape {registerStep} / 2
            </div>

          </div>

          {/* =================================================
              ÉTAPE 1
          ================================================= */}

          {registerStep === 1 && (

            <div className={styles.stepOne}>
              
              {/* NOM */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Nom
                </label>

                <div className={styles.inputWrapper}>

                  <UserIcon />

                  <input
                    type="text"
                    value={nom}
                    onChange={(e) =>
                      setNom(e.target.value)
                    }
                    className={styles.input}
                    placeholder="Votre nom"
                    required
                  />

                </div>
              </div>

              {/* PRENOM */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Prénom
                </label>

                <div className={styles.inputWrapper}>

                  <UserIcon />

                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) =>
                      setPrenom(e.target.value)
                    }
                    className={styles.input}
                    placeholder="Votre prénom"
                    required
                  />

                </div>
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
                    placeholder="votre@email.com"
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
                      showPassword={
                        showPassword
                      }
                    />

                  </button>

                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
              >
                Suivant
              </button>

            </div>
          )}

          {/* =================================================
              ÉTAPE 2
          ================================================= */}

          {registerStep === 2 && (

            <div className={styles.personalInfoGrid}>

              {/* CIN */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Numéro CIN
                </label>

                <div className={styles.inputWrapper}>

                  <IdCardIcon />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={cin}
                    onChange={(e) => {

                      const value =
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 12);

                      setCin(value);
                    }}
                    className={styles.input}
                    placeholder="Numéro CIN (12 chiffres)"
                    maxLength={12}
                    required
                  />

                </div>
              </div>

              {/* GENRE */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Genre
                </label>

                <div className={styles.selectWrapper}>

                  <UserIcon />

                  <select
                    value={genre}
                    onChange={(e) =>
                      setGenre(e.target.value)
                    }
                    className={styles.select}
                    required
                  >

                    <option value="">
                      Sélectionner votre genre
                    </option>

                    <option value="H">
                      Homme
                    </option>

                    <option value="F">
                      Femme
                    </option>

                  </select>

                </div>
              </div>

              {/* TELEPHONE */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Téléphone
                </label>

                <div className={styles.inputWrapper}>

                  <PhoneIcon />

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={telephone}
                    onChange={(e) =>
                      setTelephone(e.target.value)
                    }
                    className={styles.input}
                    placeholder="Numéro de téléphone"
                  />

                </div>
              </div>

              {/* ADRESSE */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Adresse
                </label>

                <div className={styles.inputWrapper}>

                  <LocationIcon />

                  <input
                    type="text"
                    value={adresse}
                    onChange={(e) =>
                      setAdresse(e.target.value)
                    }
                    className={styles.input}
                    placeholder="Votre adresse"
                  />

                </div>
              </div>

              {/* REGION */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Région
                </label>

                <div className={styles.selectWrapper}>

                  <LocationIcon />

                  <select
                    value={region}
                    onChange={handleRegionChange}
                    className={styles.select}
                    required
                    disabled={loadingRegions}
                  >

                    <option value="">
                      {loadingRegions
                        ? "Chargement des régions..."
                        : "Sélectionner une région"}
                    </option>

                    {regions.map((item) => (

                      <option
                        key={item.id}
                        value={String(item.id)}
                      >
                        {item.nom}
                      </option>

                    ))}

                  </select>

                </div>
              </div>

              {/* =================================================
                  RESIDENCE À TANA
                  Apparaît si région != Analamanga
              ================================================= */}

              {region && region !== "1" && (

                <div className={styles.formGroup}>

                  <label className={styles.label}>
                    Résidence à Tana
                  </label>

                  <div className={styles.inputWrapper}>

                    <LocationIcon />

                    <input
                      type="text"
                      value={residenceTana}
                      onChange={(e) =>
                        setResidenceTana(
                          e.target.value
                        )
                      }
                      className={styles.input}
                      placeholder="Votre adresse de résidence à Tana"
                      required
                    />

                  </div>

                </div>
              )}

              {/* DATE DE NAISSANCE */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Date de naissance
                </label>

                <div className={styles.inputWrapper}>

                  <CalendarIcon />

                  <input
                    type="date"
                    value={dateNaissance}
                    onChange={(e) =>
                      setDateNaissance(
                        e.target.value
                      )
                    }
                    className={styles.input}
                    required
                  />

                </div>
              </div>

              {/* DATE CIN */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Date de délivrance du CIN
                </label>

                <div className={styles.inputWrapper}>

                  <CalendarIcon />

                  <input
                    type="date"
                    value={cinDateDelivrance}
                    onChange={(e) =>
                      setCinDateDelivrance(
                        e.target.value
                      )
                    }
                    className={styles.input}
                  />

                </div>
              </div>

              {/* LIEU CIN */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Lieu de délivrance du CIN
                </label>

                <div className={styles.inputWrapper}>

                  <LocationIcon />

                  <input
                    type="text"
                    value={cinLieuDelivrance}
                    onChange={(e) =>
                      setCinLieuDelivrance(
                        e.target.value
                      )
                    }
                    className={styles.input}
                    placeholder="Lieu de délivrance"
                  />

                </div>
              </div>

              {/* DERNIER DIPLOME */}

              <div className={styles.formGroup}>

                <label className={styles.label}>
                  Dernier diplôme
                </label>

                <div className={styles.inputWrapper}>

                  <UserIcon />

                  <input
                    type="text"
                    value={dernierDiplome}
                    onChange={(e) =>
                      setDernierDiplome(
                        e.target.value
                      )
                    }
                    className={styles.input}
                    placeholder="Ex : Licence, Master..."
                  />

                </div>
              </div>

              {/* MESSAGE ERREUR */}

              {error && (

                <div className={styles.errorMessage}>
                  {error}
                </div>

              )}

              {/* BOUTONS */}

              <div className={styles.stepButtons}>

                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className={styles.backButton}
                  disabled={loading}
                >
                  Retour
                </button>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading || loadingRegions}
                >

                  {loading
                    ? "Inscription..."
                    : "S'inscrire"}

                </button>

              </div>

            </div>
          )}

          {/* RETOUR LOGIN */}

          <div className={styles.registerSwitch}>

            <span>
              Vous avez déjà un compte ?
            </span>

            <button
              type="button"
              onClick={onBackToLogin}
              className={styles.registerLink}
              disabled={loading}
            >
              Se connecter
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Register;