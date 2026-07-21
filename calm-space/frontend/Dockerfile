# ============================================================================
#  Frontend CalmSpace — React + TypeScript
#  Build en 2 étapes (multi-stage) :
#    1) on compile l'application avec Node
#    2) on sert les fichiers statiques avec nginx (image finale légère)
# ============================================================================

# --- Étape 1 : compilation du build de production ---------------------------
# Node 24 = version LTS active (voir la note du Dockerfile backend).
FROM node:26-slim AS build
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
# nginx 1.31 = dernière version stable. C'est cette image qui constitue
# l'image finale du frontend, donc celle réellement scannée par Trivy.
FROM nginx:1.31-alpine
# Configuration nginx adaptée à une Single Page Application (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# On récupère uniquement le build compilé depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
