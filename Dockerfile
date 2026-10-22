# ==============================================================================
# Multi-stage Dockerfile pour LevelUpCode Frontend (Angular 19+ & Tailwind v4)
# Optimisé pour Google Cloud Run (image ultra-légère Nginx Alpine, cache, port 8080)
# ==============================================================================

# ------------------------------------------------------------------------------
# Étape 1 : Builder (Installation des dépendances et compilation Angular)
# ------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copie des manifests de dépendances et configuration npm
COPY package.json package-lock.json .npmrc ./

# Installation propre des dépendances avec support legacy-peer-deps
RUN npm ci --legacy-peer-deps

# Copie de l'intégralité du code source
COPY . ./

# Compilation de l'application Angular pour la production
RUN npm run build

# ------------------------------------------------------------------------------
# Étape 2 : Runner Nginx (Serveur web léger et performant)
# ------------------------------------------------------------------------------
FROM nginx:alpine-slim AS runner

# Remplacement de la configuration Nginx par défaut
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des artefacts statiques compilés depuis l'étape de build
COPY --from=builder /app/dist/levelupcode-front/browser /usr/share/nginx/html

# Port d'écoute standard pour Cloud Run
EXPOSE 8080

# Démarrage de Nginx en mode premier plan
CMD ["nginx", "-g", "daemon off;"]
