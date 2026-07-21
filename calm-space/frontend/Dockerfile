# ============================================================================
#  Frontend CalmSpace — React + TypeScript
#  Build en 2 étapes (multi-stage) :
#    1) on compile l'application avec Node
#    2) on sert les fichiers statiques avec nginx (image finale légère)
# ============================================================================

# --- Étape 1 : compilation du build de production ---------------------------
FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# L'URL de l'API est injectée au moment du build (variable REACT_APP_*).
# Elle pointe vers le backend tel que vu depuis le NAVIGATEUR de l'utilisateur.
ARG REACT_APP_API_URL=http://localhost:5001
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# --- Étape 2 : serveur web statique -----------------------------------------
FROM nginx:1.27-alpine

# Correctifs de sécurité du système de base (même raison que côté backend) :
# l'image nginx:1.27-alpine embarquait une version d'OpenSSL vulnérable
# (CVE-2026-31789), déjà corrigée dans les dépôts Alpine.
# Détecté automatiquement par le scan Trivy (.github/workflows/security.yml).
RUN apk upgrade --no-cache

# Configuration nginx adaptée à une Single Page Application (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# On récupère uniquement le build compilé depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
