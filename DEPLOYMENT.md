# 🚀 Guide de Déploiement Frontend - LevelUpCode (Google Cloud Run)

Ce guide explique comment fonctionne le déploiement continu du frontend **LevelUpCode** sur **Google Cloud Run** via **GitHub Actions**.

---

## 🏗️ Architecture de Déploiement

- **Serveur Web** : Nginx Alpine ultra-léger (image Docker multi-stage).
- **Plateforme** : Google Cloud Run (Serverless, conteneurisé, mise à l'échelle automatique de 0 à 5 instances).
- **Région** : `europe-west1`
- **Projet GCP** : `levelupcode-512207`
- **Service Cloud Run** : `levelupcode-front`
- **Port d'écoute** : `8080` (requis par Cloud Run).
- **Routage SPA** : Gestion par `nginx.conf` (`try_files $uri $uri/ /index.html`) avec compression gzip et en-têtes de sécurité.

---

## 🔐 1. Prérequis GitHub Actions

Le workflow automatisé se trouve dans [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml).

Pour qu'il puisse déployer sur votre compte Google Cloud Platform, vous devez vous assurer que le secret suivant est présent dans votre dépôt GitHub :

1. Rendez-vous sur votre dépôt : `https://github.com/guienjoris/levelupcode-front/settings/secrets/actions`
2. Cliquez sur **New repository secret**.
3. Nom : **`GCP_SA_KEY`**
4. Valeur : Le contenu JSON de la clé du compte de service Google Cloud (le même que celui utilisé pour le backend dans `levelupcode-api`).

---

## ⚡ 2. Déploiement Automatique

Chaque fois que vous poussez du code sur la branche `main` :

```bash
git add .
git commit -m "feat: initial frontend with CI/CD"
git push origin main
```

GitHub Actions déclenche automatiquement :
1. **🧪 Tests & Build Verification** : Vérification de la compilation TypeScript et du bundle Angular 19+ (`npm ci --legacy-peer-deps` puis `npm run build`).
2. **🚀 Deploy to Google Cloud Run** : Authentification GCP via `GCP_SA_KEY`, build de l'image Docker Nginx et déploiement du service `levelupcode-front`.
3. **🌐 URL finale** : L'URL publique Cloud Run générée s'affiche dans les logs de GitHub Actions (ex: `https://levelupcode-front-993969640029.europe-west1.run.app`).

---

## 🔗 3. Mise à Jour de l'URL dans le Backend pour Google OAuth

Une fois le frontend déployé et son URL Cloud Run obtenue :

1. Mettez à jour les variables d'environnement dans le projet **Backend** (Cloud Run ou `.env`) :
   ```env
   FRONTEND_URL="https://<VOTRE-URL-FRONTEND-CLOUD-RUN>"
   ```
2. Dans la **Console Google Cloud** (Credentials OAuth 2.0) :
   - Ajoutez l'URL du frontend dans les **Origines JavaScript autorisées** :
     `https://<VOTRE-URL-FRONTEND-CLOUD-RUN>`
   - Ajoutez l'URL de callback de l'API dans les **URI de redirection autorisés** :
     `https://levelupcode-api-993969640029.europe-west1.run.app/auth/google/callback`
