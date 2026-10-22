import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Category } from '../../../core/models/category.model';
import { LessonListItem } from '../../../core/models/lesson.model';
import {
  LucideArrowLeft,
  LucideBookOpen,
  LucideLock,
  LucideCheckCircle2,
  LucideSparkles,
  LucidePlay,
  LucideCode2,
} from '@lucide/angular';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    RouterLink,
    LucideArrowLeft,
    LucideBookOpen,
    LucideLock,
    LucideCheckCircle2,
    LucideSparkles,
    LucidePlay,
    LucideCode2,
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Back Link -->
      <a
        routerLink="/catalog"
        class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
      >
        <svg lucideArrowLeft class="w-4 h-4"></svg>
        <span>Retour au catalogue</span>
      </a>

      <!-- Category Hero Header -->
      <div class="p-8 sm:p-10 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div class="w-20 h-20 rounded-2xl bg-slate-900/90 border border-slate-700 p-3.5 flex items-center justify-center shrink-0 shadow-inner">
            @if (!imageFailed()) {
              <img
                [src]="iconUrl()"
                [alt]="category()?.name || slug()"
                (error)="imageFailed.set(true)"
                class="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]"
              />
            } @else {
              <svg lucideCode2 class="w-10 h-10 text-indigo-400"></svg>
            }
          </div>

          <div class="space-y-2">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {{ category()?.name || slug() }}
            </h1>
            <p class="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {{ category()?.description }}
            </p>

            @if (category()?.tags && category()!.tags!.length > 0) {
              <div class="flex flex-wrap gap-1.5 pt-2">
                @for (tag of category()!.tags; track tag.id) {
                  <span class="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-900/80 text-indigo-300 border border-indigo-500/20">
                    {{ tag.name }}
                  </span>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Lessons Section -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <svg lucideBookOpen class="w-5 h-5 text-indigo-400"></svg>
            <span>Programme des Leçons</span>
          </h2>

          @if (lessons().length > 0) {
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {{ lessons().length }} leçons disponibles
            </span>
          }
        </div>

        <!-- If user NOT logged in: Prompt to sign up / log in -->
        @if (!authService.isAuthenticated()) {
          <div class="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 text-center space-y-5">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
              <svg lucideLock class="w-6 h-6"></svg>
            </div>
            
            <div class="max-w-md mx-auto space-y-2">
              <h3 class="text-xl font-bold text-white">Contenu réservé aux membres</h3>
              <p class="text-sm text-slate-300 leading-relaxed">
                L'accès aux leçons et aux quiz de cette catégorie est 100% gratuit mais requiert une inscription pour enregistrer votre progression, vos points d'XP et votre série quotidienne.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                routerLink="/register"
                [queryParams]="{ returnUrl: currentUrl() }"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <svg lucideSparkles class="w-4 h-4"></svg>
                <span>Créer mon compte gratuit</span>
              </a>

              <a
                routerLink="/login"
                [queryParams]="{ returnUrl: currentUrl() }"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Se connecter
              </a>
            </div>
          </div>
        } @else {
          <!-- Authenticated Member View -->
          @if (isLoadingLessons()) {
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-20 rounded-xl bg-slate-800/40 border border-slate-800 animate-pulse"></div>
              }
            </div>
          } @else if (lessons().length === 0) {
            <div class="p-8 rounded-2xl bg-slate-800/20 border border-slate-800 text-center text-slate-400 text-sm">
              Aucune leçon n'est encore publiée dans cette catégorie.
            </div>
          } @else {
            <div class="space-y-3">
              @for (lesson of lessons(); track lesson.id) {
                <a
                  [routerLink]="['/lessons', lesson.slug]"
                  class="group flex items-center justify-between p-4 sm:p-5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 shadow-sm transition-all"
                >
                  <div class="flex items-center gap-4">
                    <span class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs font-semibold text-slate-400 flex items-center justify-center shrink-0">
                      #{{ lesson.orderIndex }}
                    </span>

                    <div>
                      <h4 class="font-bold text-white group-hover:text-indigo-300 transition-colors text-base sm:text-lg">
                        {{ lesson.title }}
                      </h4>
                      <div class="flex items-center gap-2 mt-1">
                        <span
                          class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
                          [class.bg-emerald-500\/10]="lesson.difficulty === 'NOVICE'"
                          [class.text-emerald-400]="lesson.difficulty === 'NOVICE'"
                          [class.border]="true"
                          [class.border-emerald-500\/30]="lesson.difficulty === 'NOVICE'"
                          [class.bg-blue-500\/10]="lesson.difficulty === 'INTERMEDIAIRE'"
                          [class.text-blue-400]="lesson.difficulty === 'INTERMEDIAIRE'"
                          [class.border-blue-500\/30]="lesson.difficulty === 'INTERMEDIAIRE'"
                          [class.bg-rose-500\/10]="lesson.difficulty === 'SENIOR'"
                          [class.text-rose-400]="lesson.difficulty === 'SENIOR'"
                          [class.border-rose-500\/30]="lesson.difficulty === 'SENIOR'"
                        >
                          {{ lesson.difficulty }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    @if (lesson.isCompleted) {
                      <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <svg lucideCheckCircle2 class="w-4 h-4"></svg>
                        <span class="hidden sm:inline">Validée</span>
                      </div>
                    }

                    <div class="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 group-hover:bg-indigo-600 group-hover:border-indigo-500 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                      <svg lucidePlay class="w-4 h-4 ml-0.5"></svg>
                    </div>
                  </div>
                </a>
              }
            </div>
          }
        }
      </div>

    </div>
  `,
})
export class CategoryDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(CatalogService);
  readonly authService = inject(AuthService);

  readonly slug = signal<string>('');
  readonly category = signal<Category | null>(null);
  readonly lessons = signal<LessonListItem[]>([]);
  readonly isLoadingLessons = signal<boolean>(false);
  readonly imageFailed = signal<boolean>(false);

  currentUrl(): string {
    return `/catalog/${this.slug()}`;
  }

  iconUrl(): string {
    return `/icons/${this.slug()}.svg`;
  }

  ngOnInit(): void {
    const s = this.route.snapshot.paramMap.get('slug') || '';
    this.slug.set(s);

    // Fetch categories to get metadata of current
    this.catalogService.getCategories().subscribe((categories) => {
      const found = categories.find((c) => c.slug === s);
      if (found) {
        this.category.set(found);
      }
    });

    if (this.authService.isAuthenticated()) {
      this.loadLessons();
    }
  }

  loadLessons(): void {
    this.isLoadingLessons.set(true);
    this.catalogService.getCategoryLessons(this.slug()).subscribe({
      next: (data) => {
        this.lessons.set(data);
        this.isLoadingLessons.set(false);
      },
      error: () => {
        this.isLoadingLessons.set(false);
      },
    });
  }
}
