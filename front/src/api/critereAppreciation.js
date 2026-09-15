const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCritereAppreciation() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/critere-appreciation`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des critères");
  }

  return response.json();
}

export async function getAllCritereAppreciationActif() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/critere-appreciation/actif`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des critères actifs");
  }

  return response.json();
}

export async function getCritereAppreciationById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/critere-appreciation/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du critère");
  }

  return response.json();
}

export async function createCritereAppreciation(critere) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/critere-appreciation`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(critere)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la création du critère");
  }

  return response.text();
}

export async function updateCritereAppreciation(id, critere) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/critere-appreciation/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(critere)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la modification du critère");
  }

  return response.text();
}

export async function deleteCritereAppreciation(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/critere-appreciation/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du critère");
  }

  return response.text();
}