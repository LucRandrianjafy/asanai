const API_URL = import.meta.env.VITE_API_URL;

export async function getUserInformationByUserId(idUser) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-information/user/${idUser}`,
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
      "Erreur lors de la récupération des informations utilisateur"
    );
  }

  return response.json();
}

export async function getUserInformationById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-information/${id}`,
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
      "Erreur lors de la récupération des informations"
    );
  }

  return response.json();
}

export async function getAllUserInformation() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-information`,
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
      "Erreur lors de la récupération des informations"
    );
  }

  return response.json();
}

export async function createUserInformation(
  informationData
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-information`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(informationData)
    }
  );

  if (!response.ok) {

    let message =
      "Erreur lors de la création des informations utilisateur";

    try {

      const error = await response.text();

      if (error) {
        message = error;
      }

    } catch (e) {
    }

    throw new Error(message);
  }

  return response.json();
}

export async function updateUserInformation(
  id,
  informationData
) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-information/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(informationData)
    }
  );

  if (!response.ok) {

    let message =
      "Erreur lors de la modification des informations";

    try {

      const error = await response.text();

      if (error) {
        message = error;
      }

    } catch (e) {
    }

    throw new Error(message);
  }

  return response.json();
}

export async function deleteUserInformation(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/user-information/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {

    let message =
      "Erreur lors de la suppression des informations";

    try {

      const error = await response.text();

      if (error) {
        message = error;
      }

    } catch (e) {
    }

    throw new Error(message);
  }

  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}