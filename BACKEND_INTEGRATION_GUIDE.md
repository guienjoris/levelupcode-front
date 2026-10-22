# ⚡ Guide d'Intégration Backend pour le Frontend - LevelUpCode

Bienvenue sur le projet **LevelUpCode** ! Ce document est conçu spécialement pour l'agent IA ou le développeur en charge de concevoir l'application **Frontend**. Il résume l'architecture du backend, expose tous les contrats d'API, détaille le modèle de sécurité et fournit les snippets d'intégration prêts à l'emploi.

---

## 🌐 1. Environnements & URLs de l'API

| Environnement | URL de Base | Documentation Swagger Interactive |
| :--- | :--- | :--- |
| **Production (Cloud Run)** | `https://levelupcode-api-993969640029.europe-west1.run.app` | [Swagger Prod](https://levelupcode-api-993969640029.europe-west1.run.app/api/docs) |
| **Développement Local** | `http://localhost:3000` (ou `http://localhost:8080`) | `http://localhost:3000/api/docs` |

> [!TIP]
> Swagger est interactif : vous pouvez tester chaque route, visualiser les schémas JSON et tester vos tokens JWT directement via le bouton **Authorize** en haut à droite (`Bearer <token>`).

---

## 🎯 2. Règles Métier & Modèle d'Accès Clés

1. **100% Gratuit sur Inscription Obligatoire** :
   - L'exploration du catalogue (`GET /categories`) et le mur des donateurs (`GET /donations/supporters`) sont **publics**.
   - **L'accès au contenu des leçons et aux quiz est STRICTEMENT INTERDIT aux non-inscrits** : tout appel sans token JWT valide renvoie une erreur HTTP `401 Unauthorized`.
   - *Comportement UI recommandé* : Le visiteur peut voir les cartes des 9 catégories et les titres des leçons. Dès qu'il clique sur une leçon ou un quiz, ouvrir une modale d'inscription/connexion attrayante ou rediriger vers `/login`.

2. **Anti-Triche sur les Quiz** :
   - Quand le front appelle `GET /quizzes/:id`, le backend masque volontairement la propriété `isCorrect` de toutes les réponses.
   - Les réponses exactes et les explications pédagogiques détaillées ne sont renvoyées qu'après soumission via `POST /quizzes/:id/submit`.

3. **Gamification & Streaks Automatiques** :
   - Chaque complétion de leçon (`POST /lessons/:id/complete`) ou soumission de quiz réussie met à jour automatiquement la série quotidienne de jours actifs (`streak`) et incrémente l'XP de l'apprenant selon la difficulté (`NOVICE`: +10 XP, `INTERMEDIAIRE`: +25 XP, `SENIOR`: +50 XP).

4. **Statut Supporter (Buy Me a Coffee)** :
   - Si un utilisateur a fait un don sur Buy Me a Coffee, `user.isSupporter` est à `true`.
   - *Comportement UI* : Afficher un badge cosmétique doré/café (ex: `☕ Supporter`) à côté de son pseudo sur son profil, sur le dashboard et dans le classement.

5. **Signalement d'Erreurs Immédiat** :
   - Tout apprenant peut signaler une coquille ou un bug via `POST /reports` (limité à 5 requêtes par 5 minutes par IP). L'administrateur reçoit instantanément une notification email.

---

## 🔐 3. Authentification & Gestion des Tokens (JWT)

Le backend utilise un système standard de double jetons :
- **`accessToken`** : Jeton Bearer JWT court (15 minutes). Doit être transmis dans le header `Authorization: Bearer <accessToken>`.
- **`refreshToken`** : Jeton long (7 jours) utilisé pour renouveler silencieusement l'Access Token sans déconnecter l'utilisateur.

### Endpoints Auth

| Méthode | Route | Description | Payload Body / Réponse |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Inscription par email | `{ email, password, name? }` → `{ accessToken, refreshToken, user }` |
| `POST` | `/auth/login` | Connexion classique | `{ email, password }` → `{ accessToken, refreshToken, user }` |
| `POST` | `/auth/refresh` | Rafraîchissement token | `{ refreshToken }` → `{ accessToken }` |
| `GET` | `/auth/me` | Profil utilisateur connecté | Header `Authorization: Bearer <token>` → `UserProfile` |
| `GET` | `/auth/google` | OAuth2 Google | Redirige vers Google |
| `GET` | `/auth/github` | OAuth2 GitHub | Redirige vers GitHub |

### Snippet Client HTTP Recommandé (Axios avec Intercepteur de Refresh)

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://levelupcode-api-993969640029.europe-west1.run.app',
  headers: { 'Content-Type': 'application/json' },
});

