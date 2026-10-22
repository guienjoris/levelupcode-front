import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../core/services/catalog.service';
import { Category } from '../../core/models/category.model';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { LucideSearch, LucideBookOpen } from '@lucide/angular';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, CategoryCardComponent, LucideSearch, LucideBookOpen],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Header -->
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <svg lucideBookOpen class="w-3.5 h-3.5"></svg>
          <span>Catalogue Pédagogique Officiel</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explorez nos Catégories
        </h1>
        <p class="text-slate-400 max-w-2xl text-sm sm:text-base">
          Choisissez une technologie pour débuter votre entraînement. L'accès au contenu des leçons et aux quiz requiert une inscription gratuite.
        </p>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        <!-- Search bar -->
        <div class="relative w-full sm:max-w-md">
          <svg lucideSearch class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Rechercher une techno (NestJS, Docker, React...)"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-200 placeholder-slate-400 transition-all"
          />
        </div>

        <!-- Tag Filters -->
        @if (allTags().length > 0) {
          <div class="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              (click)="selectedTag.set(null)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              [class.bg-indigo-600]="selectedTag() === null"
              [class.text-white]="selectedTag() === null"
              [class.bg-slate-800\/60]="selectedTag() !== null"
              [class.text-slate-400]="selectedTag() !== null"
              [class.hover:bg-slate-800]="selectedTag() !== null"
            >
              Tous
            </button>
            @for (tag of allTags(); track tag) {
              <button
                type="button"
                (click)="selectedTag.set(tag)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                [class.bg-indigo-600]="selectedTag() === tag"
                [class.text-white]="selectedTag() === tag"
                [class.bg-slate-800\/60]="selectedTag() !== tag"
                [class.text-slate-400]="selectedTag() !== tag"
                [class.hover:bg-slate-800]="selectedTag() !== tag"
              >
                {{ tag }}
              </button>
            }
          </div>
        }

      </div>

      <!-- Categories Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="h-64 rounded-2xl bg-slate-800/40 border border-slate-800 animate-pulse"></div>
          }
        </div>
      } @else if (filteredCategories().length === 0) {
        <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 space-y-3">
          <p class="text-slate-400 text-base">Aucune catégorie ne correspond à votre recherche.</p>
          <button
            type="button"
            (click)="resetFilters()"
            class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (category of filteredCategories(); track category.id) {
            <app-category-card [category]="category"></app-category-card>
          }
        </div>
      }

    </div>
  `,
})
export class CatalogComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly searchQuery = signal<string>('');
  readonly selectedTag = signal<string | null>(null);

  readonly allTags = computed(() => {
    const set = new Set<string>();
    this.categories().forEach((cat) => {
      cat.tags?.forEach((t) => set.add(t.name));
    });
    return Array.from(set).sort();
  });

  readonly filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tag = this.selectedTag();

    return this.categories().filter((cat) => {
      const matchesSearch =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q);

      const matchesTag = !tag || cat.tags?.some((t) => t.name === tag);

      return matchesSearch && matchesTag;
    });
  });

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

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedTag.set(null);
  }
}
