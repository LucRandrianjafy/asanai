import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaEdit,
  FaExclamationCircle,
  FaGraduationCap,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import styles from "./Programmes.module.css";
import Sidebar from "../../pages/Sidebar";
import Header from "../../component/Header/Header";
import {
  createProgramme,
  getAllProgrammes,
  updateProgramme,
} from "../../api/programme";

const EMPTY_FORM = {
  nom: "",
  statut: true, // true = Actif, false = Inactif
};

const getProgrammeId = (programme) =>
  programme.idProgramme ?? programme.id_programme ?? programme.id;

// Convertit la valeur reçue du backend (Boolean ou éventuellement string) en booléen
const toBooleanStatut = (statut) => {
  if (typeof statut === "boolean") return statut;
  if (typeof statut === "string") {
    return (
      statut.toLowerCase() === "actif" || statut.toLowerCase() === "true"
    );
  }
  return true;
};

const Programmes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllProgrammes();
      setProgrammes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Impossible de récupérer les programmes.");
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const filteredProgrammes = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return programmes;

    return programmes.filter((programme) =>
      String(programme.nom ?? programme.nomProgramme ?? "")
        .toLowerCase()
        .includes(value)
    );
  }, [programmes, search]);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalError("");
  };

  const openEditModal = (programme) => {
    setModalMode("edit");
    setEditingId(getProgrammeId(programme));
    setFormData({
      nom: programme.nom ?? programme.nomProgramme ?? "",
      statut: toBooleanStatut(programme.statut),
    });
    setModalError("");
  };

  const closeModal = () => {
    if (saving) return;
    setModalMode(null);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "statut") {
      setFormData((current) => ({ ...current, statut: value === "true" }));
      return;
    }

    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nom = formData.nom.trim();

    if (!nom) {
      setModalError("Le nom du programme est obligatoire.");
      return;
    }

    try {
      setSaving(true);
      setModalError("");
      const payload = { nom, statut: formData.statut };

      if (modalMode === "edit") {
        await updateProgramme(editingId, payload);
      } else {
        await createProgramme(payload);
      }

      setModalMode(null);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      setModalError("");
      await fetchProgrammes();
    } catch (err) {
      setModalError(
        err.message ||
          "Une erreur est survenue lors de l'enregistrement du programme."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header title="Programmes" showSearch={false} />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div>
              <h1>Gestion des programmes</h1>
              <p>Créez et mettez à jour les programmes disponibles.</p>
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={openCreateModal}
            >
              <FaPlus />
              Nouveau programme
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <FaSearch />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un programme..."
                aria-label="Rechercher un programme"
              />
            </div>
            <strong>{programmes.length} programme(s)</strong>
          </div>

          {loading && (
            <div className={styles.stateMessage}>
              <div className="spinner-border" role="status" aria-hidden="true" />
              Chargement des programmes...
            </div>
          )}

          {!loading && error && (
            <div className={styles.stateMessage}>
              <FaExclamationCircle />
              <span>{error}</span>
              <button type="button" onClick={fetchProgrammes}>
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && filteredProgrammes.length === 0 && (
            <div className={styles.emptyState}>
              <FaGraduationCap />
              <h2>Aucun programme</h2>
              <p>Créez un programme ou modifiez votre recherche.</p>
            </div>
          )}

          {!loading && !error && filteredProgrammes.length > 0 && (
            <div className={styles.programmesGrid}>
              {filteredProgrammes.map((programme) => {
                const id = getProgrammeId(programme);
                const nom = programme.nom ?? programme.nomProgramme ?? "Sans nom";
                const isActive = toBooleanStatut(programme.statut);
                const statutLabel = isActive ? "Actif" : "Inactif";

                return (
                  <article className={styles.programmeCard} key={id}>
                    <div className={styles.cardIcon}>
                      <FaGraduationCap />
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardHeader}>
                        <div>
                          <span className={styles.cardId}>#{id}</span>
                          <h2>{nom}</h2>
                        </div>
                        <span
                          className={`${styles.status} ${
                            isActive ? styles.active : styles.inactive
                          }`}
                        >
                          {statutLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => openEditModal(programme)}
                      >
                        <FaEdit />
                        Modifier
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
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <div>
                <span>{modalMode === "edit" ? "Modification" : "Création"}</span>
                <h2>
                  {modalMode === "edit"
                    ? "Modifier le programme"
                    : "Nouveau programme"}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
                disabled={saving}
                aria-label="Fermer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Nom du programme
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex : Cohorte 1"
                  disabled={saving}
                  autoFocus
                />
              </label>

              <label>
                Statut
                <select
                  name="statut"
                  value={String(formData.statut)}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
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
                  onClick={closeModal}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programmes;