const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCandidatAppreciation() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/candidat-appreciation`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des appréciations des candidats");
  }

  return response.json();
}

export async function getCandidatAppreciationById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/candidat-appreciation/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'appréciation du candidat");
  }

  return response.json();
}

export async function getCandidatAppreciationByUserInformationId(
  idUserInformation
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/candidat-appreciation/user-information/${idUserInformation}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des appréciations du candidat");
  }

  return response.json();
}

export async function createCandidatAppreciation(
  candidatAppreciation
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/candidat-appreciation`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(candidatAppreciation)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la création de l'appréciation du candidat");
  }

  return response.text();
}

export async function updateCandidatAppreciation(
  id,
  candidatAppreciation
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/candidat-appreciation/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(candidatAppreciation)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de l'appréciation du candidat");
  }

  return response.text();
}

export async function deleteCandidatAppreciation(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/candidat-appreciation/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'appréciation du candidat");
  }

  return response.text();
}