const API_URL = import.meta.env.VITE_API_URL;

export async function getAllUserProgrammes() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-programme`,
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
      "Erreur lors de la récupération des utilisateurs et programmes"
    );
  }

  return response.json();
}

export async function getUserProgrammeById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-programme/${id}`,
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
      "Erreur lors de la récupération des informations de l'utilisateur"
    );
  }

  return response.json();
}

export async function getUserProgrammesByProgrammeId(programmeId) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-programme/programme/${programmeId}`,
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
      "Erreur lors de la récupération des utilisateurs du programme"
    );
  }

  return response.json();
}