// Injection automatique de l'Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Renouvellement automatique en cas de 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 📚 4. Matrice Complète des Endpoints Frontend

### 4.1 Catégories (`CategoriesModule`)

- **`GET /categories`** *(Public)* :
  - Retourne les catégories officielles avec leurs tags associés et métadonnées.
  ```json
  [
    {
      "id": "uuid-cat",
      "slug": "nestjs",
      "name": "NestJS",
      "description": "Architecture serveur robuste, modularité, injection de dépendances...",
      "icon": "server",
      "orderIndex": 4,
      "tags": [{ "id": "t1", "name": "Back-End", "slug": "back-end" }]
    }
  ]
  ```

- **`GET /categories/:slug/lessons`** *(Membre connecté requis - 401 si non connecté)* :
  - Retourne la liste des leçons pour la catégorie donnée avec le statut de progression de l'utilisateur (`isCompleted`, `difficulty`, `orderIndex`).

---

### 4.2 Leçons (`LessonsModule`)

- **`GET /lessons/:idOrSlug`** *(Membre connecté requis - 401 si non connecté)* :
  - Retourne la leçon complète avec son contenu pédagogique en **Markdown enrichi** (`contentMarkdown`).
  ```json
  {
    "id": "uuid-lecon",
    "slug": "introduction-aux-decorateurs-nestjs",
    "title": "Introduction aux Décorateurs NestJS",
    "contentMarkdown": "# Les Décorateurs\n\nEn TypeScript, un décorateur est une fonction...",
    "difficulty": "NOVICE",
    "category": { "id": "uuid", "name": "NestJS", "slug": "nestjs" },
    "isCompleted": false,
    "quiz": { "id": "uuid-quiz", "title": "Quiz Décorateurs" }
  }
  ```

- **`POST /lessons/:id/complete`** *(Membre connecté requis)* :
  - Valide la lecture de la leçon. Met à jour atomiquement la progression, la série (`streak`) et attribue l'XP.
  - Réponse : `{ success: true, message: "Leçon validée !", xpEarned: 10, newStreak: 3 }`.

---

### 4.3 Quiz & Évaluations (`QuizzesModule`)

- **`GET /quizzes/:id`** *(Membre connecté requis - 401 si non connecté)* :
  - Renvoie le quiz et ses questions. Les champs `isCorrect` sont **masqués** pour éviter la triche.
  ```json
  {
    "id": "uuid-quiz",
    "title": "Quiz : Décorateurs NestJS",
    "difficulty": "NOVICE",
    "questions": [
      {
        "id": "q1",
        "title": "Quel décorateur marque une classe comme service injectable ?",
        "codeSnippet": "@Injectable()\nexport class UsersService {}",
        "orderIndex": 0,
        "answers": [
          { "id": "a1", "text": "@Service()", "orderIndex": 0 },
          { "id": "a2", "text": "@Injectable()", "orderIndex": 1 }
        ]
      }
    ]
  }
  ```

- **`POST /quizzes/:id/submit`** *(Membre connecté requis)* :
  - Soumet les réponses choisies.
  - Payload :
    ```json
    {
      "answers": [
        { "questionId": "q1", "answerId": "a2" }
      ]
    }
    ```
  - Réponse :
    ```json
    {
      "score": 100,
      "passed": true,
      "xpEarned": 10,
      "currentStreak": 4,
      "results": [
        {
          "questionId": "q1",
          "userAnswerId": "a2",
          "correctAnswerId": "a2",
          "isCorrect": true,
          "explanation": "@Injectable() attache les métadonnées requises par le conteneur IoC de NestJS."
        }
      ]
    }
    ```

