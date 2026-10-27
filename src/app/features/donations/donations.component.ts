import { Component, inject, signal, OnInit } from '@angular/core';
import { DonationService } from '../../core/services/donation.service';
import { Supporter } from '../../core/models/donation.model';
import { DatePipe } from '@angular/common';
import {
  LucideCoffee,
  LucideHeart,
  LucideSparkles,
  LucideCalendar,
  LucideCheck,
  LucideExternalLink,
} from '@lucide/angular';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [
    DatePipe,
    LucideCoffee,
    LucideHeart,
    LucideSparkles,
    LucideCalendar,
    LucideCheck,
    LucideExternalLink,
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <!-- Hero Banner -->
      <div class="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-800/80 to-slate-900 border border-amber-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
          <svg lucideCoffee class="w-8 h-8"></svg>
        </div>

        <div class="space-y-3 max-w-2xl mx-auto">
          <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Soutenez LevelUp<span class="text-amber-400">Code</span>
          </h1>
          <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
            Notre plateforme est 100% gratuite et sans publicité intrusive. Vos dons permettent de financer l'hébergement serveur, la bande passante et la création continue de nouveaux contenus.
          </p>
        </div>

        <div class="pt-2">
          <a
            href="https://buymeacoffee.com/guienjorisi"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
          >
            <svg lucideCoffee class="w-5 h-5 text-slate-950"></svg>
            <span>Offrir un café sur Buy Me a Coffee</span>
            <svg lucideExternalLink class="w-4 h-4"></svg>
          </a>
        </div>
      </div>

      <!-- Perks Card -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <svg lucideSparkles class="w-5 h-5"></svg>
          </div>
          <h3 class="text-base font-bold text-white">Badge ☕ Supporter Exclusif</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Un badge doré permanent s'affiche fièrement à côté de votre pseudo sur votre profil, vos cartes et dans le classement général.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <svg lucideHeart class="w-5 h-5"></svg>
          </div>
          <h3 class="text-base font-bold text-white">Mur des Donateurs</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Votre prénom et votre message d'encouragement sont immortalisés sur le mur officiel ci-dessous.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <svg lucideCheck class="w-5 h-5"></svg>
          </div>
          <h3 class="text-base font-bold text-white">Indépendance & Gratuité</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Vous permettez à des milliers de développeurs de continuer à se former gratuitement sans modèle freemium restrictif.
          </p>
        </div>
      </div>

      <!-- Supporters Wall Section -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <svg lucideHeart class="w-5 h-5 text-rose-500"></svg>
            <span>Mur des Soutiens Récents</span>
          </h2>
          <span class="text-xs font-semibold text-slate-400">
            Dernières contributions
          </span>
        </div>

        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="h-28 rounded-2xl bg-slate-800/40 border border-slate-800 animate-pulse"></div>
            }
          </div>
        } @else if (supporters().length === 0) {
          <div class="p-12 rounded-2xl bg-slate-800/20 border border-slate-800 text-center space-y-2">
            <p class="text-slate-400 text-sm">Le mur attend son premier supporter !</p>
            <p class="text-xs text-slate-500">Soyez le premier développeur à inscrire votre nom ici.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (sup of supporters(); track sup.createdAt) {
              <div class="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-amber-500/40 transition-all space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-sm flex items-center justify-center">
                      ☕
                    </div>
                    <div>
                      <h4 class="font-bold text-white text-sm">{{ sup.name }}</h4>
                      <span class="text-[10px] text-slate-500 flex items-center gap-1">
                        <svg lucideCalendar class="w-3 h-3"></svg>
                        {{ sup.createdAt | date: 'dd/MM/yyyy' }}
                      </span>
                    </div>
                  </div>

                  @if (sup.amount) {
                    <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-xs font-bold">
                      {{ sup.amount }} €
                    </span>
                  }
                </div>

                @if (sup.message) {
                  <p class="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{{ sup.message }}"
                  </p>
                }
              </div>
            }
          </div>
        }
      </div>

    </div>
  `,
})
export class DonationsComponent implements OnInit {
  private readonly donationService = inject(DonationService);

  readonly supporters = signal<Supporter[]>([]);
  readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.donationService.getSupporters(20).subscribe({
      next: (data) => {
        this.supporters.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
