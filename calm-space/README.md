# CalmSpace 💜

> Le site **Calm Bubble Haven**
> (Express.js + PostgreSQL + JWT — React CRA + TypeScript + Tailwind CSS)

## Architecture

```
calm-space/
├── backend/          → Express.js + PostgreSQL + JWT
└── frontend/         → React CRA + TypeScript + Tailwind CSS
```

---

## Backend

**Stack :** Node.js · Express.js · PostgreSQL · JWT · bcrypt

### Installation

```bash
cd backend
npm install
```

### Variables d'environnement (.env)
```
PORT=5001
USR=<postgres_user>
HOST=localhost
DB=<database_name>
PSWD=<postgres_password>
SECRET_KEY=<votre_clé_secrète>
```

### Base de données

1. Exécuter d'abord le schéma principal (`schema.sql`)
2. Puis exécuter les additions CalmSpace :

```bash
psql -U <user> -d <database> -f schema_additions.sql
```

**Nouvelles tables créées :**
- `emotions` — Journal des émotions des utilisateurs
- `favorites` — Favoris de faits réconfortants/amusants
- `stress_assessments` — Résultats du diagnostic Holmes-Rahe

### Démarrage

```bash
npm start        # production
npm run dev      # développement avec nodemon
```

### Routes API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/auth/signup` | — | Inscription |
| POST | `/auth/signin` | — | Connexion |
| GET | `/auth/authme` | ✓ | Utilisateur connecté |
| POST | `/auth/logout` | ✓ | Déconnexion |
| PUT | `/auth/updateprofile` | ✓ | Modifier son profil |
| GET | `/emotions` | ✓ | Récupérer ses émotions |
| POST | `/emotions` | ✓ | Enregistrer une émotion |
| DELETE | `/emotions/:id` | ✓ | Supprimer une émotion |
| GET | `/favorites` | ✓ | Récupérer ses favoris |
| POST | `/favorites` | ✓ | Ajouter un favori |
| DELETE | `/favorites/:id` | ✓ | Supprimer un favori |
| GET | `/stress` | ✓ | Récupérer ses diagnostics |
| POST | `/stress` | ✓ | Sauvegarder un diagnostic |

---

## Frontend

**Stack :** React · TypeScript · Tailwind CSS · React Router

### Installation

```bash
cd frontend
npm install
```

### Démarrage

```bash
npm start
```

L'application sera disponible sur `http://localhost:3000`

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Accueil avec présentation des outils |
| `/faits` | FaitsPage | Faits réconfortants & amusants + favoris |
| `/respiration` | RespirPage | Exercice de respiration guidé (bulle animée) |
| `/emotions` | EmotionsPage | Suivi des émotions + historique |
| `/diagnostic` | DiagnosticPage | Test de stress Holmes-Rahe |
| `/connexion` | ConnexionPage | Connexion |
| `/inscription` | InscriptionPage | Inscription (form complet) |
| `/profil` | ProfilePage | Profil utilisateur + modification |

---

## Différences avec les projets d'origine

| | Calm Bubble Haven | CalmSpace (ce projet) |
|--|--|--|
| Backend | Supabase (BaaS) | Express.js + PostgreSQL + JWT |
| Auth | Supabase Auth | JWT via cookies httpOnly |
| Frontend builder | Vite | React CRA |
| UI components | shadcn/ui | Tailwind CSS pur |
| Inscription | Email + password seulement | Form complet (nom, prénom, ville…) |
| Animations | CSS variables shadcn | Tailwind keyframes |
