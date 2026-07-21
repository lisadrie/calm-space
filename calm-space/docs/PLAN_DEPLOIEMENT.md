# Plan de déploiement — CalmSpace

> Document technique — Bloc 3 « Déployer et sécuriser les applications informatiques »
> Application CESIZen / CalmSpace

---

## 1. Objectif

Décrire, étape par étape, la stratégie de déploiement de CalmSpace permettant au Ministère de
**déléguer le déploiement** de la solution : environnements, outils de **versioning**, chaîne
d'**intégration continue** (automatisation) et ressources nécessaires.

---

## 2. Architecture applicative

L'application est conteneurisée avec **Docker** et orchestrée par **Docker Compose**.

```
   Navigateur utilisateur
        │
        ├─►  http://.../          ┌────────────────────┐
        │    (interface)          │  frontend          │
        │                         │  React + nginx     │
        │                         └────────────────────┘
        │
        └─►  http://.../api       ┌────────────────────┐
             (appels REST)        │  backend           │
                                  │  Node.js / Express │
                                  └─────────┬──────────┘
                                            │ réseau privé Docker
                                            ▼
                                  ┌────────────────────┐
                                  │  db                │
                                  │  PostgreSQL 16     │
                                  └────────────────────┘
```

| Service | Rôle | Image / Base |
|---------|------|--------------|
| `frontend` | Interface React compilée, servie en statique | build React → nginx |
| `backend` | API REST (métier, authentification) | Node.js 24 (LTS) |
| `db` | Base de données relationnelle | PostgreSQL 16 |

