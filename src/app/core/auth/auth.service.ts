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

  // Signals réactifs pour l'état d'authentification
  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  readonly isSupporter = computed(() => !!this.currentUser()?.isSupporter);
  readonly isInitialized = signal<boolean>(false);

  constructor() {
    this.initSession();
  }

  private initSession(): void {
    const token = this.getAccessToken();
    if (token) {
      this.loadCurrentUser().subscribe({
        next: () => this.isInitialized.set(true),
        error: () => {
          this.clearSession();
          this.isInitialized.set(true);
        },
      });
    } else {
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
    this.currentUser.set(null);
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, dto).pipe(
      tap((res) => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.currentUser.set(res.user);
      })
    );
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, dto).pipe(
      tap((res) => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.currentUser.set(res.user);
      })
    );
  }

  loadCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((err) => {
        this.clearSession();
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
