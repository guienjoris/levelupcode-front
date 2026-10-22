import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LucideCode2, LucideSparkles, LucideArrowRight, LucideAlertCircle } from '@lucide/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideCode2, LucideSparkles, LucideArrowRight, LucideAlertCircle],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md space-y-8 p-8 sm:p-10 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-2xl backdrop-blur-md">
        
        <!-- Logo & Title -->
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 text-white">
            <svg lucideCode2 class="w-6 h-6"></svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Créer un compte gratuit
          </h2>
          <p class="text-sm text-slate-400">
            Accédez instantanément à toutes les leçons et à tous les quiz
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
            <label for="name" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Prénom ou Pseudo
            </label>
            <input
              id="name"
              type="text"
              [(ngModel)]="name"
              name="name"
              placeholder="Alexandre"
              class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Adresse Email *
            </label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="email"
              placeholder="alexandre@developpeur.fr"
              class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Mot de passe (8 caractères min.) *
            </label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="8"
              autocomplete="new-password"
              placeholder="••••••••••••"
              class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <button
            type="submit"
            [disabled]="isLoading() || !email() || !password() || password().length < 8"
            class="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group mt-2"
          >
            @if (isLoading()) {
              <span>Création de votre compte...</span>
            } @else {
              <svg lucideSparkles class="w-4 h-4"></svg>
              <span>Rejoindre LevelUpCode</span>
              <svg lucideArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform"></svg>
            }
          </button>
        </form>

        <!-- OAuth Social Buttons -->
        <div class="space-y-4 pt-2">
          <div class="relative flex items-center justify-center">
            <div class="border-t border-slate-700 w-full"></div>
            <span class="bg-slate-800 px-3 text-xs text-slate-500 uppercase tracking-wider">ou s'inscrire avec</span>
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
            Déjà inscrit ?
            <a
              routerLink="/login"
              [queryParams]="route.snapshot.queryParams"
              class="text-indigo-400 font-semibold hover:text-indigo-300 underline ml-1"
            >
              Se connecter
            </a>
          </p>
        </div>

      </div>
    </div>
  `,
})
export class RegisterComponent {
  readonly authService = inject(AuthService);
  readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly name = signal<string>('');
  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.email() || !this.password()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService
      .register({
        name: this.name().trim() || undefined,
        email: this.email().trim(),
        password: this.password(),
      })
      .subscribe({
        next: (res) => {
          this.toast.success('Compte créé avec succès ! Bienvenue sur LevelUpCode.');
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/catalog';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.errorMessage.set(
            err.error?.message || "Erreur lors de l'inscription. Cet email est peut-être déjà utilisé."
          );
          this.isLoading.set(false);
        },
      });
  }
}
