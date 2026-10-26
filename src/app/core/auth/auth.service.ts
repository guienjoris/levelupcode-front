import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  RefreshResponse,
  UserProfile,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'currentUser';

  // Signals réactifs pour l'état d'authentification initialisés directement depuis le localStorage
  readonly currentUser = signal<UserProfile | null>(this.getCachedUser());
  readonly isAuthenticated = computed(() => !!this.currentUser() || !!this.getAccessToken());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  readonly isSupporter = computed(() => !!this.currentUser()?.isSupporter);
  readonly isInitialized = signal<boolean>(false);

  constructor() {
    this.initSession();
  }

  private getCachedUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }

    // Fallback: extraire les données utilisateur de base directement depuis le JWT accessToken
    const token = this.getAccessToken();
    if (token) {
      return this.parseUserFromToken(token);
    }
    return null;
  }

  private parseUserFromToken(token: string): UserProfile | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      if (!payload.sub || !payload.email) return null;
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role || 'USER',
        name: payload.name || payload.email.split('@')[0],
      };
    } catch {
      return null;
    }
  }

  setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUser.set(user);
  }

  private initSession(): void {
    const token = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (token || refreshToken) {
      this.loadCurrentUser().subscribe({
        next: () => this.isInitialized.set(true),
        error: () => {
          // On ne supprime pas la session sur une simple erreur réseau / transient
          this.isInitialized.set(true);
        },
      });
    } else {
      this.clearSession();
      this.isInitialized.set(true);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, dto).pipe(
      tap((res) => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.setCurrentUser(res.user);
      })
    );
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, dto).pipe(
      tap((res) => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.setCurrentUser(res.user);
      })
    );
  }

  loadCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => this.setCurrentUser(user)),
      catchError((err) => {
        // Déconnecter UNIQUEMENT en cas de 401 avéré sans moyen de refresh
        if (err.status === 401 && !this.getRefreshToken()) {
          this.clearSession();
        }
        return throwError(() => err);
      })
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('Aucun refresh token disponible'));
    }

    return this.http
      .post<RefreshResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          this.setTokens(res.accessToken);
        }),
        catchError((err) => {
          this.clearSession();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  // Redirection OAuth
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  loginWithGithub(): void {
    window.location.href = `${this.apiUrl}/auth/github`;
  }
}
