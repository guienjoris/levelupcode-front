import { Component, input, output, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminCategory,
  AdminLesson,
  AdminQuiz,
  AdminQuizDetail,
  AdminQuizQuestion,
  CreateQuizDto,
  UpdateQuizDto,
  CreateAdminQuestionDto,
  CreateAdminAnswerDto,
  Difficulty,
} from '../../../core/models/admin.model';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  LucideHelpCircle,
  LucideX,
  LucideCheck,
  LucidePlus,
  LucideTrash2,
  LucideCheckCircle2,
  LucideCode,
  LucideLayers,
} from '@lucide/angular';

interface FormAnswer {
  text: string;
  isCorrect: boolean;
  orderIndex: number;
}

interface FormQuestion {
  title: string;
  codeSnippet: string;
  explanation: string;
  orderIndex: number;
  answers: FormAnswer[];
}

@Component({
  selector: 'app-quiz-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    LucideHelpCircle,
    LucideX,
    LucideCheck,
    LucidePlus,
    LucideTrash2,
    LucideCheckCircle2,
    LucideCode,
    LucideLayers,
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
            <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <svg lucideHelpCircle class="w-6 h-6"></svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">
                {{ isEditMode() ? 'Gérer le Quiz' : 'Créer un nouveau Quiz' }}
              </h3>
              <p class="text-xs text-slate-400">
                Configurez le quiz d'évaluation, ses questions et propositions de réponses
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

        <!-- Form Scrollable Container -->
        <div class="space-y-6 overflow-y-auto pr-1 flex-1">
          <!-- Quiz Metadata Section -->
          <div class="space-y-4 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80">
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <svg lucideLayers class="w-4 h-4 text-purple-400"></svg>
              <span>Paramètres du Quiz</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Title -->
              <div class="space-y-1.5 sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-300">
                  Titre du quiz <span class="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="title"
                  placeholder="ex: Quiz : Les fondamentaux des Modules NestJS"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <!-- Category -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-300">
                  Catégorie parente <span class="text-rose-400">*</span>
                </label>
                <select
                  [(ngModel)]="categoryId"
                  (ngModelChange)="onCategoryChange()"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="" disabled>Sélectionner une catégorie</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>

              <!-- Associated Lesson (Optional) -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-semibold text-slate-300">
                    Leçon associée (optionnel)
                  </label>
                  <button
                    type="button"
                    (click)="showAllLessons.set(!showAllLessons())"
                    class="text-[11px] text-purple-400 hover:text-purple-300 underline font-medium transition-colors"
                  >
                    {{ showAllLessons() ? 'Filtrer par catégorie' : 'Afficher toutes les leçons (' + allLessons().length + ')' }}
                  </button>
                </div>
                <select
                  [ngModel]="lessonId"
                  (ngModelChange)="onLessonChange($event)"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option [value]="''">
                    {{ filteredLessons().length > 0 ? 'Aucune leçon spécifique (Quiz de catégorie général)' : 'Quiz sans leçon rattachée' }}
                  </option>
                  @for (lesson of filteredLessons(); track lesson.id) {
                    <option [value]="lesson.id">
                      {{ (showAllLessons() || !categoryId) ? '[' + (lesson.categoryName || lesson.category?.name || getCategoryName(lesson.categoryId)) + '] ' : '' }}{{ lesson.title }} ({{ lesson.difficulty }})
                    </option>
                  }
                </select>

                @if (isLoadingLessons()) {
                  <p class="text-[11px] text-purple-400 animate-pulse flex items-center gap-1">
                    Chargement des leçons disponibles...
                  </p>
                } @else if (filteredLessons().length === 0 && !showAllLessons()) {
                  <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                    <p class="font-medium">
                      ⚠️ Aucune leçon enregistrée dans la catégorie "{{ getCategoryName() }}".
                    </p>
                    <p class="text-slate-400 text-[11px]">
                      Vous pouvez créer un quiz général pour cette catégorie, ou
                      <button
                        type="button"
                        (click)="showAllLessons.set(true)"
                        class="text-purple-300 hover:text-white underline font-semibold ml-0.5"
                      >
                        afficher les {{ allLessons().length }} leçons d'autres catégories
                      </button>.
                    </p>
                  </div>
                } @else if (filteredLessons().length > 0) {
                  <p class="text-[11px] text-slate-400">
                    {{ filteredLessons().length }} leçon(s) disponible(s) {{ showAllLessons() ? 'au total' : 'dans cette catégorie' }}.
                  </p>
                }
              </div>

              <!-- Difficulty & Order -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-300">
                  Niveau de difficulté <span class="text-rose-400">*</span>
                </label>
                <select
                  [(ngModel)]="difficulty"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="NOVICE">Novice</option>
                  <option value="INTERMEDIAIRE">Intermédiaire</option>
                  <option value="SENIOR">Senior</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-slate-300">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  [(ngModel)]="orderIndex"
                  min="0"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <!-- Description -->
              <div class="space-y-1.5 sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-300">
                  Description pédagogique
                </label>
                <textarea
                  [(ngModel)]="description"
                  rows="2"
                  placeholder="Testez vos connaissances sur..."
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                ></textarea>
              </div>

              <!-- Publication switch -->
              <div class="sm:col-span-2 flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                <span class="text-xs font-semibold text-slate-300">Publié pour les utilisateurs</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="isPublished"
                    class="sr-only peer"
                  />
                  <div class="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Questions Section -->
          @if (!isEditMode()) {
            <!-- CREATE MODE: dynamic builder for initial questions -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-bold text-white flex items-center gap-2">
                    <svg lucideHelpCircle class="w-4 h-4 text-purple-400"></svg>
                    <span>Questions du Quiz ({{ questions.length }})</span>
                  </h4>
                  <p class="text-xs text-slate-400">
                    Au moins 1 question requise avec au minimum 2 réponses dont 1 correcte
                  </p>
                </div>
                <button
                  type="button"
                  (click)="addQuestion()"
                  class="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <svg lucidePlus class="w-3.5 h-3.5"></svg>
                  <span>Ajouter une question</span>
                </button>
              </div>

              @for (q of questions; track $index; let qIdx = $index) {
                <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4 relative">
                  <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <span class="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                      Question #{{ qIdx + 1 }}
                    </span>
                    @if (questions.length > 1) {
                      <button
                        type="button"
                        (click)="removeQuestion(qIdx)"
                        class="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Supprimer cette question"
                      >
                        <svg lucideTrash2 class="w-4 h-4"></svg>
                      </button>
                    }
                  </div>

                  <!-- Question Title -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-300">
                      Énoncé de la question <span class="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="q.title"
                      placeholder="ex: Quel décorateur est requis pour définir un module NestJS ?"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <!-- Code Snippet (Optional) -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <svg lucideCode class="w-3.5 h-3.5 text-slate-400"></svg>
                      <span>Extrait de code (optionnel)</span>
                    </label>
                    <textarea
                      [(ngModel)]="q.codeSnippet"
                      rows="2"
                      placeholder="@Module({})&#10;export class AppModule {}"
                      class="w-full px-3.5 py-2 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-700 focus:outline-none focus:border-purple-500"
                    ></textarea>
                  </div>

                  <!-- Explanation -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-300">
                      Explication pédagogique (affichée après correction)
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="q.explanation"
                      placeholder="ex: Le décorateur @Module() fournit les métadonnées que Nest utilise..."
                      class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <!-- Answers -->
                  <div class="space-y-2 pt-2 border-t border-slate-700/60">
                    <div class="flex items-center justify-between">
                      <label class="block text-xs font-semibold text-slate-300">
                        Propositions de réponses (cochez la bonne réponse)
                      </label>
                      <button
                        type="button"
                        (click)="addAnswer(q)"
                        class="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                      >
                        <svg lucidePlus class="w-3 h-3"></svg>
                        <span>Ajouter une réponse</span>
                      </button>
                    </div>

                    <div class="space-y-2">
                      @for (a of q.answers; track $index; let aIdx = $index) {
                        <div class="flex items-center gap-2">
                          <!-- Correct radio/checkbox -->
                          <button
                            type="button"
                            (click)="setCorrectAnswer(q, aIdx)"
                            class="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
                            [class.bg-emerald-500\/20]="a.isCorrect"
                            [class.text-emerald-300]="a.isCorrect"
                            [class.border-emerald-500\/40]="a.isCorrect"
                            [class.bg-slate-900]="!a.isCorrect"
                            [class.text-slate-400]="!a.isCorrect"
                            [class.border-slate-700]="!a.isCorrect"
                          >
                            @if (a.isCorrect) {
                              <svg lucideCheckCircle2 class="w-3.5 h-3.5 text-emerald-400"></svg>
                              <span>Correcte</span>
                            } @else {
                              <span>Incorrecte</span>
                            }
                          </button>

                          <!-- Text input -->
                          <input
                            type="text"
                            [(ngModel)]="a.text"
                            placeholder="Intitulé de la réponse"
                            class="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                          />

                          <!-- Remove answer -->
                          @if (q.answers.length > 2) {
                            <button
                              type="button"
                              (click)="removeAnswer(q, aIdx)"
                              class="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                              title="Retirer"
                            >
                              <svg lucideX class="w-3.5 h-3.5"></svg>
                            </button>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- EDIT MODE: Existing questions management & add question -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-bold text-white flex items-center gap-2">
                    <svg lucideHelpCircle class="w-4 h-4 text-purple-400"></svg>
                    <span>Questions existantes ({{ existingQuestions.length }})</span>
                  </h4>
                  <p class="text-xs text-slate-400">
                    Ajoutez ou supprimez des questions individuellement
                  </p>
                </div>
                <button
                  type="button"
                  (click)="showAddQuestionForm = !showAddQuestionForm"
                  class="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  @if (!showAddQuestionForm) {
                    <svg lucidePlus class="w-3.5 h-3.5"></svg>
                    <span>Ajouter une question</span>
                  } @else {
                    <svg lucideX class="w-3.5 h-3.5"></svg>
                    <span>Fermer</span>
                  }
                </button>
              </div>

              <!-- Inline Add Question Form -->
              @if (showAddQuestionForm) {
                <div class="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-4 animate-fade-in">
                  <h5 class="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Nouvelle Question pour ce Quiz
                  </h5>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-300">Énoncé *</label>
                    <input
                      type="text"
                      [(ngModel)]="newQuestion.title"
                      placeholder="Énoncé de la question..."
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-300">Code Snippet (optionnel)</label>
                    <textarea
                      [(ngModel)]="newQuestion.codeSnippet"
                      rows="2"
                      placeholder="Snippet..."
                      class="w-full px-3 py-1.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-700 focus:outline-none focus:border-purple-500"
                    ></textarea>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-300">Explication pédagogique</label>
                    <input
                      type="text"
                      [(ngModel)]="newQuestion.explanation"
                      placeholder="Explication..."
                      class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <!-- Answers builder for this new question -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-semibold text-slate-300">Réponses (min 2, 1 correcte)</span>
                      <button
                        type="button"
                        (click)="addAnswer(newQuestion)"
                        class="text-[11px] text-purple-400 hover:text-purple-300 font-medium"
                      >
                        + Ajouter une option
                      </button>
                    </div>

                    @for (ans of newQuestion.answers; track $index; let aIdx = $index) {
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          (click)="setCorrectAnswer(newQuestion, aIdx)"
                          class="px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all shrink-0"
                          [class.bg-emerald-500\/20]="ans.isCorrect"
                          [class.text-emerald-300]="ans.isCorrect"
                          [class.border-emerald-500\/40]="ans.isCorrect"
                          [class.bg-slate-900]="!ans.isCorrect"
                          [class.text-slate-400]="!ans.isCorrect"
                          [class.border-slate-700]="!ans.isCorrect"
                        >
                          {{ ans.isCorrect ? '✓ Correcte' : 'Incorrecte' }}
                        </button>
                        <input
                          type="text"
                          [(ngModel)]="ans.text"
                          placeholder="Intitulé de la réponse"
                          class="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                        @if (newQuestion.answers.length > 2) {
                          <button
                            type="button"
                            (click)="removeAnswer(newQuestion, aIdx)"
                            class="text-slate-400 hover:text-rose-400 p-1"
                          >
                            <svg lucideX class="w-3.5 h-3.5"></svg>
                          </button>
                        }
                      </div>
                    }
                  </div>

                  <div class="flex justify-end pt-2">
                    <button
                      type="button"
                      (click)="saveNewQuestionDirectly()"
                      [disabled]="isSavingQuestion || !isNewQuestionValid()"
                      class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      @if (isSavingQuestion) {
                        <div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Enregistrement...</span>
                      } @else {
                        <svg lucidePlus class="w-3.5 h-3.5"></svg>
                        <span>Sauvegarder la question</span>
                      }
                    </button>
                  </div>
                </div>
              }

              <!-- List of existing questions -->
              @if (isLoadingQuestions) {
                <div class="py-6 text-center text-xs text-slate-400 animate-pulse">
                  Chargement des questions du quiz...
                </div>
              } @else if (existingQuestions.length === 0) {
                <div class="p-6 text-center rounded-xl bg-slate-800/20 border border-slate-800 text-slate-400 text-xs">
                  Aucune question enregistrée pour ce quiz.
                </div>
              } @else {
                <div class="space-y-3">
                  @for (q of existingQuestions; track q.id; let qIdx = $index) {
                    <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
                      <div class="flex items-start justify-between gap-3">
                        <div class="space-y-1">
                          <span class="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                            Question {{ qIdx + 1 }}
                          </span>
                          <p class="text-sm font-semibold text-white">{{ q.title }}</p>
                        </div>
                        <button
                          type="button"
                          (click)="deleteQuestionDirectly(q.id)"
                          class="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
                          title="Supprimer la question"
                        >
                          <svg lucideTrash2 class="w-4 h-4"></svg>
                        </button>
                      </div>

                      @if (q.codeSnippet) {
                        <pre class="p-2.5 rounded-lg bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">{{ q.codeSnippet }}</pre>
                      }

                      <!-- Answers -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        @for (ans of q.answers; track ans.id || $index) {
                          <div
                            class="px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 border"
                            [class.bg-emerald-500\/10]="ans.isCorrect"
                            [class.border-emerald-500\/30]="ans.isCorrect"
                            [class.text-emerald-300]="ans.isCorrect"
                            [class.bg-slate-900\/50]="!ans.isCorrect"
                            [class.border-slate-800]="!ans.isCorrect"
                            [class.text-slate-400]="!ans.isCorrect"
                          >
                            @if (ans.isCorrect) {
                              <svg lucideCheckCircle2 class="w-3.5 h-3.5 text-emerald-400 shrink-0"></svg>
                            } @else {
                              <div class="w-2 h-2 rounded-full bg-slate-600 shrink-0"></div>
                            }
                            <span class="truncate">{{ ans.text }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
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
            type="button"
            (click)="onSubmit()"
            [disabled]="!isValid() || isSaving()"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isSaving()) {
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Enregistrement...</span>
            } @else {
              <svg lucideCheck class="w-4 h-4"></svg>
              <span>{{ isEditMode() ? 'Mettre à jour le quiz' : 'Créer le quiz' }}</span>
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class QuizFormModalComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  readonly quiz = input<AdminQuiz | null>(null);
  readonly categories = input<AdminCategory[]>([]);
  readonly lessons = input<AdminLesson[]>([]);
  readonly isSaving = input<boolean>(false);

  readonly save = output<{ id?: string; dto: CreateQuizDto | UpdateQuizDto }>();
  readonly close = output<void>();

  // Quiz Metadata
  title = '';
  description = '';
  categoryId = '';
  lessonId = '';
  difficulty: Difficulty = 'NOVICE';
  orderIndex = 0;
  isPublished = true;

  // Create Mode Questions builder
  questions: FormQuestion[] = [
    {
      title: '',
      codeSnippet: '',
      explanation: '',
      orderIndex: 0,
      answers: [
        { text: '', isCorrect: true, orderIndex: 0 },
        { text: '', isCorrect: false, orderIndex: 1 },
      ],
    },
  ];

  // Edit Mode Questions state
  existingQuestions: AdminQuizQuestion[] = [];
  isLoadingQuestions = false;
  showAddQuestionForm = false;
  isSavingQuestion = false;

  newQuestion: FormQuestion = {
    title: '',
    codeSnippet: '',
    explanation: '',
    orderIndex: 0,
    answers: [
      { text: '', isCorrect: true, orderIndex: 0 },
      { text: '', isCorrect: false, orderIndex: 1 },
    ],
  };

  readonly allLessons = signal<AdminLesson[]>([]);
  readonly isLoadingLessons = signal<boolean>(false);
  readonly showAllLessons = signal<boolean>(false);

  isEditMode(): boolean {
    return !!this.quiz();
  }

  getCategoryName(catId?: string): string {
    const id = catId || this.categoryId;
    const cat = this.categories().find((c) => c.id === id);
    return cat ? cat.name : 'Catégorie';
  }

  filteredLessons(): AdminLesson[] {
    const list = this.allLessons().length > 0 ? this.allLessons() : this.lessons();
    if (this.showAllLessons()) {
      return list;
    }
    if (!this.categoryId) {
      return list;
    }
    return list.filter(
      (l) => l.categoryId === this.categoryId || l.category?.id === this.categoryId
    );
  }

  ngOnInit(): void {
    // Initialize allLessons from input if available
    if (this.lessons().length > 0) {
      this.allLessons.set(this.lessons());
    }
    this.loadAllLessons();

    const q = this.quiz();
    if (q) {
      this.title = q.title || '';
      this.description = q.description || '';
      this.categoryId = q.categoryId || q.category?.id || '';
      this.lessonId = q.lessonId || q.lesson?.id || '';
      this.difficulty = q.difficulty || 'NOVICE';
      this.orderIndex = q.orderIndex ?? 0;
      this.isPublished = q.isPublished ?? true;

      // Load full quiz details with questions
      this.loadQuizQuestions(q.id);
    } else {
      const cats = this.categories();
      if (cats.length > 0) {
        this.categoryId = cats[0].id;
      }
    }
  }

  loadAllLessons(): void {
    this.isLoadingLessons.set(true);
    this.adminService.getLessons().subscribe({
      next: (data) => {
        this.allLessons.set(data);
        this.isLoadingLessons.set(false);
      },
      error: () => {
        this.isLoadingLessons.set(false);
      },
    });
  }

  loadQuizQuestions(quizId: string): void {
    this.isLoadingQuestions = true;
    this.adminService.getQuiz(quizId).subscribe({
      next: (detail) => {
        this.existingQuestions = detail.questions || [];
        this.isLoadingQuestions = false;
      },
      error: () => {
        this.existingQuestions = [];
        this.isLoadingQuestions = false;
      },
    });
  }

  onLessonChange(newLessonId: string): void {
    this.lessonId = newLessonId;
    if (newLessonId) {
      const list = this.allLessons().length > 0 ? this.allLessons() : this.lessons();
      const selected = list.find((l) => l.id === newLessonId);
      const catId = selected?.categoryId || selected?.category?.id;
      if (catId && catId !== this.categoryId) {
        this.categoryId = catId;
      }
    }
  }

  onCategoryChange(): void {
    if (!this.showAllLessons()) {
      const list = this.allLessons().length > 0 ? this.allLessons() : this.lessons();
      const currentLesson = list.find((l) => l.id === this.lessonId);
      const catId = currentLesson?.categoryId || currentLesson?.category?.id;
      if (currentLesson && catId !== this.categoryId) {
        this.lessonId = '';
      }
    }
  }

  addQuestion(): void {
    this.questions.push({
      title: '',
      codeSnippet: '',
      explanation: '',
      orderIndex: this.questions.length,
      answers: [
        { text: '', isCorrect: true, orderIndex: 0 },
        { text: '', isCorrect: false, orderIndex: 1 },
      ],
    });
  }

  removeQuestion(idx: number): void {
    if (this.questions.length > 1) {
      this.questions.splice(idx, 1);
    }
  }

  addAnswer(q: FormQuestion): void {
    q.answers.push({
      text: '',
      isCorrect: false,
      orderIndex: q.answers.length,
    });
  }

  removeAnswer(q: FormQuestion, aIdx: number): void {
    if (q.answers.length > 2) {
      q.answers.splice(aIdx, 1);
    }
  }

  setCorrectAnswer(q: FormQuestion, aIdx: number): void {
    q.answers.forEach((ans, index) => {
      ans.isCorrect = index === aIdx;
    });
  }

  isNewQuestionValid(): boolean {
    const hasTitle = !!this.newQuestion.title.trim();
    const hasAnswers =
      this.newQuestion.answers.length >= 2 &&
      this.newQuestion.answers.every((a) => !!a.text.trim());
    const hasCorrect = this.newQuestion.answers.some((a) => a.isCorrect);
    return hasTitle && hasAnswers && hasCorrect;
  }

  saveNewQuestionDirectly(): void {
    const qId = this.quiz()?.id;
    if (!qId || !this.isNewQuestionValid()) return;

    this.isSavingQuestion = true;
    const dto: CreateAdminQuestionDto = {
      title: this.newQuestion.title.trim(),
      codeSnippet: this.newQuestion.codeSnippet.trim() || undefined,
      explanation: this.newQuestion.explanation.trim() || undefined,
      orderIndex: this.existingQuestions.length,
      answers: this.newQuestion.answers.map((a, i) => ({
        text: a.text.trim(),
        isCorrect: a.isCorrect,
        orderIndex: i,
      })),
    };

    this.adminService.addQuizQuestion(qId, dto).subscribe({
      next: (created) => {
        this.toast.success('Question ajoutée avec succès au quiz !');
        this.isSavingQuestion = false;
        this.showAddQuestionForm = false;
        this.newQuestion = {
          title: '',
          codeSnippet: '',
          explanation: '',
          orderIndex: 0,
          answers: [
            { text: '', isCorrect: true, orderIndex: 0 },
            { text: '', isCorrect: false, orderIndex: 1 },
          ],
        };
        this.loadQuizQuestions(qId);
      },
      error: (err) => {
        this.isSavingQuestion = false;
        this.toast.error(err.error?.message || "Erreur lors de l'ajout de la question.");
      },
    });
  }

  deleteQuestionDirectly(questionId: string): void {
    const qId = this.quiz()?.id;
    if (!qId) return;

    if (!confirm('Supprimer cette question du quiz ?')) return;

    this.adminService.deleteQuizQuestion(questionId).subscribe({
      next: () => {
        this.toast.success('Question supprimée.');
        this.loadQuizQuestions(qId);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Erreur lors de la suppression de la question.');
      },
    });
  }

  isValid(): boolean {
    if (!this.title.trim() || !this.categoryId) return false;

    if (!this.isEditMode()) {
      if (this.questions.length === 0) return false;
      for (const q of this.questions) {
        if (!q.title.trim()) return false;
        if (q.answers.length < 2) return false;
        if (q.answers.some((a) => !a.text.trim())) return false;
        if (!q.answers.some((a) => a.isCorrect)) return false;
      }
    }

    return true;
  }

  onSubmit(): void {
    if (!this.isValid()) return;

    if (this.isEditMode()) {
      const updateDto: UpdateQuizDto = {
        title: this.title.trim(),
        description: this.description.trim() || undefined,
        categoryId: this.categoryId,
        lessonId: this.lessonId || undefined,
        difficulty: this.difficulty,
        orderIndex: Number(this.orderIndex) || 0,
        isPublished: this.isPublished,
      };

      this.save.emit({
        id: this.quiz()?.id,
        dto: updateDto,
      });
    } else {
      const createDto: CreateQuizDto = {
        title: this.title.trim(),
        description: this.description.trim() || undefined,
        categoryId: this.categoryId,
        lessonId: this.lessonId || undefined,
        difficulty: this.difficulty,
        orderIndex: Number(this.orderIndex) || 0,
        isPublished: this.isPublished,
        questions: this.questions.map((q, qIndex) => ({
          title: q.title.trim(),
          codeSnippet: q.codeSnippet.trim() || undefined,
          explanation: q.explanation.trim() || undefined,
          orderIndex: qIndex,
          answers: q.answers.map((a, aIndex) => ({
            text: a.text.trim(),
            isCorrect: a.isCorrect,
            orderIndex: aIndex,
          })),
        })),
      };

      this.save.emit({
        dto: createDto,
      });
    }
  }
}
