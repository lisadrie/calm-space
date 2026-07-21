# ============================================================================
#  Backend CalmSpace — API Express + PostgreSQL + JWT
#  Image de production : n'installe que les dépendances nécessaires au runtime.
# ============================================================================
FROM node:20-slim

# Correctifs de sécurité du système de base.
# L'image officielle node:20-slim n'est reconstruite que périodiquement : elle
# accuse donc un retard sur les mises à jour de sécurité publiées par Debian
# (ex. CVE-2026-42010 sur libgnutls30, corrigée dans les dépôts mais absente de
# l'image). On applique ces correctifs au moment du build.
# Détecté automatiquement par le scan Trivy (.github/workflows/security.yml).
RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Dossier de travail dans le conteneur
WORKDIR /app

# 1) On copie d'abord les manifestes pour profiter du cache de couches Docker :
#    tant que package*.json ne change pas, npm ci n'est pas relancé.
COPY package*.json ./

# 2) Installation reproductible, sans les dépendances de développement
#    (jest, eslint, nodemon, supertest ne servent pas en production).
#
#    npm est ensuite SUPPRIMÉ de l'image : il ne sert qu'à cette étape
#    d'installation, jamais à l'exécution (le conteneur démarre avec
#    `node server.js`). Deux bénéfices :
#      - la version de tar embarquée dans npm 10 est vulnérable
#        (CVE-2026-59873) et ne peut pas être corrigée sous Node 20, la
#        correction exigeant npm 12 donc Node 22+ ;
#      - moins d'outils dans l'image = moins de surface d'attaque.
RUN npm ci --omit=dev \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/bin/npm /usr/local/bin/npx \
              /root/.npm

# 3) Copie du code source (node_modules et .env sont exclus via .dockerignore)
COPY . .

# L'API écoute sur le port fourni par l'environnement (5001 par défaut)
EXPOSE 5001

# Démarrage du serveur
CMD ["node", "server.js"]
