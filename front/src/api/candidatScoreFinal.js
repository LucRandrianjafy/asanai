const API_URL = import.meta.env.VITE_API_URL;

export async function getAllCandidatsScores() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/candidats-scores`,
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
            "Erreur lors de la récupération des scores des candidats"
        );
    }

    return response.json();
}

export async function getCandidatScoreById(idUser) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/candidats-scores/${idUser}`,
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
            "Erreur lors de la récupération du score du candidat"
        );
    }

    return response.json();
}
