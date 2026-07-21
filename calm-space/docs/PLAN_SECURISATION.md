# Plan de sécurisation — CalmSpace

> Document technique — Bloc 3 « Déployer et sécuriser les applications informatiques »
> Application CESIZen / CalmSpace — plateforme de gestion du stress et de la santé mentale

---

## 1. Contexte et périmètre

CalmSpace est une application web (React) adossée à une API REST (Node.js/Express) et une base
de données PostgreSQL, avec authentification par jetons JWT.

**Enjeu majeur de sécurité :** l'application manipule des informations relatives aux **émotions,
au niveau de stress et à la santé mentale** des utilisateurs. Au sens de l'**article 9 du RGPD**,
ces données constituent des **données de santé**, c'est-à-dire des **données sensibles** bénéficiant
d'une protection renforcée. Une fuite aurait un impact fort sur la vie privée des personnes.

S'agissant d'un projet porté par un Ministère, l'application est également une cible privilégiée
d'attaques (défiguration, vol de données, déni de service).

| Élément | Technologie |
|--------|-------------|
| Frontend | React + TypeScript (servi par nginx) |
| Backend | Node.js + Express (API REST) |
| Base de données | PostgreSQL |
| Authentification | JWT + cookies `httpOnly`, mots de passe hachés (bcrypt) |

---

## 2. Analyse des vulnérabilités et des risques

### 2.1 Méthode d'évaluation

Chaque risque est évalué selon deux axes notés de 1 à 3 :

- **Probabilité (P)** : 1 = rare, 2 = possible, 3 = fréquent
- **Impact (I)** : 1 = mineur, 2 = majeur, 3 = critique

La **criticité = P × I** (de 1 à 9) définit la priorité de traitement :

| Criticité | Niveau | Priorité |
|-----------|--------|----------|
| 1–2 | 🟢 Faible | À surveiller |
| 3–4 | 🟡 Moyen | À traiter |
| 6–9 | 🔴 Élevé | À traiter en priorité |

### 2.2 Matrice des risques

