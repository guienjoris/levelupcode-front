import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, filter, take, throwError, BehaviorSubject } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let authReq = req;
  // Ne pas ajouter le header Authorization sur l'appel de refresh ou si déjà présent
  if (token && !req.url.includes('/auth/refresh')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Si l'erreur 401 provient déjà de la route login ou refresh, on ne tente pas de refresh
        if (req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh')) {
          return throwError(() => error);
        }

        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((tokenResponse) => {
        isRefreshing = false;
        refreshTokenSubject.next(tokenResponse.accessToken);
        return next(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokenResponse.accessToken}`,
            },
          })
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshTokenSubject.next(''); // Débloquer les requêtes en attente
        authService.clearSession();
        return throwError(() => err);
      })
    );
  } else {
    // Si un rafraîchissement est déjà en cours, on attend le nouveau token
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Session expirée'));
        }
        return next(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
      })
    );
  }
}
