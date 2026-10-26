import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getAccessToken()) {
    return true;
  }

  // Redirection vers /login avec conservation de l'URL demandée
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si aucun token en localStorage, rediriger vers login
  if (!authService.getAccessToken()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: '/admin' },
    });
  }

  // Si le profil utilisateur est déjà initialisé (via localStorage ou mémoire)
  if (authService.currentUser()) {
    if (authService.isAdmin()) {
      return true;
    }
    return router.createUrlTree(['/']);
  }

  // Si token présent mais currentUser encore en cours de chargement initial
  return authService.loadCurrentUser().pipe(
    map((user) => {
      if (user?.role === 'ADMIN') {
        return true;
      }
      return router.createUrlTree(['/']);
    }),
    catchError(() =>
      of(
        router.createUrlTree(['/login'], {
          queryParams: { returnUrl: '/admin' },
        })
      )
    )
  );
};
