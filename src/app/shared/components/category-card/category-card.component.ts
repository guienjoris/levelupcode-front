import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { LucideCode2, LucideArrowRight, LucideBookOpen, LucideHelpCircle } from '@lucide/angular';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [RouterLink, LucideCode2, LucideArrowRight, LucideBookOpen, LucideHelpCircle],
  template: `
    <a
      [routerLink]="['/catalog', category().slug]"
      class="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div>
        <!-- Top header: Icon & Order -->
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-slate-900/80 border border-slate-700/80 p-2.5 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
            @if (!imageFailed()) {
              <img
                [src]="iconUrl()"
                [alt]="category().name"
                (error)="onImageError()"
                class="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all"
              />
            } @else {
              <svg lucideCode2 class="w-7 h-7 text-indigo-400"></svg>
            }
          </div>

          @if (category().orderIndex) {
            <span class="text-xs font-mono font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800">
              #{{ category().orderIndex }}
            </span>
          }
        </div>

        <!-- Name & Description -->
        <h3 class="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
          {{ category().name }}
        </h3>
        <p class="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
          {{ category().description }}
        </p>

        <!-- Tags -->
        @if (category().tags && category().tags!.length > 0) {
          <div class="flex flex-wrap gap-1.5 mb-5">
            @for (tag of category().tags; track tag.id) {
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900/70 text-slate-300 border border-slate-700/50">
                {{ tag.name }}
              </span>
            }
          </div>
        }
      </div>

      <!-- Footer: Metrics & CTA -->
      <div class="pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1" title="Nombre de leçons">
            <svg lucideBookOpen class="w-3.5 h-3.5 text-indigo-400"></svg>
            {{ category().lessonsCount ?? 0 }} leçons
          </span>
          <span class="flex items-center gap-1" title="Nombre de quiz">
            <svg lucideHelpCircle class="w-3.5 h-3.5 text-purple-400"></svg>
            {{ category().quizzesCount ?? 0 }} quiz
          </span>
        </div>

        <span class="inline-flex items-center gap-1 font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all">
          Découvrir
          <svg lucideArrowRight class="w-3.5 h-3.5"></svg>
        </span>
      </div>
    </a>
  `,
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  readonly imageFailed = signal<boolean>(false);
  readonly useCdnFallback = signal<boolean>(false);
  iconUrl(): string {
    const cat = this.category();
    if (this.useCdnFallback() && cat.icon) {
      const pathPart = cat.icon.includes(':') ? cat.icon.replace(':', '/') : cat.icon;
      return `https://api.iconify.design/${pathPart}.svg`;
    }
    return `/icons/${cat.slug}.svg`;
  }
  onImageError(): void {
    const cat = this.category();
    if (!this.useCdnFallback() && cat.icon) {
      // 1er échec : on tente le CDN officiel Iconify
      this.useCdnFallback.set(true);
    } else {
      // 2e échec : fallback sur l'icône SVG lucideCode2
      this.imageFailed.set(true);
    }
  }
}
