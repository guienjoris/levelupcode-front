import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { AuthService } from '../../core/auth/auth.service';
import { Category } from '../../core/models/category.model';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import {
  LucideSparkles,
  LucideArrowRight,
  LucideShieldCheck,
  LucideFlame,
  LucideAward,
  LucideBookOpen,
  LucideCheckCircle2,
} from '@lucide/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CategoryCardComponent,
    LucideSparkles,
    LucideArrowRight,
    LucideShieldCheck,
    LucideFlame,
    LucideAward,
    LucideBookOpen,
    LucideCheckCircle2,
  ],
  template: `
    <div class="space-y-24 py-8">
      
      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-12 pb-16">
        <!-- Glow Orbs Background -->
        <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-500/10 blur-[120px] pointer-events-none rounded-full"></div>

        <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <!-- Pill Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <svg lucideSparkles class="w-3.5 h-3.5 text-indigo-400"></svg>
            <span>Plateforme 100% Gratuite sur Inscription</span>
          </div>

          <!-- Main Title -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Montez en puissance sur le <br />
            <span class="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Développement Moderne
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            NestJS, TypeScript, Docker, React, Angular, Architecture... Maîtrisez les concepts clés grâce à des fiches pédagogiques ciblées et des quiz interactifs anti-triche.
          </p>

          <!-- Call to actions -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              routerLink="/catalog"
              class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <svg lucideBookOpen class="w-5 h-5"></svg>
              <span>Explorer le Catalogue</span>
              <svg lucideArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform"></svg>
            </a>

            @if (!authService.isAuthenticated()) {
              <a
                routerLink="/register"
                class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Créer un compte gratuit</span>
              </a>
            } @else {
              <a
                routerLink="/profile"
                class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Accéder à mon Dashboard</span>
              </a>
            }
          </div>

          <!-- Key Highlights / Badges -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-left">
            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
              <div class="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <svg lucideCheckCircle2 class="w-5 h-5"></svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Accès intégral</p>
                <p class="text-sm font-bold text-white">100% Gratuit</p>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
              <div class="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <svg lucideFlame class="w-5 h-5"></svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Gamification</p>
                <p class="text-sm font-bold text-white">Séries & XP</p>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
              <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <svg lucideShieldCheck class="w-5 h-5"></svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Évaluations</p>
                <p class="text-sm font-bold text-white">Anti-Triche</p>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
              <div class="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <svg lucideAward class="w-5 h-5"></svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Communauté</p>
                <p class="text-sm font-bold text-white">Classement Dev</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Featured Categories Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 class="text-3xl font-extrabold text-white tracking-tight">
              Parcours Pédagogiques
            </h2>
            <p class="text-slate-400 text-sm mt-1">
              Des technologies modernes sélectionnées pour leur impact sur le marché.
            </p>
          </div>

          <a
            routerLink="/catalog"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Voir toutes les catégories</span>
            <svg lucideArrowRight class="w-4 h-4"></svg>
          </a>
        </div>

        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="h-64 rounded-2xl bg-slate-800/40 border border-slate-800 animate-pulse"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (category of categories(); track category.id) {
              <app-category-card [category]="category"></app-category-card>
            }
          </div>
        }
      </section>

      <!-- Why LevelUpCode Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800/80 shadow-2xl space-y-8">
          <div class="max-w-2xl">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pourquoi apprendre avec LevelUpCode ?
            </h2>
            <p class="text-slate-400 text-sm mt-2 leading-relaxed">
              Nous avons éliminé le superflu pour vous offrir une formation directe, dense et actionnable, centrée sur la pratique quotidienne des équipes de haut niveau.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
              <span class="text-2xl">⚡</span>
              <h3 class="text-lg font-bold text-white">Leçons Concises & Markdown</h3>
              <p class="text-sm text-slate-400 leading-relaxed">
                Des explications illustrées de snippets TypeScript prêts à l'emploi. Copiez le code en un clic et testez immédiatement.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
              <span class="text-2xl">🧠</span>
              <h3 class="text-lg font-bold text-white">Validation Anti-Triche</h3>
              <p class="text-sm text-slate-400 leading-relaxed">
                Les réponses sont validées côté serveur. Vous accédez aux explications pédagogiques détaillées uniquement après soumission.
              </p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
              <span class="text-2xl">☕</span>
              <h3 class="text-lg font-bold text-white">Soutenu par la Communauté</h3>
              <p class="text-sm text-slate-400 leading-relaxed">
                Pas d'abonnement caché ni de paywall. Les passionnés peuvent soutenir les serveurs via Buy Me a Coffee et obtenir le badge exclusif.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
})
export class HomeComponent implements OnInit {
  readonly catalogService = inject(CatalogService);
  readonly authService = inject(AuthService);

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
