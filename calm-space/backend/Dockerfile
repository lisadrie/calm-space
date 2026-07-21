# ============================================================================
#  Backend CalmSpace — API Express + PostgreSQL + JWT
#  Image de production : n'installe que les dépendances nécessaires au runtime.
# ============================================================================
# Node 24 = version LTS active. Les versions plus anciennes (Node 20, en fin de
# vie depuis avril 2026) ne reçoivent plus de correctifs de sécurité : le scan
# Trivy de la CI remontait des vulnérabilités CRITIQUES corrigeables.
FROM node:24-slim

# npm est mis à jour avant toute installation : la version livrée avec l'image
# (npm 11) embarque une copie vulnérable de `tar` (CVE-2026-59873, déni de
# service par archive gzip piégée), que le scan Trivy remonte en CRITIQUE.
# npm 12 embarque tar 7.5.19, corrigé.
RUN npm install -g npm@latest && npm cache clean --force

# Dossier de travail dans le conteneur
WORKDIR /app

# 1) On copie d'abord les manifestes pour profiter du cache de couches Docker :
#    tant que package*.json ne change pas, npm ci n'est pas relancé.
COPY package*.json ./

# 2) Installation reproductible, sans les dépendances de développement
#    (jest, eslint, nodemon, supertest ne servent pas en production).
RUN npm ci --omit=dev

# 3) Copie du code source (node_modules et .env sont exclus via .dockerignore)
COPY . .

# L'API écoute sur le port fourni par l'environnement (5001 par défaut)
EXPOSE 5001

# Démarrage du serveur
CMD ["node", "server.js"]
