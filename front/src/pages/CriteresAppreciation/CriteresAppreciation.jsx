import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaEdit,
  FaExclamationCircle,
  FaListAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import styles from "./CriteresAppreciation.module.css";

import Sidebar from "../../pages/Sidebar";
import Header from "../../component/Header/Header";

import {
  createCritereAppreciation,
  getAllCritereAppreciation,
  updateCritereAppreciation,
} from "../../api/critereAppreciation";

import {
  createAppreciation,
  deleteAppreciation,
  getAllAppreciation,
  updateAppreciation,
} from "../../api/appreciation";

const EMPTY_CRITERE = {
  nom: "",
  description: "",
  statut: true,
};

const EMPTY_APPRECIATION = {
  idCritere: "",
  libelle: "",
  points: "",
  statut: true,
};

const getCritereId = (critere) =>
  critere.id ?? critere.idCritere ?? critere.id_critere;

const getAppreciationId = (appreciation) =>
  appreciation.id ??
  appreciation.idAppreciation ??
  appreciation.id_appreciation;

const toBooleanStatut = (statut) => {
  if (typeof statut === "boolean") return statut;

  if (typeof statut === "string") {
    return (
      statut.toLowerCase() === "actif" ||
      statut.toLowerCase() === "true"
    );
  }

  return true;
};

