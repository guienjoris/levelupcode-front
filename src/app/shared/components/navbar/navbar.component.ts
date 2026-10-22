import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { SupporterBadgeComponent } from '../supporter-badge/supporter-badge.component';
import {
  LucideCode2,
  LucideMenu,
  LucideX,
  LucideUser,
  LucideLogOut,
  LucideShield,
  LucideSparkles,
  LucideHeart,
  LucideTrophy,
  LucideBookOpen,
} from '@lucide/angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SupporterBadgeComponent,
    LucideCode2,
    LucideMenu,
    LucideX,
    LucideUser,
    LucideLogOut,
    LucideShield,
    LucideSparkles,
    LucideHeart,
    LucideTrophy,
    LucideBookOpen,
  ],
  template: `
    <header class="sticky top-0 z-40 w-full glass-nav border-b border-slate-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2.5 group">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <svg lucideCode2 class="w-5 h-5 text-white"></svg>
              </div>
              <div class="flex flex-col">
                <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  LevelUp<span class="text-indigo-400">Code</span>
                </span>
                <span class="text-[10px] tracking-wider uppercase text-slate-400 font-semibold -mt-1">
                  100% Pratique
                </span>
              </div>
            </a>

            <!-- Navigation Links (Desktop) -->
            <nav class="hidden md:flex items-center gap-1">
              <a
                routerLink="/catalog"
                routerLinkActive="text-white bg-slate-800/80"
                [routerLinkActiveOptions]="{ exact: false }"
                class="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-2"
              >
                <svg lucideBookOpen class="w-4 h-4 text-indigo-400"></svg>
                <span>Catalogue</span>
              </a>

              <a
                routerLink="/leaderboard"
                routerLinkActive="text-white bg-slate-800/80"
                class="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-2"
              >
                <svg lucideTrophy class="w-4 h-4 text-amber-400"></svg>
                <span>Classement</span>
              </a>

              <a
                routerLink="/donations"
                routerLinkActive="text-white bg-slate-800/80"
                class="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-2"
              >
                <svg lucideHeart class="w-4 h-4 text-pink-400"></svg>
                <span>Soutenir</span>
              </a>

              @if (authService.isAdmin()) {
                <a
                  routerLink="/admin"
                  routerLinkActive="text-white bg-indigo-900/40"
                  class="px-3.5 py-2 rounded-lg text-sm font-medium text-indigo-300 hover:text-white hover:bg-indigo-900/30 transition-colors flex items-center gap-2 border border-indigo-500/30 ml-2"
                >
                  <svg lucideShield class="w-4 h-4 text-indigo-400"></svg>
                  <span>Admin</span>
                </a>
              }
            </nav>
          </div>

          <!-- Right Action Section -->
          <div class="hidden md:flex items-center gap-3">
            @if (authService.isAuthenticated()) {
              @if (authService.isSupporter()) {
                <app-supporter-badge></app-supporter-badge>
              }

              <!-- User Menu Dropdown Toggle -->
              <div class="relative">
                <button
                  type="button"
                  (click)="isUserMenuOpen.set(!isUserMenuOpen())"
                  class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition-all text-left focus:outline-none"
                >
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow">
                    {{ userInitial() }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-semibold text-slate-200 leading-tight">
                      {{ authService.currentUser()?.name || 'Mon Profil' }}
                    </span>
                    <span class="text-[10px] text-slate-400 leading-tight">
                      {{ authService.currentUser()?.email }}
                    </span>
                  </div>
                </button>

                <!-- Dropdown Menu -->
                @if (isUserMenuOpen()) {
                  <div
                    class="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-md py-1.5 z-50 animate-in fade-in zoom-in-95"
                    (mouseleave)="isUserMenuOpen.set(false)"
                  >
                    <a
                      routerLink="/profile"
                      (click)="isUserMenuOpen.set(false)"
                      class="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <svg lucideUser class="w-4 h-4 text-indigo-400"></svg>
                      <span>Mon Dashboard</span>
                    </a>

                    @if (authService.isAdmin()) {
                      <a
                        routerLink="/admin"
                        (click)="isUserMenuOpen.set(false)"
                        class="flex items-center gap-2.5 px-4 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-950/40 transition-colors"
                      >
                        <svg lucideShield class="w-4 h-4 text-indigo-400"></svg>
                        <span>Espace Admin</span>
                      </a>
                    }

                    <div class="my-1 border-t border-slate-800"></div>

                    <button
                      type="button"
                      (click)="logout()"
                      class="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <svg lucideLogOut class="w-4 h-4"></svg>
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                }
              </div>
            } @else {
              <!-- Guest Buttons -->
              <a
                routerLink="/login"
                class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Se connecter
              </a>

              <a
                routerLink="/register"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <svg lucideSparkles class="w-4 h-4"></svg>
                <span>Rejoindre gratuitement</span>
              </a>
            }
          </div>

          <!-- Mobile Hamburger Toggle -->
          <div class="flex md:hidden">
            <button
              type="button"
              (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
              class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Menu"
            >
              @if (isMobileMenuOpen()) {
                <svg lucideX class="w-6 h-6"></svg>
              } @else {
                <svg lucideMenu class="w-6 h-6"></svg>
              }
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-5 space-y-2">
          <a
            routerLink="/catalog"
            (click)="isMobileMenuOpen.set(false)"
            class="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Catalogue des Cours
          </a>
          <a
            routerLink="/leaderboard"
            (click)="isMobileMenuOpen.set(false)"
            class="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Classement & XP
          </a>
          <a
            routerLink="/donations"
            (click)="isMobileMenuOpen.set(false)"
            class="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Mur des Donateurs
          </a>

          @if (authService.isAuthenticated()) {
            <a
              routerLink="/profile"
              (click)="isMobileMenuOpen.set(false)"
              class="block px-3 py-2 rounded-lg text-base font-medium text-indigo-300 hover:bg-slate-800"
            >
              Mon Dashboard
            </a>
            @if (authService.isAdmin()) {
              <a
                routerLink="/admin"
                (click)="isMobileMenuOpen.set(false)"
                class="block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 hover:bg-slate-800"
              >
                Espace Admin
              </a>
            }
            <button
              type="button"
              (click)="logout()"
              class="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-slate-800"
            >
              Se déconnecter
            </button>
          } @else {
            <div class="pt-2 flex flex-col gap-2">
              <a
                routerLink="/login"
                (click)="isMobileMenuOpen.set(false)"
                class="text-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 bg-slate-800"
              >
                Se connecter
              </a>
              <a
                routerLink="/register"
                (click)="isMobileMenuOpen.set(false)"
                class="text-center w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                Rejoindre gratuitement
              </a>
            </div>
          }
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  readonly authService = inject(AuthService);

  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isUserMenuOpen = signal<boolean>(false);

  userInitial(): string {
    const user = this.authService.currentUser();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  }

  logout(): void {
    this.isUserMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
    this.authService.logout();
  }
}
