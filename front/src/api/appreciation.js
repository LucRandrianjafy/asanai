const API_URL = import.meta.env.VITE_API_URL;

export async function getAllAppreciation() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des appréciations");
  }

  return response.json();
}

export async function getAllAppreciationActif() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation/actif`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des appréciations actives");
  }

  return response.json();
}

export async function getAppreciationById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'appréciation");
  }

  return response.json();
}

export async function getAppreciationByCritereId(idCritere) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation/critere/${idCritere}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des appréciations du critère"
    );
  }

  return response.json();
}

export async function getAppreciationActifByCritereId(idCritere) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation/critere/${idCritere}/actif`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des appréciations actives du critère"
    );
  }

  return response.json();
}

export async function createAppreciation(data) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la création de l'appréciation");
  }

  return response.text();
}

export async function updateAppreciation(id, data) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de l'appréciation");
  }

  return response.text();
}

export async function deleteAppreciation(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/appreciation/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'appréciation");
  }

  return response.text();
}