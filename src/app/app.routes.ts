import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'catalog/:slug',
    loadComponent: () =>
      import('./features/catalog/category-detail/category-detail.component').then(
        (m) => m.CategoryDetailComponent
      ),
  },
  {
    path: 'lessons/:idOrSlug',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/lessons/lesson-detail.component').then((m) => m.LessonDetailComponent),
  },
  {
    path: 'quizzes/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/quizzes/quiz-run.component').then((m) => m.QuizRunComponent),
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./features/leaderboard/leaderboard.component').then((m) => m.LeaderboardComponent),
  },
  {
    path: 'donations',
    loadComponent: () =>
      import('./features/donations/donations.component').then((m) => m.DonationsComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/gamification/profile-stats.component').then(
        (m) => m.ProfileStatsComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
