import { Component, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminCategory,
  AdminTag,
  CreateCategoryDto,
  UpdateCategoryDto,
  slugify,
} from '../../../core/models/admin.model';
import { LucideLayers, LucideX, LucideCheck, LucideSparkles } from '@lucide/angular';

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [FormsModule, LucideLayers, LucideX, LucideCheck, LucideSparkles],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <svg lucideLayers class="w-6 h-6"></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">
                {{ isEditMode() ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie' }}
              </h3>
              <p class="text-xs text-slate-400">
                Configurez les métadonnées et tags associés au catalogue
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Nom de la catégorie <span class="text-rose-400">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                (ngModelChange)="onNameChange($event)"
                placeholder="ex: Docker & Conteneurs"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                  class="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <svg lucideSparkles class="w-3 h-3"></svg>
                  <span>Auto-générer</span>
                </button>
              </div>
              <input
                type="text"
                [(ngModel)]="slug"
                name="slug"
                placeholder="ex: docker"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-300">
              Description pédagogique
            </label>
            <textarea
              [(ngModel)]="description"
              name="description"
              rows="3"
              placeholder="Décrivez les objectifs et compétences clés abordées dans ce parcours..."
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            ></textarea>
          </div>

          <!-- Icon & OrderIndex -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Icône (identifiant Iconify ou SVG)
              </label>
              <input
                type="text"
                [(ngModel)]="icon"
                name="icon"
                placeholder="ex: logos:docker-icon"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <!-- Quick presets -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                @for (preset of iconPresets; track preset.id) {
                  <button
                    type="button"
                    (click)="icon = preset.id"
                    class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 transition-colors"
                  >
                    {{ preset.label }}
                  </button>
                }
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Ordre d'affichage
              </label>
              <input
                type="number"
                [(ngModel)]="orderIndex"
                name="orderIndex"
                min="0"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <span class="text-[11px] text-slate-500">
                Un ordre faible apparaît en premier dans le catalogue.
              </span>
            </div>
          </div>

          <!-- Associated Tags -->
          <div class="space-y-2 pt-2">
            <label class="block text-xs font-semibold text-slate-300">
              Tags techniques associés
            </label>
            @if (availableTags().length === 0) {
              <p class="text-xs text-slate-500 italic">Aucun tag technique disponible actuellement.</p>
            } @else {
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-950/40 border border-slate-800">
                @for (tag of availableTags(); track tag.id) {
                  <label class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs transition-colors">
                    <input
                      type="checkbox"
                      [checked]="selectedTagIds.has(tag.id)"
                      (change)="toggleTag(tag.id)"
                      class="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                    />
                    <span class="text-slate-300 font-medium">{{ tag.name }}</span>
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
              class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSaving()) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              } @else {
                <svg lucideCheck class="w-4 h-4"></svg>
                <span>{{ isEditMode() ? 'Mettre à jour' : 'Créer la catégorie' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class CategoryFormModalComponent implements OnInit {
  readonly category = input<AdminCategory | null>(null);
  readonly availableTags = input<AdminTag[]>([]);
  readonly isSaving = input<boolean>(false);

  readonly save = output<{ id?: string; dto: CreateCategoryDto | UpdateCategoryDto }>();
  readonly close = output<void>();

  name = '';
  slug = '';
  description = '';
  icon = '';
  orderIndex = 0;
  selectedTagIds = new Set<string>();

  readonly iconPresets = [
    { id: 'logos:javascript', label: 'JavaScript' },
    { id: 'logos:typescript-icon', label: 'TypeScript' },
    { id: 'logos:react', label: 'React' },
    { id: 'logos:nestjs', label: 'NestJS' },
    { id: 'logos:nextjs-icon', label: 'Next.js' },
    { id: 'logos:angular', label: 'Angular' },
    { id: 'logos:docker-icon', label: 'Docker' },
    { id: 'logos:git-icon', label: 'Git' },
  ];

  isEditMode(): boolean {
    return !!this.category();
  }

  ngOnInit(): void {
    const cat = this.category();
    if (cat) {
      this.name = cat.name || '';
      this.slug = cat.slug || '';
      this.description = cat.description || '';
      this.icon = cat.icon || '';
      this.orderIndex = cat.orderIndex ?? 0;
      if (cat.tags && Array.isArray(cat.tags)) {
        this.selectedTagIds = new Set(cat.tags.map((t) => t.id));
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

  toggleTag(tagId: string): void {
    if (this.selectedTagIds.has(tagId)) {
      this.selectedTagIds.delete(tagId);
    } else {
      this.selectedTagIds.add(tagId);
    }
  }

  isValid(): boolean {
    return !!this.name.trim() && !!this.slug.trim();
  }

  onSubmit(): void {
    if (!this.isValid()) return;

    const dto: CreateCategoryDto = {
      name: this.name.trim(),
      slug: this.slug.trim().toLowerCase(),
      description: this.description.trim(),
      icon: this.icon.trim() || undefined,
      orderIndex: Number(this.orderIndex) || 0,
      tagIds: Array.from(this.selectedTagIds),
    };

    this.save.emit({
      id: this.category()?.id,
      dto,
    });
  }
}
