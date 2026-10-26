import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { GamificationService } from '../../core/services/gamification.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UserStats } from '../../core/models/gamification.model';
import { SupporterBadgeComponent } from '../../shared/components/supporter-badge/supporter-badge.component';
import { environment } from '../../../environments/environment';
import {
  LucideFlame,
  LucideTrophy,
  LucideBookOpen,
  LucideHelpCircle,
  LucideCoffee,
  LucideBell,
  LucideCalendar,
  LucideShield,
  LucideSparkles,
  LucideZap,
  LucideArrowRight,
} from '@lucide/angular';

@Component({
  selector: 'app-profile-stats',
  standalone: true,
  imports: [
    RouterLink,
    SupporterBadgeComponent,
    LucideFlame,
    LucideTrophy,
    LucideBookOpen,
    LucideHelpCircle,
    LucideCoffee,
    LucideBell,
    LucideCalendar,
    LucideShield,
    LucideSparkles,
    LucideZap,
    LucideArrowRight,
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Profile Header Card -->
      <div class="p-8 sm:p-10 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
            {{ userInitial() }}
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center gap-2.5 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
                {{ authService.currentUser()?.name || 'Apprenant' }}
              </h1>
              @if (authService.isSupporter()) {
                <app-supporter-badge></app-supporter-badge>
              }
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300">
                <svg lucideSparkles class="w-3.5 h-3.5 text-indigo-400"></svg>
                Niveau {{ calculateLevel(stats()?.totalXp ?? 0) }}
              </span>
            </div>

            <p class="text-sm text-slate-400">{{ authService.currentUser()?.email }}</p>

            <div class="flex items-center gap-3 pt-1 text-xs text-slate-400 flex-wrap">
              <span class="flex items-center gap-1">
                <svg lucideCalendar class="w-3.5 h-3.5 text-slate-500"></svg>
                Inscrit depuis {{ registrationText() }}
              </span>
              @if (authService.isAdmin()) {
                <span class="flex items-center gap-1 text-indigo-400 font-semibold">
                  <svg lucideShield class="w-3.5 h-3.5"></svg>
                  Administrateur
                </span>
              }
            </div>
          </div>
        </div>

        <!-- Buy Me a Coffee Supporter CTA or Badge -->
        @if (!authService.isSupporter()) {
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 shrink-0"
          >
            <svg lucideCoffee class="w-4 h-4 text-amber-400"></svg>
            <span>Devenir Supporter</span>
          </a>
        }
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="h-28 rounded-2xl bg-slate-800/40 border border-slate-800 animate-pulse"></div>
          }
        </div>
      } @else if (stats()) {
        <!-- Gamification Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <!-- Current Streak -->
          <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <svg lucideFlame class="w-4 h-4 text-amber-400"></svg>
              Série Actuelle
            </span>
            <p class="text-3xl font-black text-amber-400">
              {{ stats()!.currentStreak }} <span class="text-xs font-normal text-slate-400">j</span>
            </p>
            <p class="text-[11px] text-slate-400">Record : {{ stats()!.longestStreak }} jours</p>
          </div>

          <!-- Total XP -->
          <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <svg lucideTrophy class="w-4 h-4 text-indigo-400"></svg>
              Total XP
            </span>
            <p class="text-3xl font-black text-indigo-300">
              {{ stats()!.totalXp }} <span class="text-xs font-normal text-slate-400">XP</span>
            </p>
            <p class="text-[11px] text-slate-400">Niveau {{ calculateLevel(stats()!.totalXp) }}</p>
          </div>

          <!-- Lessons Completed -->
          <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <svg lucideBookOpen class="w-4 h-4 text-emerald-400"></svg>
              Leçons Validées
            </span>
            <p class="text-3xl font-black text-white">
              {{ stats()!.completedLessonsCount }}
            </p>
            <p class="text-[11px] text-slate-400">Fiches étudiées</p>
          </div>

          <!-- Quizzes Completed -->
          <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <svg lucideHelpCircle class="w-4 h-4 text-purple-400"></svg>
              Quiz Validés
            </span>
            <p class="text-3xl font-black text-white">
              {{ stats()!.completedQuizzesCount }}
            </p>
            <p class="text-[11px] text-slate-400">Évaluations passées</p>
          </div>

        </div>

        <!-- Level & XP Progression Banner -->
        <div class="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-lg space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-md">
                {{ calculateLevel(stats()!.totalXp) }}
              </div>
              <div>
                <h3 class="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Niveau {{ calculateLevel(stats()!.totalXp) }}</span>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {{ stats()!.totalXp }} XP cumulés
                  </span>
                </h3>
                <p class="text-xs text-slate-400">
                  Encore {{ xpToNextLevel(stats()!.totalXp) }} XP pour atteindre le Niveau {{ calculateLevel(stats()!.totalXp) + 1 }}
                </p>
              </div>
            </div>
            <div class="text-left sm:text-right">
              <span class="text-sm font-black text-indigo-400 font-mono">{{ xpInCurrentLevel(stats()!.totalXp) }}</span>
              <span class="text-xs text-slate-400 font-mono"> / 100 XP</span>
            </div>
          </div>

          <div class="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 shadow-sm"
              [style.width.%]="levelProgressPercentage(stats()!.totalXp)"
            ></div>
          </div>
        </div>

        <!-- Scores Breakdown Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Category Scores -->
          <div class="p-6 sm:p-8 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-lg space-y-5">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <svg lucideTrophy class="w-5 h-5 text-indigo-400"></svg>
              <span>Points d'XP par Catégorie</span>
            </h3>

            @if (!stats()?.xpByCategory || stats()!.xpByCategory.length === 0) {
              <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <p class="text-xs text-slate-400">Vous n'avez pas encore validé de leçon ou de quiz.</p>
                <a routerLink="/catalog" class="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                  <span>Explorer le catalogue</span>
                  <svg lucideArrowRight class="w-3.5 h-3.5"></svg>
                </a>
              </div>
            } @else {
              <div class="space-y-4">
                @for (cat of stats()!.xpByCategory; track cat.categoryId) {
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs font-semibold">
                      <span class="text-slate-200">{{ cat.categoryName }}</span>
                      <span class="text-indigo-400 font-mono font-bold">{{ cat.xp }} XP</span>
                    </div>
                    <div class="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        [style.width.%]="calcPercentage(cat.xp, stats()!.totalXp)"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Tag Scores -->
          <div class="p-6 sm:p-8 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-lg space-y-5">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <svg lucideZap class="w-5 h-5 text-purple-400"></svg>
              <span>Points d'XP par Tag Technique</span>
            </h3>

            @if (!stats()?.xpByTag || stats()!.xpByTag.length === 0) {
              <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <p class="text-xs text-slate-400">Aucun tag enregistré pour le moment.</p>
                <p class="text-[11px] text-slate-500">Validez des quiz pour voir vos compétences évoluer par tag.</p>
              </div>
            } @else {
              <div class="space-y-4">
                @for (tag of stats()!.xpByTag; track tag.tagId) {
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs font-semibold">
                      <span class="text-slate-200">{{ tag.tagName }}</span>
                      <span class="text-purple-400 font-mono font-bold">{{ tag.xp }} XP</span>
                    </div>
                    <div class="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        [style.width.%]="calcPercentage(tag.xp, stats()!.totalXp)"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

        </div>

        <!-- Notification Settings -->
        <div class="p-6 sm:p-8 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-lg space-y-4">
          <div class="flex items-center justify-between gap-4">
            <label for="emailReminder" class="space-y-1 cursor-pointer select-none">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <svg lucideBell class="w-5 h-5 text-amber-400"></svg>
                <span>Rappel quotidien de streak</span>
              </h3>
              <p class="text-xs text-slate-400 max-w-xl">
                Recevez un email à 19h00 pour ne jamais perdre votre série de jours actifs consécutifs.
              </p>
            </label>

            <input
              id="emailReminder"
              type="checkbox"
              [checked]="emailDailyReminder()"
              (change)="toggleEmailReminder($event)"
              class="w-5 h-5 rounded-md border border-slate-600 bg-slate-900 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer accent-indigo-600 transition-colors"
            />
          </div>
        </div>
      }

    </div>
  `,
})
export class ProfileStatsComponent implements OnInit {
  private readonly gamificationService = inject(GamificationService);
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  readonly stats = signal<UserStats | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly emailDailyReminder = signal<boolean>(true);

  userInitial(): string {
    const user = this.authService.currentUser();
    return (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  }

  calculateLevel(xp: number): number {
    return Math.floor((xp || 0) / 100) + 1;
  }

  xpInCurrentLevel(xp: number): number {
    return (xp || 0) % 100;
  }

  xpToNextLevel(xp: number): number {
    return 100 - this.xpInCurrentLevel(xp);
  }

  levelProgressPercentage(xp: number): number {
    return this.xpInCurrentLevel(xp);
  }

  registrationText(): string {
    const days = this.stats()?.daysSinceRegistration ?? this.stats()?.registrationDays ?? 1;
    return `${days} jour${days > 1 ? 's' : ''}`;
  }

  calcPercentage(amount: number, total: number): number {
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.round((amount / total) * 100));
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && typeof user.emailDailyReminder === 'boolean') {
      this.emailDailyReminder.set(user.emailDailyReminder);
    }

    this.gamificationService.getMyStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  toggleEmailReminder(event?: Event): void {
    const input = event?.target as HTMLInputElement | null;
    const nextVal = input ? input.checked : !this.emailDailyReminder();
    this.emailDailyReminder.set(nextVal);

    this.http
      .patch<{ success: boolean; emailDailyReminder: boolean }>(
        `${environment.apiUrl}/notifications/preferences`,
        { emailDailyReminder: nextVal }
      )
      .subscribe({
        next: (res) => {
          if (typeof res?.emailDailyReminder === 'boolean') {
            this.emailDailyReminder.set(res.emailDailyReminder);
          }
          this.toast.success(
            nextVal
              ? 'Rappel quotidien de streak activé (19h00).'
              : 'Rappel quotidien désactivé.'
          );
        },
        error: (err) => {
          console.error('Erreur mise à jour streak reminder:', err);
          this.emailDailyReminder.set(!nextVal);
          this.toast.error('Erreur lors de la mise à jour de vos préférences.');
        },
      });
  }
}
