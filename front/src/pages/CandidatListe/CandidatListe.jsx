import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaUser,
  FaSearch,
  FaEllipsisV,
  FaGraduationCap,
} from "react-icons/fa";

import styles from "./CandidatListe.module.css";

import { getAllUserProgrammes } from "../../api/userProgramme";
import { getAllProgrammes } from "../../api/programme";

function CandidatListe({
  title = "Gestion des candidats",
  subtitle = "Consultez les candidats inscrits",
  detailsPath = "/admin/candidat",
}) {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [programmes, setProgrammes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchCandidates();
    fetchProgrammes();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const userProgrammeRows = await getAllUserProgrammes();

      console.log("Utilisateurs et programmes récupérés :", userProgrammeRows);
      console.log(
        "userInformationId de la première ligne :",
        userProgrammeRows?.[0]?.userInformationId,
        userProgrammeRows?.[0]
      );

      const formattedCandidates = userProgrammeRows.map((row) => ({
        id: Number(row.userId),
        userInformationId: Number(row.userInformationId),

        firstname: row.prenom,
        lastname: row.nom,

        email: row.email,
        phone: row.telephone,
        adresse: row.adresse,
        residenceTana: row.residenceTana,

        dateNaissance: row.dateNaissance,
        genre: row.genre,

        cin: row.cin,
        cinDateDelivrance: row.cinDateDelivrance,
        cinLieuDelivrance: row.cinLieuDelivrance,

        dernierDiplomeObtenu: row.dernierDiplomeObtenu,

        regionId: row.regionId,
        regionNom: row.regionNom,

        programmeId: Number(row.programmeId),
        programmeNom: row.programmeNom,

        niveauEtudes: row.niveauEtudes,

        independanceFinanciere: row.independanceFinanciere,
        disponibiliteEngagment: row.disponibiliteEngagment,
        dateDisponibilite: row.dateDisponibilite,

        interetPoste: row.interetPoste,
        niveauFrancais: row.niveauFrancais,
        clareteOrale: row.clareteOrale,
        comprehensionOrale: row.comprehensionOrale,

        cinFichier: row.cinFichier,
        dernierDiplomeFichier: row.dernierDiplomeFichier,
        cvFichier: row.cvFichier,

        dateInfo: row.dateInfo,
      }));

      console.log(
        "Candidats formatés avec userInformationId :",
        formattedCandidates.map((candidate) => ({
          id: candidate.id,
          userInformationId: candidate.userInformationId,
          userInformationIdBrut: userProgrammeRows.find(
            (row) => Number(row.userId) === candidate.id
          )?.userInformationId,
        }))
      );

      setCandidates(formattedCandidates);
    } catch (err) {
      console.error("Erreur récupération des candidats :", err);
      console.error(err.stack);

      setError("Erreur lors de la récupération des candidats.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgrammes = async () => {
    try {
      const data = await getAllProgrammes();

      console.log("Programmes récupérés :", data);

      setProgrammes(data || []);
    } catch (err) {
      console.error("Erreur récupération des programmes :", err);
      console.error(err.stack);
    }
  };

  const getProgrammeName = (candidate) => {
    if (candidate.programmeNom) {
      return candidate.programmeNom;
    }

    const programme = programmes.find(
      (item) => Number(item.id) === Number(candidate.programmeId)
    );

    return programme ? programme.nom : "Non renseigné";
  };

  const handleCandidateClick = (candidate) => {
    console.log("Candidat envoyé vers la vue détail :", candidate);
    console.log(
      "userInformationId envoyé vers la vue détail :",
      candidate.userInformationId
    );

    navigate(`${detailsPath}/${candidate.id}`, {
      state: {
        candidate: candidate,
      },
    });
  };

  const handleMenuClick = (event, candidateId) => {
    event.stopPropagation();

    setOpenMenuId(openMenuId === candidateId ? null : candidateId);
  };

  const handleModifier = (event, candidate) => {
    event.stopPropagation();

    setOpenMenuId(null);

    console.log("Modifier le candidat :", candidate);
  };

  const handleArchiver = (event, candidate) => {
    event.stopPropagation();

    setOpenMenuId(null);

    console.log("Archiver le candidat :", candidate);
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const fullName = `${candidate.firstname || ""} ${
      candidate.lastname || ""
    }`.toLowerCase();

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      fullName.includes(search) ||
      (candidate.email || "").toLowerCase().includes(search) ||
      (candidate.cin || "").toLowerCase().includes(search) ||
      (candidate.phone || "").toLowerCase().includes(search);

    const matchesProgramme =
      !selectedProgramme ||
      Number(candidate.programmeId) === Number(selectedProgramme);

    return matchesSearch && matchesProgramme;
  });

  return (
    <div className={styles.listeContainer}>
      {/* =====================================================
          HEADER DE PAGE
          GAUCHE : TITRE + SOUS-TITRE
          DROITE : RECHERCHE + PROGRAMME
      ===================================================== */}
      <div className={styles.pageHeader}>
        {/* GAUCHE */}
        <div className={styles.pageHeaderText}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* DROITE */}
        <div className={styles.headerActions}>
          {/* RECHERCHE */}
          <div className={styles.searchContainer}>
            <FaSearch />

            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* PROGRAMME */}
          <select
            value={selectedProgramme}
            onChange={(e) => setSelectedProgramme(e.target.value)}
            className={styles.programmeSelect}
          >
            <option value="">Tous les programmes</option>

            {programmes.map((programme) => (
              <option key={programme.id} value={programme.id}>
                {programme.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          STATISTIQUES
      ===================================================== */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUser />
          </div>

          <div>
            <div className={styles.statValue}>{candidates.length}</div>
            <div className={styles.statLabel}>Candidats</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaGraduationCap />
          </div>

          <div>
            <div className={styles.statValue}>{programmes.length}</div>
            <div className={styles.statLabel}>Programmes</div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHARGEMENT
      ===================================================== */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>

          <p className="mt-3">Chargement des candidats...</p>
        </div>
      )}

      {/* =====================================================
          ERREUR
      ===================================================== */}
      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {/* =====================================================
          TABLEAU
      ===================================================== */}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          <table className={`table ${styles.candidatesTable}`}>
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Programme</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.empty}>
                    Aucun candidat trouvé.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    {/* CANDIDAT */}
                    <td>
                      <div className={styles.candidateInfo}>
                        <div className={styles.avatar}>
                          {candidate.firstname?.charAt(0)?.toUpperCase()}
                          {candidate.lastname?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <button
                            type="button"
                            className={styles.candidateName}
                            onClick={() => handleCandidateClick(candidate)}
                          >
                            {candidate.firstname} {candidate.lastname}
                          </button>

                          <div className={styles.candidateCin}>
                            CIN : {candidate.cin || "Non renseigné"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PROGRAMME */}
                    <td>
                      <span className={styles.programmeBadge}>
                        {getProgrammeName(candidate)}
                      </span>
                    </td>

                    {/* EMAIL */}
                    <td>
                      <span className={styles.email}>
                        {candidate.email || "Non renseigné"}
                      </span>
                    </td>

                    {/* TELEPHONE */}
                    <td>
                      <span className={styles.phone}>
                        {candidate.phone || "Non renseigné"}
                      </span>
                    </td>

                    {/* STATUT */}
                    <td>
                      <span className={styles.status}></span>
                    </td>

                    {/* ACTION */}
                    <td>
                      <div className={styles.actionContainer}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={(event) =>
                            handleMenuClick(event, candidate.id)
                          }
                          aria-label="Actions"
                        >
                          <FaEllipsisV />
                        </button>

                        {openMenuId === candidate.id && (
                          <div
                            className={styles.actionMenu}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={(event) =>
                                handleModifier(event, candidate)
                              }
                            >
                              Modifier
                            </button>

                            <button
                              type="button"
                              onClick={(event) =>
                                handleArchiver(event, candidate)
                              }
                            >
                              Archiver
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CandidatListe;