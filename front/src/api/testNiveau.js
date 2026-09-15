const API_URL = import.meta.env.VITE_API_URL;

export async function getAllTestNiveaux() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau`,
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
      "Erreur lors de la récupération des tests de niveau"
    );
  }

  return response.json();
}

export async function getTestNiveauById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau/${id}`,
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
      "Erreur lors de la récupération du test de niveau"
    );
  }

  return response.json();
}

export async function getTestNiveauByUserId(idUsers) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau/user/${idUsers}`,
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
      "Erreur lors de la récupération des tests de niveau de l'utilisateur"
    );
  }

  return response.json();
}

export async function createTestNiveau(testNiveau) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(testNiveau)
    }
  );

  if (!response.ok) {

    const message = await response.text();

    console.error(
      "Erreur création test de niveau :",
      message
    );

    throw new Error(
      message ||
      "Erreur lors de la création du test de niveau"
    );
  }

  return response.json();
}