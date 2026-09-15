const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCandidatsScores() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/vue-candidats-scores`,
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
      "Erreur lors de la récupération des candidats et de leurs scores"
    );
  }

  return response.json();
}

export async function getCandidatScoreById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/vue-candidats-scores/${id}`,
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
      "Erreur lors de la récupération du candidat et de son score"
    );
  }

  return response.json();
}