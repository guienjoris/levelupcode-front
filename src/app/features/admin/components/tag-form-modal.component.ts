import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminCategory,
  AdminTag,
  CreateTagDto,
  UpdateTagDto,
  slugify,
} from '../../../core/models/admin.model';
import { LucideTag, LucideX, LucideCheck, LucideSparkles } from '@lucide/angular';

@Component({
  selector: 'app-tag-form-modal',
  standalone: true,
  imports: [FormsModule, LucideTag, LucideX, LucideCheck, LucideSparkles],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        class="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <svg lucideTag class="w-6 h-6"></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">
                {{ isEditMode() ? 'Modifier le tag technique' : 'Nouveau tag technique' }}
              </h3>
              <p class="text-xs text-slate-400">
                Gérez les mots-clés transversaux pour filtrer les parcours
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg lucideX class="w-5 h-5"></svg>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Name & Slug -->
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Nom du tag <span class="text-rose-400">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                (ngModelChange)="onNameChange($event)"
                placeholder="ex: DevOps ou Front-End"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-slate-300">
                  Slug URL <span class="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  (click)="generateSlug()"
                  class="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <svg lucideSparkles class="w-3 h-3"></svg>
                  <span>Auto-générer</span>
                </button>
              </div>
              <input
                type="text"
                [(ngModel)]="slug"
                name="slug"
                placeholder="ex: devops ou front-end"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <!-- Associated Categories -->
          <div class="space-y-2 pt-2">
            <label class="block text-xs font-semibold text-slate-300">
              Associer aux catégories
            </label>
            @if (availableCategories().length === 0) {
              <p class="text-xs text-slate-500 italic">Aucune catégorie disponible.</p>
            } @else {
              <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-slate-950/40 border border-slate-800">
                @for (cat of availableCategories(); track cat.id) {
                  <label class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs transition-colors">
                    <input
                      type="checkbox"
                      [checked]="selectedCategoryIds.has(cat.id)"
                      (change)="toggleCategory(cat.id)"
                      class="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500 bg-slate-800"
                    />
                    <span class="text-slate-300 font-medium truncate">{{ cat.name }}</span>
                  </label>
                }
              </div>
            }
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              (click)="close.emit()"
              [disabled]="isSaving()"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="!isValid() || isSaving()"
              class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSaving()) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              } @else {
                <svg lucideCheck class="w-4 h-4"></svg>
                <span>{{ isEditMode() ? 'Mettre à jour' : 'Créer le tag' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class TagFormModalComponent implements OnInit {
  readonly tag = input<AdminTag | null>(null);
  readonly availableCategories = input<AdminCategory[]>([]);
  readonly isSaving = input<boolean>(false);

  readonly save = output<{ id?: string; dto: CreateTagDto | UpdateTagDto }>();
  readonly close = output<void>();

  name = '';
  slug = '';
  selectedCategoryIds = new Set<string>();

  isEditMode(): boolean {
    return !!this.tag();
  }

  ngOnInit(): void {
    const t = this.tag();
    if (t) {
      this.name = t.name || '';
      this.slug = t.slug || '';
      if (t.categories && Array.isArray(t.categories)) {
        this.selectedCategoryIds = new Set(t.categories.map((c) => c.id));
      }
    }
  }

  onNameChange(newName: string): void {
    if (!this.isEditMode() && (!this.slug || this.slug === slugify(this.name.slice(0, -1)))) {
      this.slug = slugify(newName);
    }
  }

  generateSlug(): void {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }

  toggleCategory(catId: string): void {
    if (this.selectedCategoryIds.has(catId)) {
      this.selectedCategoryIds.delete(catId);
    } else {
      this.selectedCategoryIds.add(catId);
    }
  }

  isValid(): boolean {
    return !!this.name.trim() && !!this.slug.trim();
  }

  onSubmit(): void {
    if (!this.isValid()) return;

    const dto: CreateTagDto = {
      name: this.name.trim(),
      slug: this.slug.trim().toLowerCase(),
      categoryIds: Array.from(this.selectedCategoryIds),
    };

    this.save.emit({
      id: this.tag()?.id,
      dto,
    });
  }
}
