const API_URL = import.meta.env.VITE_API_URL;

export async function signin(email, password) {

  const response = await fetch(
    `${API_URL}/api/users/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: email,
        password: password
      })
    }
  );

  if (!response.ok) {

    let message = "Erreur lors de la connexion";

    try {
      const error = await response.text();

      if (error) {
        message = error;
      }
    } catch (e) {
      // rien
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getAllUsers() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/users`,
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
      "Erreur lors de la récupération des utilisateurs"
    );
  }

  return response.json();
}

export async function getUserById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/users/${id}`,
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
      "Erreur lors de la récupération de l'utilisateur"
    );
  }

  return response.json();
}

export async function updateUser(id, userData) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/users/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(userData)
    }
  );

  if (!response.ok) {

    let message =
      "Erreur lors de la modification de l'utilisateur";

    try {
      const error = await response.text();

      if (error) {
        message = error;
      }
    } catch (e) {
      // rien
    }

    throw new Error(message);
  }

  return response.json();
}

export async function deleteUser(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/users/${id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la suppression de l'utilisateur"
    );
  }

  return response.json();
}

export const signup = async (userData) => {
  try {
    const response = await fetch(
      `${API_URL}/api/users/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const responseText = await response.text();

    console.log("=================================");
    console.log("STATUS :", response.status);
    console.log("REPONSE BACKEND :", responseText);
    console.log("=================================");

    if (!response.ok) {

      throw new Error(
        responseText ||
        `Erreur lors de l'inscription (${response.status})`
      );
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    return data;

  } catch (error) {

    console.error("Erreur signup :", error);
    
    throw error;
  }
};

export async function createUser(userData) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/users`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        }
    );

    if (!response.ok) {
        let message = "Erreur lors de la création de l'utilisateur";

        try {
            const error = await response.text();

            if (error) {
                message = error;
            }
        } catch (e) {
            // rien
        }

        throw new Error(message);
    }

    return response.json();
}