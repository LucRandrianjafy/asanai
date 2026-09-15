const API_URL = import.meta.env.VITE_API_URL;

export async function getAllDecisionFinale() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/decision-finale`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des décisions finales");
  }

  return response.json();
}

export async function getDecisionFinaleById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/decision-finale/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la décision finale");
  }

  return response.json();
}

export async function getDecisionFinaleByUserInformationId(
  idUserInformation
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/decision-finale/user-information/${idUserInformation}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la décision du candidat");
  }

  return response.json();
}

export async function getDecisionFinaleByRhId(idRh) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/decision-finale/rh/${idRh}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des décisions du RH");
  }

  return response.json();
}

export async function createDecisionFinale(
  decisionFinale
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/decision-finale`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(decisionFinale)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la décision finale");
  }

  return response.text();
}

export async function updateDecisionFinale(
  id,
  decisionFinale
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/decision-finale/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(decisionFinale)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de la décision finale");
  }

  return response.text();
}

export async function deleteDecisionFinale(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/decision-finale/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la décision finale");
  }

  return response.text();
}