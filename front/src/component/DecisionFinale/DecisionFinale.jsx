import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import {
  createDecisionFinale,
  getAllDecisionFinale,
  updateDecisionFinale,
} from "../../api/decisionFinale";

const DECISION_OPTIONS = [
  ["admis", "Admis"],
  ["non-retenu", "Non retenu"],
  ["liste-attente", "Liste d'attente"],
];

const getDecisionId = (decision) =>
  decision?.id ?? decision?.idDecisionFinale ?? decision?.id_decision_finale;

const DecisionFinale = forwardRef(({
  idUserInformation,
  idRh,
  styles,
  onSuccess,
  onError,
}, ref) => {
  const [decision, setDecision] = useState("");
  const [existingDecision, setExistingDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDecision = async () => {
      setDecision("");
      setExistingDecision(null);
      setError("");

      if (!idUserInformation) {
        return;
      }

      try {
        setLoading(true);
        const decisions = await getAllDecisionFinale();
        const currentDecision = (Array.isArray(decisions) ? decisions : []).find(
          (item) =>
            Number(item.idUserInformation ?? item.id_user_information) ===
            Number(idUserInformation)
        );

        if (!cancelled && currentDecision) {
          setExistingDecision(currentDecision);
          setDecision(currentDecision.decision ?? "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Impossible de charger la décision finale."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDecision();

    return () => {
      cancelled = true;
    };
  }, [idUserInformation]);

  const handleSave = async () => {
    if (!decision) {
      const message = "Veuillez sélectionner une recommandation.";
      setError(message);
      onError?.(message);
      return false;
    }

    if (!idUserInformation || !idRh) {
      const message =
        "Les informations du candidat ou du RH sont incomplètes.";
      setError(message);
      onError?.(message);
      return false;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        idUserInformation: Number(idUserInformation),
        idRh: Number(idRh),
        decision,
      };

      if (existingDecision) {
        await updateDecisionFinale(getDecisionId(existingDecision), payload);
      } else {
        await createDecisionFinale(payload);
      }

      const refreshedDecisions = await getAllDecisionFinale();
      const refreshedDecision = (
        Array.isArray(refreshedDecisions) ? refreshedDecisions : []
      ).find(
        (item) =>
          Number(item.idUserInformation ?? item.id_user_information) ===
          Number(idUserInformation)
      );

      setExistingDecision(refreshedDecision ?? existingDecision);
      onSuccess?.("La recommandation finale a été enregistrée avec succès.");
      return true;
    } catch (err) {
      const message =
        err.message || "Impossible d'enregistrer la recommandation finale.";
      setError(message);
      onError?.(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  return (
    <div className={styles.recommendationSection}>
      <h3>Recommandation finale</h3>
      <p>Le RH formule une recommandation finale.</p>

      {loading && <p>Chargement de la recommandation...</p>}

      {error && <div className={styles.interviewError}>{error}</div>}

      <div className={styles.recommendationOptions}>
        {DECISION_OPTIONS.map(([value, label]) => (
          <button
            type="button"
            className={styles.recommendationOption}
            key={value}
            aria-pressed={decision === value}
            onClick={() => setDecision(value)}
            disabled={loading || saving || !idUserInformation}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>

    </div>
  );
});

export default DecisionFinale;