---

### 4.4 Gamification & Profil (`GamificationModule`)

- **`GET /gamification/me/stats`** *(Membre connecté requis)* :
  - Dashboard personnel de l'apprenant :
    ```json
    {
      "currentStreak": 5,
      "longestStreak": 12,
      "totalXp": 380,
      "isSupporter": true,
      "supporterSince": "2026-10-15T10:00:00.000Z",
      "registrationDays": 14,
      "completedLessonsCount": 8,
      "completedQuizzesCount": 6,
      "scoresByCategory": [
        { "categoryId": "cat-1", "categoryName": "NestJS", "categorySlug": "nestjs", "xp": 150 }
      ],
      "scoresByTag": [
        { "tagId": "tag-1", "tagName": "Back-End", "tagSlug": "back-end", "xp": 220 }
      ]
    }
    ```

- **`GET /gamification/leaderboard?page=1&limit=20`** *(Public)* :
  - Classement général des apprenants par XP :
    ```json
    {
      "data": [
        {
          "rank": 1,
          "userId": "u-1",
          "name": "Sarah Connor",
          "avatarUrl": "https://...",
          "totalXp": 1450,
          "currentStreak": 21,
          "isSupporter": true
        }
      ],
      "meta": { "total": 120, "page": 1, "totalPages": 6 }
    }
    ```

---

### 4.5 Signalement d'Erreurs Pédagogiques (`ReportsModule`)

- **`POST /reports`** *(Public ou Membre connecté, Rate-limited à 5 req / 5 min)* :
  - Formulaire de signalement de coquille, bug ou mauvaise explication sur une leçon ou un quiz.
  - Payload :
    ```json
    {
      "type": "LESSON", // ou "QUIZ"
      "targetId": "uuid-de-la-lecon-ou-du-quiz",
      "comment": "La commande npm install est incomplète dans le snippet de code."
    }
    ```
  - Réponse : `{ "success": true, "message": "Signalement enregistré avec succès..." }`.

---

### 4.6 Soutien Buy Me a Coffee (`DonationsModule`)

