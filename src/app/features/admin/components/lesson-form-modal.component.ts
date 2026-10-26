import { Component, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminCategory,
  AdminLesson,
  CreateLessonDto,
  UpdateLessonDto,
  Difficulty,
  slugify,
} from '../../../core/models/admin.model';
import { MarkdownViewerComponent } from '../../../shared/components/markdown-viewer/markdown-viewer.component';
import {
  LucideBookOpen,
  LucideX,
  LucideCheck,
  LucideSparkles,
  LucideEye,
  LucidePencil,
} from '@lucide/angular';

@Component({
  selector: 'app-lesson-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    MarkdownViewerComponent,
    LucideBookOpen,
    LucideX,
    LucideCheck,
    LucideSparkles,
    LucideEye,
    LucidePencil,
  ],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        class="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[92vh] flex flex-col"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <svg lucideBookOpen class="w-6 h-6"></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">
                {{ isEditMode() ? 'Modifier la leçon' : 'Créer une nouvelle leçon' }}
              </h3>
              <p class="text-xs text-slate-400">
                Rédigez le contenu pédagogique et associez-le à une catégorie
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

        <!-- Form Body with Scroll -->
        <form (ngSubmit)="onSubmit()" class="space-y-5 overflow-y-auto pr-1 flex-1">
          <!-- Title & Slug -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Titre de la leçon <span class="text-rose-400">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="title"
                name="title"
                (ngModelChange)="onTitleChange($event)"
                placeholder="ex: Les Décorateurs NestJS"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
                  class="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                >
                  <svg lucideSparkles class="w-3 h-3"></svg>
                  <span>Auto-générer</span>
                </button>
              </div>
              <input
                type="text"
                [(ngModel)]="slug"
                name="slug"
                placeholder="ex: les-decorateurs-nestjs"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- Category, Difficulty & Order -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Catégorie parente <span class="text-rose-400">*</span>
              </label>
              <select
                [(ngModel)]="categoryId"
                name="categoryId"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="" disabled>Sélectionner une catégorie</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Difficulté <span class="text-rose-400">*</span>
              </label>
              <select
                [(ngModel)]="difficulty"
                name="difficulty"
                required
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="NOVICE">Novice (Débutant)</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="SENIOR">Senior (Avancé)</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Ordre dans la catégorie
              </label>
              <input
                type="number"
                [(ngModel)]="orderIndex"
                name="orderIndex"
                min="0"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- Description & Published switch -->
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div class="space-y-0.5">
                <span class="text-sm font-semibold text-white">Statut de publication</span>
                <p class="text-xs text-slate-400">
                  Si désactivé, la leçon restera en brouillon visible uniquement par les admins.
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="isPublished"
                  name="isPublished"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-300">
                Courte description (résumé)
              </label>
              <input
                type="text"
                [(ngModel)]="description"
                name="description"
                placeholder="ex: Découvrez le fonctionnement interne des décorateurs et du métaprogramming..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- Content Markdown (Editor & Live Preview) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-300">
                Contenu pédagogique (Markdown) <span class="text-rose-400">*</span>
              </label>
              <!-- Tab toggle -->
              <div class="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
                <button
                  type="button"
                  (click)="editorTab = 'edit'"
                  class="px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5"
                  [class.bg-emerald-600]="editorTab === 'edit'"
                  [class.text-white]="editorTab === 'edit'"
                  [class.text-slate-400]="editorTab !== 'edit'"
                >
                  <svg lucidePencil class="w-3.5 h-3.5"></svg>
                  <span>Édition</span>
                </button>
                <button
                  type="button"
                  (click)="editorTab = 'preview'"
                  class="px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5"
                  [class.bg-emerald-600]="editorTab === 'preview'"
                  [class.text-white]="editorTab === 'preview'"
                  [class.text-slate-400]="editorTab !== 'preview'"
                >
                  <svg lucideEye class="w-3.5 h-3.5"></svg>
                  <span>Aperçu en direct</span>
                </button>
              </div>
            </div>

            @if (editorTab === 'edit') {
              <div class="space-y-1.5">
                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span>Insérer :</span>
                  <button
                    type="button"
                    (click)="insertTemplate('code')"
                    class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:text-white"
                  >
                    Bloc Code
                  </button>
                  <button
                    type="button"
                    (click)="insertTemplate('callout')"
                    class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:text-white"
                  >
                    Encadré Astuce
                  </button>
                </div>
                <textarea
                  [(ngModel)]="contentMarkdown"
                  name="contentMarkdown"
                  rows="12"
                  placeholder="Rédigez le cours en Markdown ici..."
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700 text-slate-200 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                ></textarea>
              </div>
            } @else {
              <div class="p-5 rounded-xl bg-slate-950/60 border border-slate-800 min-h-[300px] max-h-[400px] overflow-y-auto">
                @if (contentMarkdown.trim()) {
                  <app-markdown-viewer [content]="contentMarkdown"></app-markdown-viewer>
                } @else {
                  <p class="text-sm text-slate-500 italic">Rien à afficher. Tapez du contenu dans l'onglet Édition.</p>
                }
              </div>
            }
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
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
              class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSaving()) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              } @else {
                <svg lucideCheck class="w-4 h-4"></svg>
                <span>{{ isEditMode() ? 'Mettre à jour' : 'Créer la leçon' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LessonFormModalComponent implements OnInit {
  readonly lesson = input<AdminLesson | null>(null);
  readonly categories = input<AdminCategory[]>([]);
  readonly isSaving = input<boolean>(false);

  readonly save = output<{ id?: string; dto: CreateLessonDto | UpdateLessonDto }>();
  readonly close = output<void>();

  title = '';
  slug = '';
  categoryId = '';
  difficulty: Difficulty = 'NOVICE';
  orderIndex = 0;
  isPublished = true;
  description = '';
  contentMarkdown = '';
  editorTab: 'edit' | 'preview' = 'edit';

  isEditMode(): boolean {
    return !!this.lesson();
  }

  ngOnInit(): void {
    const l = this.lesson();
    if (l) {
      this.title = l.title || '';
      this.slug = l.slug || '';
      this.categoryId = l.categoryId || l.category?.id || '';
      this.difficulty = l.difficulty || 'NOVICE';
      this.orderIndex = l.orderIndex ?? 0;
      this.isPublished = l.isPublished ?? true;
      this.description = l.description || '';
      this.contentMarkdown = l.contentMarkdown || '';
    } else {
      // Default category if categories provided
      const cats = this.categories();
      if (cats.length > 0 && !this.categoryId) {
        this.categoryId = cats[0].id;
      }
    }
  }

  onTitleChange(newTitle: string): void {
    if (!this.isEditMode() && (!this.slug || this.slug === slugify(this.title.slice(0, -1)))) {
      this.slug = slugify(newTitle);
    }
  }

  generateSlug(): void {
    if (this.title) {
      this.slug = slugify(this.title);
    }
  }

  insertTemplate(type: 'code' | 'callout'): void {
    if (type === 'code') {
      this.contentMarkdown += '\n\n```typescript\n// Exemple de code\nexport function example() {\n  return true;\n}\n```\n';
    } else if (type === 'callout') {
      this.contentMarkdown += '\n\n> 💡 **Conseil Pro** :\n> Expliquez ici une bonne pratique essentielle.\n';
    }
  }

  isValid(): boolean {
    return (
      !!this.title.trim() &&
      !!this.slug.trim() &&
      !!this.categoryId &&
      !!this.contentMarkdown.trim()
    );
  }

  onSubmit(): void {
    if (!this.isValid()) return;

    const dto: CreateLessonDto = {
      title: this.title.trim(),
      slug: this.slug.trim().toLowerCase(),
      categoryId: this.categoryId,
      difficulty: this.difficulty,
      orderIndex: Number(this.orderIndex) || 0,
      isPublished: this.isPublished,
      description: this.description.trim() || undefined,
      contentMarkdown: this.contentMarkdown.trim(),
    };

    this.save.emit({
      id: this.lesson()?.id,
      dto,
    });
  }
}
