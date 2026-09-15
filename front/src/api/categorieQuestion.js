const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCategorieQuestions() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/categorie-question`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des catégories de questions");
  }

  return response.json();
}

export async function getCategorieQuestionById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/categorie-question/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la catégorie de question");
  }

  return response.json();
}