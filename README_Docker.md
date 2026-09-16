# Asanai - Setup Docker

Ce projet se lance avec Docker Compose autour de trois services :

- `nginx` : sert le front React buildé et proxy `/api` vers le back.
- `backend` : application Spring Boot, accessible uniquement sur le network Docker.
- `postgres` : base PostgreSQL initialisée avec les scripts du dossier `conception/`.

Seul le port Nginx est exposé sur la machine hôte : `80:80`.

## Prérequis

- Docker
- Docker Compose
- Le port `80` disponible sur la machine

Si le port `80` est déjà utilisé, arrêter le service concerné ou modifier temporairement le mapping dans `docker-compose.yml`.

## Configuration

Créer le fichier `.env` à partir de l'exemple :

```bash
cp .env.example .env
```

Puis renseigner les valeurs nécessaires :

```env
POSTGRES_DB=asanai
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me

JWT_SECRET=change-me-with-a-long-random-secret

SPRING_MAIL_USERNAME=
SPRING_MAIL_PASSWORD=

AI_API_KEY=
```

Le fichier `.env` est obligatoire pour Docker Compose et ne doit pas être commité.

## Lancement

Depuis la racine du projet :

```bash
docker compose up --build
```

L'application est ensuite disponible sur :

```text
http://localhost
```

Le front appelle l'API via `/api`. Nginx redirige ensuite vers le service `backend` sur le network Docker interne.

## Initialisation de la base

Au premier démarrage du volume PostgreSQL, Docker exécute automatiquement tous les scripts SQL présents dans :

```text
conception/
```

Ils sont exécutés dans l'ordre alphabétique :

```text
1-table.sql
2-data.sql
3-function.sql
4-view.sql
```

Important : ces scripts ne sont rejoués automatiquement que lorsque le volume PostgreSQL est créé pour la première fois.

## Réinitialiser la base locale

Pour supprimer la base Docker locale et rejouer les scripts SQL :

```bash
docker compose down -v
docker compose up --build
```

Attention : `down -v` supprime les données PostgreSQL du volume Docker local.

## Arrêt

```bash
docker compose down
```

## Logs utiles

Voir tous les logs :

```bash
docker compose logs -f
```

Voir uniquement les logs du back :

```bash
docker compose logs -f backend
```

Voir uniquement les logs de PostgreSQL :

```bash
docker compose logs -f postgres
```

## Notes développeurs

- Le backend n'expose pas son port sur l'hôte. Il est seulement accessible par Nginx via `backend:8080`.
- Le front est buildé avec `VITE_API_URL=/api` dans Docker.
- Le fichier `front/.env` local n'est pas copié dans l'image Docker.
- PostgreSQL 18 utilise un montage sur `/var/lib/postgresql`, pas `/var/lib/postgresql/data`.
