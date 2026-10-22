import { Component, inject, signal, OnInit } from '@angular/core';
import { GamificationService } from '../../core/services/gamification.service';
import { LeaderboardUser } from '../../core/models/gamification.model';
import { SupporterBadgeComponent } from '../../shared/components/supporter-badge/supporter-badge.component';
import {
  LucideTrophy,
  LucideFlame,
  LucideSparkles,
  LucideChevronLeft,
  LucideChevronRight,
  LucideAward,
} from '@lucide/angular';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [
    SupporterBadgeComponent,
    LucideTrophy,
    LucideFlame,
    LucideChevronLeft,
    LucideChevronRight,
    LucideAward,
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Header -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
          <svg lucideTrophy class="w-3.5 h-3.5"></svg>
          <span>Classement Général des Apprenants</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Panthéon des Développeurs
        </h1>
        <p class="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Chaque leçon validée et quiz réussi vous rapporte de l'XP et prolonge votre streak. Hisserez-vous votre profil au sommet ?
        </p>
      </div>

      <!-- Top 3 Podium (Desktop) -->
      @if (!isLoading() && topThree().length >= 3) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 items-end">
          
          <!-- 2nd Place -->
          <div class="order-2 md:order-1 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-center space-y-3 relative overflow-hidden">
            <div class="text-3xl font-extrabold text-slate-400">🥈 #2</div>
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
              {{ getInitial(topThree()[1].name) }}
            </div>
            <div>
              <h3 class="font-bold text-white text-base truncate">{{ topThree()[1].name }}</h3>
              @if (topThree()[1].isSupporter) {
                <div class="mt-1 flex justify-center">
                  <app-supporter-badge [compact]="true"></app-supporter-badge>
                </div>
              }
            </div>
            <div class="pt-2 border-t border-slate-700/50 flex items-center justify-center gap-4 text-xs">
              <span class="font-bold text-indigo-400">{{ topThree()[1].totalXp }} XP</span>
              <span class="text-amber-400 font-semibold flex items-center gap-1">
                <svg lucideFlame class="w-3.5 h-3.5"></svg>
                {{ topThree()[1].currentStreak }} j
              </span>
            </div>
          </div>

          <!-- 1st Place (Champion) -->
          <div class="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-800/80 to-slate-800/90 border border-amber-500/40 text-center space-y-4 relative overflow-hidden shadow-2xl shadow-amber-500/10 -translate-y-2">
            <div class="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <svg lucideAward class="w-4 h-4"></svg>
              <span>Champion</span>
            </div>
            <div class="text-4xl font-extrabold text-amber-400">🥇 #1</div>
            <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-900 font-black text-2xl flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-500/30">
              {{ getInitial(topThree()[0].name) }}
            </div>
            <div>
              <h3 class="font-extrabold text-white text-lg truncate">{{ topThree()[0].name }}</h3>
              @if (topThree()[0].isSupporter) {
                <div class="mt-1 flex justify-center">
                  <app-supporter-badge [compact]="true"></app-supporter-badge>
                </div>
              }
            </div>
            <div class="pt-2 border-t border-slate-700/50 flex items-center justify-center gap-4 text-sm">
              <span class="font-black text-indigo-300">{{ topThree()[0].totalXp }} XP</span>
              <span class="text-amber-400 font-bold flex items-center gap-1">
                <svg lucideFlame class="w-4 h-4"></svg>
                {{ topThree()[0].currentStreak }} jours
              </span>
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="order-3 md:order-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-center space-y-3 relative overflow-hidden">
            <div class="text-3xl font-extrabold text-amber-700">🥉 #3</div>
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
              {{ getInitial(topThree()[2].name) }}
            </div>
            <div>
              <h3 class="font-bold text-white text-base truncate">{{ topThree()[2].name }}</h3>
              @if (topThree()[2].isSupporter) {
                <div class="mt-1 flex justify-center">
                  <app-supporter-badge [compact]="true"></app-supporter-badge>
                </div>
              }
            </div>
            <div class="pt-2 border-t border-slate-700/50 flex items-center justify-center gap-4 text-xs">
              <span class="font-bold text-indigo-400">{{ topThree()[2].totalXp }} XP</span>
              <span class="text-amber-400 font-semibold flex items-center gap-1">
                <svg lucideFlame class="w-3.5 h-3.5"></svg>
                {{ topThree()[2].currentStreak }} j
              </span>
            </div>
          </div>

        </div>
      }

      <!-- Full Table -->
      <div class="rounded-2xl bg-slate-800/40 border border-slate-700/80 shadow-xl overflow-hidden">
        @if (isLoading()) {
          <div class="p-8 space-y-4">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <div class="h-12 bg-slate-800/60 rounded-xl animate-pulse"></div>
            }
          </div>
        } @else if (users().length === 0) {
          <div class="p-12 text-center text-slate-400 text-sm">
            Aucun apprenant enregistré pour l'instant. Soyez le premier à valider une leçon !
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/80 font-semibold">
                <tr>
                  <th scope="col" class="py-3.5 px-4 w-16 text-center">Rang</th>
                  <th scope="col" class="py-3.5 px-4">Apprenant</th>
                  <th scope="col" class="py-3.5 px-4 text-center">Série active</th>
                  <th scope="col" class="py-3.5 px-4 text-right">Points d'XP</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                @for (user of users(); track user.userId) {
                  <tr class="hover:bg-slate-800/50 transition-colors">
                    
                    <!-- Rank -->
                    <td class="py-3.5 px-4 text-center font-bold font-mono text-sm" [class.text-amber-400]="user.rank === 1" [class.text-slate-300]="user.rank === 2" [class.text-amber-700]="user.rank === 3" [class.text-slate-500]="user.rank > 3">
                      #{{ user.rank }}
                    </td>

                    <!-- Name + Supporter -->
                    <td class="py-3.5 px-4 flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/50 text-indigo-200 text-xs font-bold flex items-center justify-center shrink-0">
                        {{ getInitial(user.name) }}
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-white">{{ user.name }}</span>
                        @if (user.isSupporter) {
                          <app-supporter-badge [compact]="true"></app-supporter-badge>
                        }
                      </div>
                    </td>

                    <!-- Streak -->
                    <td class="py-3.5 px-4 text-center">
                      <span class="inline-flex items-center gap-1 font-semibold text-amber-400 text-xs">
                        <svg lucideFlame class="w-3.5 h-3.5"></svg>
                        {{ user.currentStreak }} {{ user.currentStreak > 1 ? 'jours' : 'jour' }}
                      </span>
                    </td>

                    <!-- XP -->
                    <td class="py-3.5 px-4 text-right font-extrabold text-indigo-400">
                      {{ user.totalXp }} XP
                    </td>

                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span>Page {{ currentPage() }} sur {{ totalPages() }}</span>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  [disabled]="currentPage() === 1"
                  (click)="changePage(currentPage() - 1)"
                  class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg lucideChevronLeft class="w-4 h-4"></svg>
                </button>

                <button
                  type="button"
                  [disabled]="currentPage() === totalPages()"
                  (click)="changePage(currentPage() + 1)"
                  class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg lucideChevronRight class="w-4 h-4"></svg>
                </button>
              </div>
            </div>
          }
        }
      </div>

    </div>
  `,
})
export class LeaderboardComponent implements OnInit {
  private readonly gamificationService = inject(GamificationService);

  readonly users = signal<LeaderboardUser[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(1);

  topThree(): LeaderboardUser[] {
    return this.users().slice(0, 3);
  }

  getInitial(name: string): string {
    return (name || 'U').charAt(0).toUpperCase();
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading.set(true);
    this.gamificationService.getLeaderboard(page, 20).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.currentPage.set(res.meta.page);
        this.totalPages.set(res.meta.totalPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.loadPage(page);
    }
  }
}
