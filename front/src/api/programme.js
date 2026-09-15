const API_URL = import.meta.env.VITE_API_URL;

export async function getAllProgrammes() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/programme`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des programmes");
  }

  return response.json();
}

export async function getProgrammeById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/programme/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du programme");
  }

  return response.json();
}

export async function createProgramme(programme) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/programme`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify({
        nom: programme.nom,
        statut: programme.statut
      })
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la création du programme");
  }

  return response.json();
}

export async function updateProgramme(id, programme) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/programme/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify({
        nom: programme.nom,
        statut: programme.statut
      })
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la modification du programme");
  }

  return response.json();
}