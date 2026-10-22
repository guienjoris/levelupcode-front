import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LucideCode2, LucideArrowRight, LucideAlertCircle } from '@lucide/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideCode2, LucideArrowRight, LucideAlertCircle],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md space-y-8 p-8 sm:p-10 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-2xl backdrop-blur-md">
        
        <!-- Logo & Title -->
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 text-white">
            <svg lucideCode2 class="w-6 h-6"></svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bon retour sur LevelUp<span class="text-indigo-400">Code</span>
          </h2>
          <p class="text-sm text-slate-400">
            Connectez-vous pour reprendre vos leçons et vos quiz
          </p>
        </div>

        <!-- Error Alert -->
        @if (errorMessage()) {
          <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <svg lucideAlertCircle class="w-4 h-4 shrink-0"></svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Adresse Email
            </label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="email"
              placeholder="dev@levelupcode.fr"
              class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="current-password"
              placeholder="••••••••••••"
              class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <button
            type="submit"
            [disabled]="isLoading() || !email() || !password()"
            class="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group mt-2"
          >
            @if (isLoading()) {
              <span>Connexion en cours...</span>
            } @else {
              <span>Se connecter</span>
              <svg lucideArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform"></svg>
            }
          </button>
        </form>

        <!-- OAuth Social Buttons -->
        <div class="space-y-4 pt-2">
          <div class="relative flex items-center justify-center">
            <div class="border-t border-slate-700 w-full"></div>
            <span class="bg-slate-800 px-3 text-xs text-slate-500 uppercase tracking-wider">ou continuer avec</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              (click)="authService.loginWithGoogle()"
              class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-all"
            >
              <span>Google</span>
            </button>

            <button
              type="button"
              (click)="authService.loginWithGithub()"
              class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-all"
            >
              <span>GitHub</span>
            </button>
          </div>
        </div>

        <!-- Footer link -->
        <div class="text-center pt-2">
          <p class="text-xs text-slate-400">
            Pas encore de compte ?
            <a
              routerLink="/register"
              [queryParams]="route.snapshot.queryParams"
              class="text-indigo-400 font-semibold hover:text-indigo-300 underline ml-1"
            >
              S'inscrire gratuitement
            </a>
          </p>
        </div>

      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;

    // Détection de tokens retournés par la redirection OAuth du backend
    const accessToken = params['accessToken'] || params['token'];
    const refreshToken = params['refreshToken'];

    if (accessToken) {
      this.authService.setTokens(accessToken, refreshToken);
      this.authService.loadCurrentUser().subscribe({
        next: (user) => {
          this.toast.success(`Bienvenue, ${user.name || user.email} !`);
          const returnUrl = params['returnUrl'] || '/catalog';
          this.router.navigateByUrl(returnUrl);
        },
        error: () => {
          this.errorMessage.set('Erreur lors de la récupération de votre profil OAuth.');
        },
      });
      return;
    }

    // Détection d'erreur OAuth
    if (params['error']) {
      this.errorMessage.set(
        params['error_description'] ||
          'La connexion via le fournisseur d’identité a échoué. Veuillez vérifier la configuration OAuth.'
      );
    }
  }

  onSubmit(): void {
    if (!this.email() || !this.password()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login({
        email: this.email().trim(),
        password: this.password(),
      })
      .subscribe({
        next: (res) => {
          this.toast.success(`Bienvenue, ${res.user.name || res.user.email} !`);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/catalog';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.errorMessage.set(
            err.error?.message || 'Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe.'
          );
          this.isLoading.set(false);
        },
      });
  }
}