const CriteresAppreciation = () => {
  const [criteres, setCriteres] = useState([]);
  const [appreciations, setAppreciations] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(EMPTY_CRITERE);

  const [appreciationModalMode, setAppreciationModalMode] = useState(null);
  const [editingAppreciationId, setEditingAppreciationId] = useState(null);
  const [appreciationForm, setAppreciationForm] =
    useState(EMPTY_APPRECIATION);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [criteresData, appreciationsData] = await Promise.all([
        getAllCritereAppreciation(),
        getAllAppreciation(),
      ]);

      setCriteres(Array.isArray(criteresData) ? criteresData : []);
      setAppreciations(
        Array.isArray(appreciationsData) ? appreciationsData : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Impossible de récupérer les critères d'appréciation."
      );

      setCriteres([]);
      setAppreciations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCriteres = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return criteres;

    return criteres.filter((critere) => {
      const nom = String(critere.nom ?? "").toLowerCase();
      const description = String(
        critere.description ?? ""
      ).toLowerCase();

      return (
        nom.includes(value) ||
        description.includes(value)
      );
    });
  }, [criteres, search]);

  const getAppreciationsForCritere = (idCritere) => {
    return appreciations.filter(
      (appreciation) =>
        Number(
          appreciation.idCritere ??
            appreciation.id_critere
        ) === Number(idCritere)
    );
  };

  const openCreateCritereModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData(EMPTY_CRITERE);
    setModalError("");
  };

  const openEditCritereModal = (critere) => {
    setModalMode("edit");
    setEditingId(getCritereId(critere));

    setFormData({
      nom: critere.nom ?? "",
      description: critere.description ?? "",
      statut: toBooleanStatut(critere.statut),
    });

    setModalError("");
  };

  const closeCritereModal = () => {
    if (saving) return;

    setModalMode(null);
    setEditingId(null);
    setFormData(EMPTY_CRITERE);
    setModalError("");
  };

  const openCreateAppreciationModal = (idCritere) => {
    setAppreciationModalMode("create");
    setEditingAppreciationId(null);

    setAppreciationForm({
      idCritere,
      libelle: "",
      points: "",
      statut: true,
    });

    setModalError("");
  };

  const openEditAppreciationModal = (appreciation) => {
    setAppreciationModalMode("edit");

    setEditingAppreciationId(
      getAppreciationId(appreciation)
    );

    setAppreciationForm({
      idCritere:
        appreciation.idCritere ??
        appreciation.id_critere ??
        "",
      libelle: appreciation.libelle ?? "",
      points: appreciation.points ?? "",
      statut: toBooleanStatut(appreciation.statut),
    });

    setModalError("");
  };

  const closeAppreciationModal = () => {
    if (saving) return;

    setAppreciationModalMode(null);
    setEditingAppreciationId(null);
    setAppreciationForm(EMPTY_APPRECIATION);
    setModalError("");
  };

  const handleCritereChange = (event) => {
    const { name, value } = event.target;

    if (name === "statut") {
      setFormData((current) => ({
        ...current,
        statut: value === "true",
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAppreciationChange = (event) => {
    const { name, value } = event.target;

    if (name === "statut") {
      setAppreciationForm((current) => ({
        ...current,
        statut: value === "true",
      }));

      return;
    }

    setAppreciationForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCritereSubmit = async (event) => {
    event.preventDefault();

    const nom = formData.nom.trim();
    const description = formData.description.trim();

    if (!nom) {
      setModalError("Le nom du critère est obligatoire.");
      return;
    }

    try {
      setSaving(true);
      setModalError("");

      const payload = {
        nom,
        description: description || null,
        statut: formData.statut,
      };

      if (modalMode === "edit") {
        await updateCritereAppreciation(
          editingId,
          payload
        );
      } else {
        await createCritereAppreciation(payload);
      }

      closeCritereModal();

      await fetchData();
    } catch (err) {
      setModalError(
        err.message ||
          "Une erreur est survenue lors de l'enregistrement du critère."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAppreciationSubmit = async (event) => {
    event.preventDefault();

    const libelle = appreciationForm.libelle.trim();
    const points = Number(appreciationForm.points);

    if (!libelle) {
      setModalError(
        "Le libellé de l'appréciation est obligatoire."
      );
      return;
    }

    if (
      appreciationForm.points === "" ||
      Number.isNaN(points) ||
      points < 0
    ) {
      setModalError(
        "Les points doivent être un nombre supérieur ou égal à 0."
      );
      return;
    }

    try {
      setSaving(true);
      setModalError("");

      const payload = {
        idCritere: Number(appreciationForm.idCritere),
        libelle,
        points,
        statut: appreciationForm.statut,
      };

      if (appreciationModalMode === "edit") {
        await updateAppreciation(
          editingAppreciationId,
          payload
        );
      } else {
        await createAppreciation(payload);
      }

      closeAppreciationModal();

      await fetchData();
    } catch (err) {
      setModalError(
        err.message ||
          "Une erreur est survenue lors de l'enregistrement de l'appréciation."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAppreciation = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette appréciation ?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteAppreciation(id);

      await fetchData();
    } catch (err) {
      setError(
        err.message ||
          "Impossible de supprimer l'appréciation."
      );
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header
          title="Critères d'appréciation"
          showSearch={false}
        />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div>
              <h1>Gestion des critères d'appréciation</h1>

              <p>
                Gérez les critères, leurs appréciations et les
                points associés.
              </p>
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={openCreateCritereModal}
            >
              <FaPlus />
              Nouveau critère
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <FaSearch />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Rechercher un critère..."
                aria-label="Rechercher un critère"
              />
            </div>

            <strong>
              {criteres.length} critère(s)
            </strong>
          </div>

          {loading && (
            <div className={styles.stateMessage}>
              <div
                className="spinner-border"
                role="status"
                aria-hidden="true"
              />

              Chargement des critères...
            </div>
          )}

          {!loading && error && (
            <div className={styles.stateMessage}>
              <FaExclamationCircle />

              <span>{error}</span>

              <button
                type="button"
                onClick={fetchData}
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredCriteres.length === 0 && (
              <div className={styles.emptyState}>
                <FaListAlt />

                <h2>
                  Aucun critère d'appréciation
                </h2>

                <p>
                  Créez un critère ou modifiez votre
                  recherche.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            filteredCriteres.length > 0 && (
              <div className={styles.criteresGrid}>
                {filteredCriteres.map((critere) => {
                  const id = getCritereId(critere);

                  const isActive = toBooleanStatut(
                    critere.statut
                  );

                  const critereAppreciations =
                    getAppreciationsForCritere(id);

                  return (
                    <article
                      className={styles.critereCard}
                      key={id}
                    >
                      <div className={styles.cardIcon}>
                        <FaListAlt />
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.cardHeader}>
                          <div>

                            <h2>
                              {critere.nom ||
                                "Sans nom"}
                            </h2>

                            {critere.description && (
                              <p
                                className={
                                  styles.description
                                }
                              >
                                {critere.description}
                              </p>
                            )}
                          </div>

                          <span
                            className={`${styles.status} ${
                              isActive
                                ? styles.active
                                : styles.inactive
                            }`}
                          >
                            {isActive
                              ? "Actif"
                              : "Inactif"}
                          </span>
                        </div>

                        <div
                          className={
                            styles.appreciationsHeader
                          }
                        >
                          <span>
                            Appréciations
                          </span>

                          <button
                            type="button"
                            className={
                              styles.addAppreciationButton
                            }
                            onClick={() =>
                              openCreateAppreciationModal(
                                id
                              )
                            }
                          >
                            <FaPlus />
                            Ajouter
                          </button>
                        </div>

                        <div
                          className={
                            styles.appreciationsList
                          }
                        >
                          {critereAppreciations.length ===
                            0 && (
                            <div
                              className={
                                styles.noAppreciation
                              }
                            >
                              Aucune appréciation
                            </div>
                          )}

                          {critereAppreciations.map(
                            (appreciation) => {
                              const appreciationId =
                                getAppreciationId(
                                  appreciation
                                );

                              const appreciationActive =
                                toBooleanStatut(
                                  appreciation.statut
                                );

                              return (
                                <div
                                  className={
                                    styles.appreciationRow
                                  }
                                  key={
                                    appreciationId
                                  }
                                >
                                  <div
                                    className={
                                      styles.appreciationInfo
                                    }
                                  >
                                    <span
                                      className={
                                        styles.appreciationLabel
                                      }
                                    >
                                      {
                                        appreciation.libelle
                                      }
                                    </span>

                                    <span
                                      className={
                                        styles.points
                                      }
                                    >
                                      {
                                        appreciation.points
                                      }{" "}
                                      pts
                                    </span>
                                  </div>

                                  <div
                                    className={
                                      styles.appreciationActions
                                    }
                                  >
                                    <span
                                      className={`${styles.smallStatus} ${
                                        appreciationActive
                                          ? styles.active
                                          : styles.inactive
                                      }`}
                                    >
                                      {appreciationActive
                                        ? "Actif"
                                        : "Inactif"}
                                    </span>

                                    <button
                                      type="button"
                                      className={
                                        styles.iconButton
                                      }
                                      onClick={() =>
                                        openEditAppreciationModal(
                                          appreciation
                                        )
                                      }
                                      title="Modifier"
                                    >
                                      <FaEdit />
                                    </button>

                                    <button
                                      type="button"
                                      className={`${styles.iconButton} ${styles.deleteButton}`}
                                      onClick={() =>
                                        handleDeleteAppreciation(
                                          appreciationId
                                        )
                                      }
                                      title="Supprimer"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() =>
                            openEditCritereModal(
                              critere
                            )
                          }
                        >
                          <FaEdit />
                          Modifier le critère
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </main>
      </div>

      {modalMode && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeCritereModal();
            }
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.modalHeader}>
              <div>
                <span>
                  {modalMode === "edit"
                    ? "Modification"
                    : "Création"}
                </span>

                <h2>
                  {modalMode === "edit"
                    ? "Modifier le critère"
                    : "Nouveau critère"}
                </h2>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeCritereModal}
                disabled={saving}
                aria-label="Fermer"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleCritereSubmit}
              className={styles.form}
            >
              <label>
                Nom du critère

                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleCritereChange}
                  placeholder="Ex : Motivation"
                  disabled={saving}
                  autoFocus
                />
              </label>

              <label>
                Description

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleCritereChange}
                  placeholder="Description du critère..."
                  disabled={saving}
                  rows="3"
                />
              </label>

              <label>
                Statut

                <select
                  name="statut"
                  value={String(formData.statut)}
                  onChange={handleCritereChange}
                  disabled={saving}
                >
                  <option value="true">
                    Actif
                  </option>

                  <option value="false">
                    Inactif
                  </option>
                </select>
              </label>

              {modalError && (
                <div className={styles.modalError}>
                  <FaExclamationCircle />
                  {modalError}
                </div>
              )}

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeCritereModal}
                  disabled={saving}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {appreciationModalMode && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeAppreciationModal();
            }
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.modalHeader}>
              <div>
                <span>
                  {appreciationModalMode === "edit"
                    ? "Modification"
                    : "Création"}
                </span>

                <h2>
                  {appreciationModalMode === "edit"
                    ? "Modifier l'appréciation"
                    : "Nouvelle appréciation"}
                </h2>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeAppreciationModal}
                disabled={saving}
                aria-label="Fermer"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleAppreciationSubmit}
              className={styles.form}
            >
              <label>
                Appréciation

                <input
                  name="libelle"
                  value={appreciationForm.libelle}
                  onChange={handleAppreciationChange}
                  placeholder="Ex : Très satisfaisante"
                  disabled={saving}
                  autoFocus
                />
              </label>

              <label>
                Points

                <input
                  type="number"
                  name="points"
                  min="0"
                  step="0.01"
                  value={appreciationForm.points}
                  onChange={handleAppreciationChange}
                  placeholder="Ex : 25"
                  disabled={saving}
                />
              </label>

              <label>
                Statut

                <select
                  name="statut"
                  value={String(
                    appreciationForm.statut
                  )}
                  onChange={handleAppreciationChange}
                  disabled={saving}
                >
                  <option value="true">
                    Actif
                  </option>

                  <option value="false">
                    Inactif
                  </option>
                </select>
              </label>

              {modalError && (
                <div className={styles.modalError}>
                  <FaExclamationCircle />
                  {modalError}
                </div>
              )}

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeAppreciationModal}
                  disabled={saving}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriteresAppreciation;