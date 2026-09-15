const API_URL = import.meta.env.VITE_API_URL;

export async function getAllTestNiveauQuestions() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau-question`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des questions de test de niveau");
  }

  return response.json();
}

export async function getTestNiveauQuestionById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau-question/${id}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la question de test de niveau");
  }

  return response.json();
}

export async function getQuestionsByTestNiveauId(idTestNiveau) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau-question/test/${idTestNiveau}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des questions du test de niveau");
  }

  return response.json();
}

export async function getQuestionsByCategorieId(idCategorieQuestion) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau-question/categorie/${idCategorieQuestion}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des questions de la catégorie");
  }

  return response.json();
}

export async function updateAnswerIdx(
  id,
  answerIdx
) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${API_URL}/api/test-niveau-question/${id}/answer?answerIdx=${answerIdx}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Erreur lors de la mise à jour de answer_idx :",
        response.status,
        errorText
      );

      throw new Error(
        errorText ||
          "Erreur lors de l'enregistrement de la réponse"
      );
    }

    return await response.text();

  } catch (error) {

    console.error(
      "Erreur updateAnswerIdx :",
      error
    );

    console.error(
      "Stack trace :",
      error?.stack
    );

    throw error;
  }
}

export async function createTestNiveauQuestion(question) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau-question`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(question)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
      "Erreur lors de la création de la question"
    );
  }

  return response.text();
}


export async function updateTestNiveauQuestion(
  id,
  question
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau-question/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(question)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
      "Erreur lors de la modification de la question"
    );
  }

  return response.text();
}


export async function deleteTestNiveauQuestion(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/test-niveau-question/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText ||
      "Erreur lors de la suppression de la question"
    );
  }

  return response.text();
}