- **`GET /donations/supporters?limit=20`** *(Public)* :
  - Mur des soutiens récents (prénom, montant, message d'encouragement, date). Emails anonymisés.
- **`GET /donations/me`** *(Membre connecté requis)* :
  - Historique de ses propres dons et état de son badge Supporter.

---

### 4.7 Préférences d'Emails & Notifications (`NotificationsModule`)

- **`PATCH /notifications/preferences`** *(Membre connecté requis)* :
  - Active ou désactive le rappel de streak quotidien par email à 19h00 :
    `{ "emailDailyReminder": false }`
- **`GET /notifications/unsubscribe?token=...`** *(Public)* :
  - Permet de se désinscrire en 1 clic directement depuis l'email reçu.

---

### 4.8 Espace d'Administration (`AdminModule` & `RolesGuard`)

> [!WARNING]
> Ces routes nécessitent `user.role === 'ADMIN'`. Toute tentative par un membre ordinaire renvoie un code HTTP `403 Forbidden`.

- **Catégories Pédagogiques (`Admin - Categories`)** :
  - `GET /admin/categories` : Liste complète de toutes les catégories avec leurs tags rattachés et compteurs de leçons/quiz (`orderIndex` ascendant).
  - `GET /admin/categories/:id` : Détail d'une catégorie avec ses leçons, ses quiz et ses tags.
  - `POST /admin/categories` : Créer une nouvelle catégorie pédagogique.
    - *Payload* : `{ "slug": "docker", "name": "Docker & Conteneurs", "description": "Maîtrisez la conteneurisation...", "icon": "logos:docker-icon", "orderIndex": 10, "tagIds": ["uuid-tag-1"] }`
  - `PATCH /admin/categories/:id` : Modifier le nom, slug, description, icône, ordre ou tags rattachés.
  - `DELETE /admin/categories/:id` : Supprimer définitivement une catégorie.
  - `POST /admin/categories/:id/tags/:tagId` : Associer un tag existant à une catégorie.
  - `DELETE /admin/categories/:id/tags/:tagId` : Dissocier un tag d'une catégorie.

- **Tags Techniques (`Admin - Tags`)** :
  - `GET /admin/tags` : Liste de tous les tags techniques (filtrable optionnellement par catégorie via `?categoryId=uuid`).
  - `GET /admin/tags/:id` : Détail d'un tag avec ses catégories rattachées.
  - `POST /admin/tags` : Créer un nouveau tag technique.
    - *Payload* : `{ "slug": "devops", "name": "DevOps", "categoryIds": ["uuid-cat-1"] }`
  - `PATCH /admin/tags/:id` : Mettre à jour le nom, le slug ou les catégories associées.
  - `DELETE /admin/tags/:id` : Supprimer définitivement un tag.

- **Leçons (`Admin - Lessons`)** :
  - `GET /admin/lessons?categoryId=...&isPublished=true` : Liste administrative de toutes les leçons avec statistiques de progression.
  - `GET /admin/lessons/:id` : Détail administratif d'une leçon pour édition.
  - `POST /admin/lessons` : Créer une leçon (`slug`, `title`, `contentMarkdown`, `difficulty`, `categoryId`, `orderIndex`, `isPublished`).
  - `PATCH /admin/lessons/:id` : Mettre à jour une leçon.
  - `DELETE /admin/lessons/:id` : Supprimer une leçon.

- **Quiz & Questions (`Admin - Quizzes`)** :
  - `GET /admin/quizzes?categoryId=...&isPublished=true` : Liste administrative de tous les quiz.
  - `GET /admin/quizzes/:id` : Détail complet du quiz avec questions, options et indicateurs `isCorrect` visibles pour l'édition.
  - `POST /admin/quizzes` : Créer un quiz atomiquement avec ses questions et réponses (`questions: [{ title, answers: [{ text, isCorrect }] }]`).
  - `PATCH /admin/quizzes/:id` : Mettre à jour les métadonnées d'un quiz.
  - `DELETE /admin/quizzes/:id` : Supprimer un quiz et ses questions en cascade.
  - `POST /admin/quizzes/:id/questions` : Ajouter une question à un quiz existant.
  - `DELETE /admin/quizzes/questions/:questionId` : Supprimer une question d'un quiz.

- **Signalements (`ReportsModule`)** :
  - `GET /admin/reports?status=PENDING&type=LESSON` : Liste paginée des anomalies signalées par les utilisateurs.
  - `PATCH /admin/reports/:id` : Marquer comme `RESOLVED` ou `DISMISSED`.
  - `DELETE /admin/reports/:id` : Supprimer un signalement traité.

- **Dons (`DonationsModule`)** :
  - `GET /admin/donations` : Visualisation de toutes les transactions Buy Me a Coffee et total financier.

---

## 🎨 5. Recommandations Design & UX pour le Frontend

1. **Ambiance Sombre & Moderne (Dark Theme d'Origine)** :
   - Fond profond : `#0f172a` (Slate 900) ou `#090d16`.
   - Cartes et conteneurs : `#1e293b` avec bordures subtiles `#334155`.
   - Accents vibrants : Dégradé Indigo vers Violet (`linear-gradient(135deg, #6366f1 0%, #a855f7 100%)`).
   - Accent Flamme / Streak : Ambre / Orange (`#f59e0b` / `#ea580c`).

2. **Rendu Markdown Performant** :
   - Utiliser un composant Markdown performant (ex: `react-markdown` avec `rehype-highlight` ou `shiki`).
   - Ajouter un bouton **"Copier le code"** au survol des blocs de code TypeScript / Bash.

3. **Modale d'Erreur Flottante** :
   - Ajouter un petit bouton discret en bas de chaque page de cours : `⚠️ Signaler une erreur`.
   - Ouvre une modale simple avec textarea pré-remplie avec le `type` et l'identifiant de la leçon/quiz en cours.

4. **Feedback de Streak & Animations** :
   - À chaque soumission de quiz réussie ou leçon validée, afficher une micro-animation de flamme (`🔥 +1 Jour de série !`) et un compteur d'XP gagné (`+10 XP`).
