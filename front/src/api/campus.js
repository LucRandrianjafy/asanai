const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCampus() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/campus`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des campus");
  }

  return response.json();
}


export async function getCampusById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/campus/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du campus");
  }

  return response.json();
}