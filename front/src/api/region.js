const API_URL = import.meta.env.VITE_API_URL;

export async function getAllRegions() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/region`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des régions");
  }

  return response.json();
}

export async function getRegionById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/region/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la région");
  }

  return response.json();
}