**Bénéfices :** environnement **reproductible** (une commande `docker compose up --build`),
**isolé**, et **portable** (identique sur n'importe quelle machine).

---

## 3. Les environnements de déploiement

| Environnement | Rôle | Hébergement | Données |
|---------------|------|-------------|---------|
| **Développement** | Codage et tests locaux du développeur | Poste local (`npm run dev`) | Jeu de données de test |
| **Test / Recette** | Validation fonctionnelle avant mise en production | **Docker Compose** (environnement réellement configuré) | Données anonymisées |
| **Production** | Application ouverte au grand public | Serveur / hébergeur cloud (UE, RGPD) | Données réelles chiffrées |

> Dans le cadre de cette activité, l'environnement **réellement mis en place et configuré** est
> l'environnement de **test** via Docker Compose (voir §6).

---

## 4. Versioning des sources

| Élément | Choix |
|--------|-------|
| Outil | **Git** + hébergement **GitHub** |
| Branche principale | `master` — toujours stable et déployable |
| Branches de travail | `feat/...`, `fix/...` — une par fonctionnalité/correctif |
| Intégration | **Pull Request** relue, fusionnée seulement si la CI est verte |
| Traçabilité | Historique des commits, messages descriptifs, liens vers les tickets |

**Bonnes pratiques appliquées :** aucun développement directement sur `master`, revue de code via
Pull Request, `.gitignore` excluant les secrets (`.env`) et les dépendances (`node_modules`).

---

## 5. Automatisation et intégration continue (CI/CD)

L'automatisation repose sur **GitHub Actions** (fichier `.github/workflows/ci.yml`). À chaque
**push** ou **Pull Request**, deux tâches s'exécutent **automatiquement** en parallèle :

| Job | Déclenchement | Étapes automatisées |
|-----|---------------|--------------------|
| **Backend** | push + Pull Request | `npm ci` → **ESLint** (analyse statique) → **Jest** (43 tests unitaires) |
| **Frontend** | push + Pull Request | `npm ci` → **build** de production React |
| **Deploy** | push sur `master` **uniquement** | build des images Docker → **publication automatique** sur `ghcr.io` |

**Rôle de l'intégration continue :** empêcher l'intégration de code cassé ou non conforme. Une
Pull Request ne peut être fusionnée que si **tous les tests passent** (garantie de non-régression).

**Rôle du déploiement continu :** une fois la CI **terminée et verte**, le déploiement se fait
**automatiquement**, sans intervention humaine. Le job `deploy` construit les images Docker du
backend et du frontend, puis les publie sur le registre **GitHub Container Registry (ghcr.io)**
avec deux étiquettes : `latest` (dernière version stable) et le **SHA du commit** (permet de
revenir à n'importe quelle version précédente en cas d'incident).

Le job `deploy` est conditionné par :
- `needs: [backend, frontend]` → il ne démarre **que si les deux jobs de test ont réussi** ;
- `if: push sur master` → une Pull Request est **testée mais jamais déployée**.

L'authentification au registre utilise le `GITHUB_TOKEN` fourni automatiquement par GitHub
Actions : **aucun mot de passe n'est stocké dans le dépôt**.

```
   Développeur              GitHub Actions                      Résultat
   ───────────              ──────────────                      ────────
                         ┌─ Backend  : lint + tests ─┐
   git push (PR)  ─────► │                           │──►  ❌ échec  : fusion bloquée
                         └─ Frontend : lint + build ─┘     ✅ verts  : fusion autorisée
                                       │
   merge sur master ───────────────────▼
                            Deploy (si CI verte)      ──►  Images Docker publiées
                            build + push ghcr.io           automatiquement sur ghcr.io
```

Sur l'environnement cible, la mise à jour se résume alors à :

```bash
docker compose pull && docker compose up -d
```

---

## 6. Étapes de déploiement (environnement de test — Docker)

### 6.1 Pré-requis (ressources nécessaires)

- **Docker** et **Docker Compose** installés sur la machine cible.
- Accès au dépôt Git (sources).
- Variables d'environnement (secrets) définies (voir `.env.docker.example`).

### 6.2 Procédure

| # | Étape | Commande / Action | Automatisé ? |
|---|-------|-------------------|:---:|
| 1 | Récupérer les sources | `git clone` / `git pull` | — |
| 2 | Construire les images | `docker compose build` | ✅ |
| 3 | Démarrer la base + injecter le schéma | (au 1er `up`, automatique) | ✅ |
| 4 | Démarrer backend + frontend | `docker compose up -d` | ✅ |
| 5 | Vérifier l'état | `docker compose ps` | ✅ |
| 6 | Accéder à l'application | `http://localhost:3000` | — |

En pratique, **une seule commande** enchaîne les étapes 2 à 5 :

```bash
docker compose up --build -d
```

### 6.3 Ressources par environnement

| Environnement | Ressources indicatives |
|---------------|------------------------|
| Développement | Poste développeur (Node.js, PostgreSQL local) |
| Test (Docker) | Machine avec Docker — 2 vCPU / 2 Go RAM suffisants |
| Production | Serveur/hébergeur cloud UE, HTTPS, sauvegardes, supervision |

---

## 7. Vers la production

Pour un déploiement en production, la même image Docker serait déployée sur un hébergeur
(ex. serveur dédié, ou plateforme type Render/Railway/Scaleway en UE), avec en complément :

- **HTTPS/TLS** obligatoire (certificat, redirection HTTP→HTTPS) ;
- **Secrets** injectés par l'hébergeur (jamais dans le dépôt) ;
- **Sauvegardes** régulières de la base de données ;
- **Supervision** et journalisation pour la détection d'incidents (lien avec le plan de sécurisation).

---

## 8. Synthèse

| Exigence du Bloc 3 | Réponse apportée |
|--------------------|------------------|
| Environnements décrits | Développement / Test / Production (§3) |
| Environnement réellement configuré | Docker Compose (§6) |
| Outil de versioning | Git + GitHub, stratégie de branches + PR (§4) |
| Automatisation / intégration continue | GitHub Actions : lint + tests + build (§5) |
| Déploiement automatisé | Job `deploy` déclenché automatiquement après une CI verte : publication des images Docker sur ghcr.io (§5) |
| Étapes et ressources | Procédure détaillée + ressources (§6) |

---

*Document réalisé dans le cadre de l'évaluation du Bloc 3 — CDA CESIZen.*
