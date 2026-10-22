import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCode2, LucideHeart, LucideCoffee } from '@lucide/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideCode2, LucideHeart, LucideCoffee],
  template: `
    <footer class="border-t border-slate-800 bg-slate-950/60 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <!-- Brand Column -->
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <svg lucideCode2 class="w-4 h-4"></svg>
              </div>
              <span class="font-extrabold text-lg text-white">
                LevelUp<span class="text-indigo-400">Code</span>
              </span>
            </div>
            <p class="text-slate-400 text-sm max-w-sm">
              La plateforme d'apprentissage 100% pratique pour les développeurs modernes. Progressez avec des leçons interactives, validez vos connaissances par des quiz anti-triche et gagnez de l'XP au quotidien.
            </p>
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <span>Fait avec</span>
              <svg lucideHeart class="w-3.5 h-3.5 text-rose-500 fill-rose-500"></svg>
              <span>pour la communauté dev.</span>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-3">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300">Plateforme</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li><a routerLink="/catalog" class="hover:text-white transition-colors">Catalogue des Cours</a></li>
              <li><a routerLink="/leaderboard" class="hover:text-white transition-colors">Classement Général</a></li>
              <li><a routerLink="/donations" class="hover:text-white transition-colors">Mur des Donateurs</a></li>
            </ul>
          </div>

          <!-- Community & Support -->
          <div class="space-y-3">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300">Soutenir le Projet</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              LevelUpCode est entièrement gratuit. Soutenez les coûts d'infrastructure et le contenu pédagogique :
            </p>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-105"
            >
              <svg lucideCoffee class="w-4 h-4 text-amber-400"></svg>
              <span>Buy Me a Coffee</span>
            </a>
          </div>

        </div>

        <div class="border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 LevelUpCode. Tous droits réservés.</p>
          <p class="mt-2 sm:mt-0">Architecture moderne avec Angular 19+ et NestJS.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
