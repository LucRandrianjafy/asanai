const API_URL = import.meta.env.VITE_API_URL;


// =========================================================
// GET : Toutes les notifications
// =========================================================

export async function getAllNotifications() {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification`,
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
      "Erreur lors de la récupération des notifications"
    );
  }

  return response.json();
}


// =========================================================
// GET : Notification par ID
// =========================================================

export async function getNotificationById(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/${id}`,
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
      "Erreur lors de la récupération de la notification"
    );
  }

  return response.json();
}


// =========================================================
// GET : Notifications d'un utilisateur
// =========================================================

export async function getNotificationsByUserId(idUser) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/user/${idUser}`,
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
      "Erreur lors de la récupération des notifications de l'utilisateur"
    );
  }

  return response.json();
}


// =========================================================
// GET : Notifications non vues d'un utilisateur
// =========================================================

export async function getNotificationsNonVuesByUserId(idUser) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/user/${idUser}/non-vues`,
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
      "Erreur lors de la récupération des notifications non vues"
    );
  }

  return response.json();
}


// =========================================================
// GET : Nombre de notifications non vues
// =========================================================

export async function countNotificationsNonVuesByUserId(idUser) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/user/${idUser}/non-vues/count`,
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
      "Erreur lors du comptage des notifications non vues"
    );
  }

  return response.json();
}


// =========================================================
// POST : Créer une notification
// =========================================================

export async function createNotification(notification) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(notification)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la création de la notification"
    );
  }

  return response.json();
}


// =========================================================
// PUT : Modifier une notification
// =========================================================

export async function updateNotification(id, notification) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

      body: JSON.stringify(notification)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la modification de la notification"
    );
  }

  return response.json();
}


// =========================================================
// PUT : Marquer une notification comme vue
// =========================================================

export async function marquerCommeVue(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/${id}/vue`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors du marquage de la notification comme vue"
    );
  }

  return response.json();
}


// =========================================================
// PUT : Marquer toutes les notifications comme vues
// =========================================================

export async function marquerToutesCommeVues(idUser) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/user/${idUser}/toutes-vues`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors du marquage de toutes les notifications comme vues"
    );
  }

  return response.json();
}


// =========================================================
// DELETE : Supprimer une notification
// =========================================================

export async function deleteNotification(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/notification/${id}`,
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
      "Erreur lors de la suppression de la notification"
    );
  }

  return response.json();
}