| # | Vulnérabilité / Risque | Réf. OWASP | P | I | Criticité | Niveau |
|---|------------------------|-----------|---|---|-----------|--------|
| R1 | Vol d'identifiants par **force brute** sur la connexion | A07 | 3 | 3 | **9** | 🔴 |
| R2 | **Fuite de données de santé** (accès non autorisé à la base) | A01 | 2 | 3 | **6** | 🔴 |
| R3 | **Injection SQL** | A03 | 2 | 3 | **6** | 🔴 |
| R4 | **XSS** (injection de scripts côté client) | A03 | 2 | 3 | **6** | 🔴 |
| R5 | Interception réseau (**absence de HTTPS / MITM**) | A02 | 2 | 3 | **6** | 🔴 |
| R6 | **Vol / falsification de jeton** JWT | A07 | 2 | 3 | **6** | 🔴 |
| R7 | **Déni de service** (DoS / flood de requêtes) | A05 | 2 | 2 | **4** | 🟡 |
| R8 | **Dépendances** tierces vulnérables | A06 | 2 | 2 | **4** | 🟡 |
| R9 | **CSRF** (requêtes forgées inter-sites) | A01 | 2 | 2 | **4** | 🟡 |
| R10 | Fuite d'informations techniques (**messages d'erreur, en-têtes**) | A05 | 3 | 1 | **3** | 🟡 |
| R11 | Élévation de privilèges (accès à l'espace **administrateur**) | A01 | 1 | 3 | **3** | 🟡 |

---

## 3. Actions préventives et correctives

Pour chaque risque : les mesures **préventives** (empêcher) et **correctives** (réagir).
La colonne « État » indique ce qui est **déjà implémenté** dans le prototype.

| # | Mesures préventives | Mesures correctives | État |
|---|--------------------|--------------------|------|
| R1 | Limitation du débit (`express-rate-limit`) : **10 tentatives / 15 min** sur `/auth/signin` et `/auth/signup`. Mots de passe robustes exigés (regex). | Blocage temporaire de l'IP, alerte, obligation de réinitialisation du mot de passe. | ✅ Implémenté |
| R2 | Accès base restreint (utilisateur dédié, réseau privé), mots de passe **hachés bcrypt (coût 12)**, principe du moindre privilège. | Révocation des accès, restauration depuis sauvegarde, notification CNIL (voir §5). | ✅ Partiel |
| R3 | **Requêtes paramétrées** (`$1, $2…`) sur 100 % des accès base + couche de `Sanitize`/validation des entrées. | Correctif immédiat, revue de code, test de non-régression. | ✅ Implémenté |
| R4 | En-têtes **helmet** (CSP, `X-Content-Type-Options`), validation/échappement des entrées, React échappe le HTML par défaut. | Purge du contenu injecté, correctif, invalidation des sessions. | ✅ Implémenté |
| R5 | **HTTPS/TLS obligatoire** (chiffrement navigateur↔serveur), en-tête **HSTS** (helmet), redirection HTTP→HTTPS au déploiement. | Rotation des certificats, forçage HTTPS. | ⚙️ Au déploiement |
| R6 | JWT **signé** (secret fort en variable d'environnement), **expiration courte (1 h)**, cookie `httpOnly` (inaccessible au JS). | Rotation du secret (invalide tous les jetons), déconnexion forcée. | ✅ Implémenté |
| R7 | Limiteur **global : 300 req / 15 min / IP**, pare-feu / reverse-proxy nginx. | Bannissement d'IP, mise à l'échelle, activation d'une protection anti-DDoS. | ✅ Partiel |
| R8 | **`npm audit` automatisé** dans la CI (à chaque commit + veille hebdomadaire), **Dependabot** (PR de mise à jour automatiques), **Trivy** (scan des images Docker), versions figées (`package-lock.json`). | Fusion de la PR Dependabot ou correctif manuel (`npm audit fix`), remplacement de la dépendance si aucun correctif n'existe. | ✅ Implémenté |
| R9 | Cookies **`SameSite`**, en-tête d'origine vérifié via **CORS** (liste blanche d'origines). | Invalidation des sessions, correctif. | ✅ Partiel |
| R10 | **Masquage `X-Powered-By`** (helmet), messages d'erreur génériques côté client. | Correctif de configuration. | ✅ Implémenté |
| R11 | Contrôle des rôles côté serveur (middleware d'authentification + vérification du rôle), routes admin protégées. | Retrait des droits, audit des accès. | ✅ Partiel |

**Résumé des mesures techniques déjà en place dans le code :**

- 🔐 Mots de passe hachés avec **bcrypt** (coût 12) — jamais stockés en clair
- 🎫 Authentification **JWT** signée, expiration 1 h, cookie `httpOnly`
- 🛡️ **helmet** — en-têtes HTTP de sécurité (anti-XSS, anti-clickjacking, anti-MIME-sniffing)
- 🚦 **express-rate-limit** — anti-force-brute et anti-DoS
- 💉 **Requêtes SQL paramétrées** — pas d'injection possible
- ✅ **Validation et assainissement** systématiques des entrées utilisateur
- 🌐 **CORS** restreint à une liste blanche d'origines
- 🧪 **Tests de sécurité automatisés** (bloc T-SEC) exécutés à chaque commit par la CI

---

## 3 bis. Outillage de sécurisation automatique

La sécurité ne repose pas uniquement sur des mesures écrites : elle est **outillée** et
**rejouée automatiquement** à chaque évolution du code. Trois outils complémentaires
couvrent trois périmètres différents.

| Outil | Périmètre couvert | Déclenchement | Effet en cas de problème |
|-------|-------------------|---------------|--------------------------|
| **`npm audit`** (GitHub Actions) | Vulnérabilités connues des **paquets npm** (backend, frontend) | Chaque push / PR + **tous les lundis 6 h** | Backend : la CI **échoue** dès une faille *haute* ou *critique* en production. Frontend : rapport informatif (voir note ci-dessous) |
| **Dependabot** | **Mises à jour** des paquets npm, des images de base Docker et des actions GitHub | Hebdomadaire (mensuel pour le mobile) | Ouvre automatiquement une **Pull Request** de mise à jour, relue et validée par la CI avant fusion |
| **Trivy** | Vulnérabilités des **images Docker** : distribution de base (Debian, Alpine), bibliothèques système (OpenSSL, zlib…), paquets applicatifs | Chaque push / PR + hebdomadaire | Rapport complet *haute + critique* ; la CI **échoue** sur une faille **critique disposant d'un correctif** |

**Fichiers de configuration :** `.github/workflows/security.yml` et `.github/dependabot.yml`.

**Choix de conception — pourquoi tout n'est pas bloquant.** Un pipeline qui échoue en
permanence finit par être ignoré : le seuil de blocage a donc été placé là où une action
corrective est réellement possible.

- **Backend — bloquant sur les dépendances de production.** Seuls les paquets embarqués
  dans l'image et exposés en ligne peuvent être attaqués ; une faille dans ESLint ou Jest
  ne s'exécute jamais en production. L'audit complet reste produit, mais en informatif.
- **Frontend — informatif.** Create React App déclare `react-scripts` dans les
  `dependencies` alors qu'il ne sert qu'à **compiler** l'application ; il entraîne webpack,
  Babel et Jest, à l'origine de la quasi-totalité des alertes. Ces paquets ne sont pas
  livrés au navigateur : le build de production ne contient que du HTML/CSS/JS statique
  servi par nginx. Le rapport est examiné à chaque revue de dépendances.
- **Trivy — bloquant sur le critique corrigeable uniquement** (`ignore-unfixed`) : bloquer
  sur une faille sans correctif publié en amont laisserait l'équipe sans action possible.

**Complémentarité des trois outils.** `npm audit` ne voit que les paquets npm ; Trivy voit
l'image entière, y compris le système d'exploitation de base — une faille OpenSSL dans
`node:20-slim` n'apparaît que là. Dependabot, lui, ne détecte pas : il **corrige**, en
proposant la montée de version. Détection (audit + Trivy) et remédiation (Dependabot)
forment ainsi une boucle complète.

**Limite assumée.** Ces outils couvrent les vulnérabilités **connues et publiées** des
dépendances. Ils ne détectent pas une faille de logique métier propre à l'application
(mauvais contrôle de rôle, référence directe à un objet…) : celle-ci relève de la revue
de code en Pull Request et des tests de sécurité automatisés (bloc T-SEC).

---

## 4. Gestion de crise et escalade d'information

### 4.1 Classification de la sévérité d'un incident

| Sévérité | Définition | Prise en compte | Résolution cible |
|----------|-----------|-----------------|------------------|
| 🔴 **Bloquant** | Service indisponible ou fuite de données avérée, sans contournement | 1 h ouvrée | 3 h ouvrées |
| 🟠 **Majeur** | Service fortement dégradé / contournement partiel | 7 h ouvrées | 16 h ouvrées |
| 🟡 **Mineur** | Altération légère, service opérationnel | 1 j ouvré | 40 h ouvrées |

### 4.2 Procédure d'escalade (en cas d'attaque ou de faille avérée)

1. **Détection** — supervision, alerte automatique ou signalement via l'outil de ticketing.
2. **Qualification** — le prestataire évalue la sévérité (grille ci-dessus) et ouvre un ticket d'incident.
3. **Confinement** — mesures immédiates : bannissement d'IP, coupure du service compromis, rotation du secret JWT.
4. **Escalade** — si **bloquant** : information immédiate du **référent Ministère** + du **DPO** (délégué à la protection des données).
5. **Remédiation** — correctif, test de non-régression, remise en service.
6. **Notification RGPD** — si données personnelles compromises : notification **CNIL sous 72 h** et information des personnes concernées (voir §5.5).
7. **Retour d'expérience** — analyse post-incident, mise à jour du présent plan.

### 4.3 Niveaux de responsabilité

| Rôle | Responsabilité en cas de crise |
|------|-------------------------------|
| Développeur / prestataire | Détection, confinement technique, correctif |
| Référent Ministère | Décision de communication, arbitrages |
| DPO | Pilotage de la notification CNIL et de l'information des usagers |

---

## 5. Données personnelles et conformité RGPD

### 5.1 Inventaire des données collectées

| Donnée | Catégorie | Finalité |
|--------|-----------|----------|
| Nom, prénom, civilité | Personnelle | Identification du compte |
| Email, pseudo | Personnelle | Connexion, communication |
| Date de naissance, ville, code postal | Personnelle | Profil utilisateur |
| **Émotions, niveau de stress, journal** | **Sensible (santé — art. 9)** | Suivi du bien-être |

### 5.2 Bases légales

- **Consentement** explicite de l'utilisateur à la création du compte (nécessaire pour les données de santé, art. 9-2-a).
- Finalité déterminée : accompagnement du bien-être mental.

### 5.3 Minimisation et conservation

- Collecte limitée au strict nécessaire (principe de **minimisation**).
- **Durée de conservation** définie (ex. suppression des données après X mois d'inactivité ou sur demande).
- **Aucun transfert hors Union Européenne** (hébergement UE).

### 5.4 Droits des personnes

L'application permet d'exercer les droits RGPD : **accès, rectification** (modification du profil),
**suppression / désactivation** du compte (droit à l'effacement). Le droit à la **portabilité** peut
être assuré par un export des données.

### 5.5 Sécurité et violation de données

- Chiffrement en transit (**HTTPS**) et hachage des mots de passe (**bcrypt**).
- En cas de violation de données à caractère personnel : **notification à la CNIL dans les 72 h**
  et information des personnes concernées si le risque est élevé (art. 33 et 34 du RGPD).

---

## 6. Bonnes pratiques de développement mises en œuvre

- **Architecture MVC** (Modèles / Contrôleurs / Routes) — code structuré et maintenable.
- **Gestion des secrets** hors du dépôt : variables d'environnement (`.env` **git-ignoré**),
  secrets de production fournis par l'hébergeur / GitHub Secrets.
- **Versioning Git** + stratégie de branches + **Pull Requests** relues avant fusion.
- **Intégration continue** (GitHub Actions) : lint (ESLint) + tests automatisés à chaque commit,
  empêchant l'intégration de code cassé ou non conforme.
- **Tests automatisés** dont un socle dédié à la sécurité (authentification, injection, en-têtes).
- **Veille automatisée sur les dépendances** : `npm audit` en CI, **Dependabot** et **Trivy**
  (détail en §3 bis).

---

*Document réalisé dans le cadre de l'évaluation du Bloc 3 — CDA CESIZen.*
