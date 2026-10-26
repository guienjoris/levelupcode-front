import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { AdminService } from '../../core/services/admin.service';
import {
  AdminCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  AdminLesson,
  CreateLessonDto,
  UpdateLessonDto,
  AdminQuiz,
  CreateQuizDto,
  UpdateQuizDto,
  AdminTag,
  CreateTagDto,
  UpdateTagDto,
  Difficulty,
} from '../../core/models/admin.model';
import { AdminReport } from '../../core/models/report.model';

import { CategoryFormModalComponent } from './components/category-form-modal.component';
import { LessonFormModalComponent } from './components/lesson-form-modal.component';
import { QuizFormModalComponent } from './components/quiz-form-modal.component';
import { TagFormModalComponent } from './components/tag-form-modal.component';
import { ConfirmDeleteModalComponent } from './components/confirm-delete-modal.component';

import {
  LucideShield,
  LucideLayers,
  LucideBookOpen,
  LucideHelpCircle,
  LucideTag,
  LucideAlertTriangle,
  LucideCoffee,
  LucidePlus,
  LucidePencil,
  LucideTrash2,
  LucideSearch,
  LucideCheck,
  LucideX,
  LucideExternalLink,
  LucideCheckCircle2,
  LucideXCircle,
} from '@lucide/angular';

type AdminTab = 'categories' | 'lessons' | 'quizzes' | 'tags' | 'reports' | 'donations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CategoryFormModalComponent,
    LessonFormModalComponent,
    QuizFormModalComponent,
    TagFormModalComponent,
    ConfirmDeleteModalComponent,
    LucideShield,
    LucideLayers,
    LucideBookOpen,
    LucideHelpCircle,
    LucideTag,
    LucideAlertTriangle,
    LucideCoffee,
    LucidePlus,
    LucidePencil,
    LucideTrash2,
    LucideSearch,
    LucideCheck,
    LucideX,
    LucideExternalLink,
    LucideCheckCircle2,
    LucideXCircle,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      <!-- Admin Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div class="space-y-1.5">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
            <svg lucideShield class="w-3.5 h-3.5"></svg>
            <span>Console d'Administration LevelUpCode</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Gestion du Contenu & Évaluations
          </h1>
          <p class="text-sm text-slate-400">
            Créez, modifiez et pilotez les catégories, leçons, quiz et tags de la plateforme.
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <!-- Categories Tab -->
        <button
          type="button"
          (click)="setTab('categories')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-indigo-600]="activeTab() === 'categories'"
          [class.text-white]="activeTab() === 'categories'"
          [class.text-slate-400]="activeTab() !== 'categories'"
          [class.hover:bg-slate-800]="activeTab() !== 'categories'"
        >
          <svg lucideLayers class="w-4 h-4"></svg>
          <span>Catégories</span>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-bold"
            [class.bg-indigo-800]="activeTab() === 'categories'"
            [class.text-white]="activeTab() === 'categories'"
            [class.bg-slate-800]="activeTab() !== 'categories'"
            [class.text-slate-400]="activeTab() !== 'categories'"
          >
            {{ categories().length }}
          </span>
        </button>

        <!-- Lessons Tab -->
        <button
          type="button"
          (click)="setTab('lessons')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-emerald-600]="activeTab() === 'lessons'"
          [class.text-white]="activeTab() === 'lessons'"
          [class.text-slate-400]="activeTab() !== 'lessons'"
          [class.hover:bg-slate-800]="activeTab() !== 'lessons'"
        >
          <svg lucideBookOpen class="w-4 h-4"></svg>
          <span>Leçons</span>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-bold"
            [class.bg-emerald-800]="activeTab() === 'lessons'"
            [class.text-white]="activeTab() === 'lessons'"
            [class.bg-slate-800]="activeTab() !== 'lessons'"
            [class.text-slate-400]="activeTab() !== 'lessons'"
          >
            {{ lessons().length }}
          </span>
        </button>

        <!-- Quizzes Tab -->
        <button
          type="button"
          (click)="setTab('quizzes')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-purple-600]="activeTab() === 'quizzes'"
          [class.text-white]="activeTab() === 'quizzes'"
          [class.text-slate-400]="activeTab() !== 'quizzes'"
          [class.hover:bg-slate-800]="activeTab() !== 'quizzes'"
        >
          <svg lucideHelpCircle class="w-4 h-4"></svg>
          <span>Quiz</span>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-bold"
            [class.bg-purple-800]="activeTab() === 'quizzes'"
            [class.text-white]="activeTab() === 'quizzes'"
            [class.bg-slate-800]="activeTab() !== 'quizzes'"
            [class.text-slate-400]="activeTab() !== 'quizzes'"
          >
            {{ quizzes().length }}
          </span>
        </button>

        <!-- Tags Tab -->
        <button
          type="button"
          (click)="setTab('tags')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-cyan-600]="activeTab() === 'tags'"
          [class.text-white]="activeTab() === 'tags'"
          [class.text-slate-400]="activeTab() !== 'tags'"
          [class.hover:bg-slate-800]="activeTab() !== 'tags'"
        >
          <svg lucideTag class="w-4 h-4"></svg>
          <span>Tags</span>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-bold"
            [class.bg-cyan-800]="activeTab() === 'tags'"
            [class.text-white]="activeTab() === 'tags'"
            [class.bg-slate-800]="activeTab() !== 'tags'"
            [class.text-slate-400]="activeTab() !== 'tags'"
          >
            {{ tags().length }}
          </span>
        </button>

        <!-- Reports Tab -->
        <button
          type="button"
          (click)="setTab('reports')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-amber-600]="activeTab() === 'reports'"
          [class.text-white]="activeTab() === 'reports'"
          [class.text-slate-400]="activeTab() !== 'reports'"
          [class.hover:bg-slate-800]="activeTab() !== 'reports'"
        >
          <svg lucideAlertTriangle class="w-4 h-4"></svg>
          <span>Signalements</span>
          @if (pendingReportsCount() > 0) {
            <span class="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-bold">
              {{ pendingReportsCount() }}
            </span>
          }
        </button>

        <!-- Donations Tab -->
        <button
          type="button"
          (click)="setTab('donations')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-slate-700]="activeTab() === 'donations'"
          [class.text-white]="activeTab() === 'donations'"
          [class.text-slate-400]="activeTab() !== 'donations'"
          [class.hover:bg-slate-800]="activeTab() !== 'donations'"
        >
          <svg lucideCoffee class="w-4 h-4"></svg>
          <span>Dons</span>
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: CATEGORIES                                        -->
      <!-- ======================================================== -->
      @if (activeTab() === 'categories') {
        <div class="space-y-6">
          <!-- Action Bar -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div class="relative flex-1 max-w-md">
              <svg lucideSearch class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
              <input
                type="text"
                [(ngModel)]="searchCategory"
                placeholder="Rechercher une catégorie..."
                class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="loadCategories()"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-colors"
              >
                Rafraîchir
              </button>
              <button
                type="button"
                (click)="openCreateCategoryModal()"
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 shrink-0"
              >
                <svg lucidePlus class="w-4 h-4"></svg>
                <span>Nouvelle Catégorie</span>
              </button>
            </div>
          </div>

          <!-- Categories List / Grid -->
          @if (isLoadingCategories()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-44 bg-slate-800/40 rounded-2xl animate-pulse"></div>
              }
            </div>
          } @else if (filteredCategories().length === 0) {
            <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm space-y-3">
              <svg lucideLayers class="w-10 h-10 mx-auto text-slate-600"></svg>
              <p>Aucune catégorie ne correspond aux critères.</p>
              <button
                type="button"
                (click)="openCreateCategoryModal()"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Créer la première catégorie
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (cat of filteredCategories(); track cat.id) {
                <div class="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 transition-all space-y-4 flex flex-col justify-between group">
                  <div class="space-y-3">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center shrink-0">
                          <img
                            [src]="'/icons/' + cat.slug + '.svg'"
                            [alt]="cat.name"
                            (error)="onIconError($event)"
                            class="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 class="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                            {{ cat.name }}
                          </h4>
                          <span class="text-xs font-mono text-slate-400">/catalog/{{ cat.slug }}</span>
                        </div>
                      </div>

                      <!-- Order badge -->
                      <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                        #{{ cat.orderIndex }}
                      </span>
                    </div>

                    <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {{ cat.description || 'Aucune description spécifiée.' }}
                    </p>

                    <!-- Tags list -->
                    <div class="flex flex-wrap gap-1.5 pt-1">
                      @for (tag of cat.tags || []; track tag.id) {
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {{ tag.name }}
                        </span>
                      }
                      @if (!cat.tags || cat.tags.length === 0) {
                        <span class="text-[11px] text-slate-500 italic">Aucun tag</span>
                      }
                    </div>
                  </div>

                  <!-- Footer / Actions -->
                  <div class="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <a
                      [routerLink]="['/catalog', cat.slug]"
                      target="_blank"
                      class="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                    >
                      <svg lucideExternalLink class="w-3.5 h-3.5"></svg>
                      <span>Catalogue</span>
                    </a>

                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        (click)="openEditCategoryModal(cat)"
                        class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                        title="Modifier la catégorie"
                      >
                        <svg lucidePencil class="w-3.5 h-3.5"></svg>
                      </button>
                      <button
                        type="button"
                        (click)="openDeleteCategoryModal(cat)"
                        class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        title="Supprimer la catégorie"
                      >
                        <svg lucideTrash2 class="w-3.5 h-3.5"></svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 2: LESSONS                                           -->
      <!-- ======================================================== -->
      @if (activeTab() === 'lessons') {
        <div class="space-y-6">
          <!-- Action & Filters Bar -->
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <!-- Search -->
              <div class="relative flex-1 max-w-sm">
                <svg lucideSearch class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
                <input
                  type="text"
                  [(ngModel)]="searchLesson"
                  placeholder="Rechercher une leçon..."
                  class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <!-- Filter by Category -->
              <select
                [(ngModel)]="filterLessonCategory"
                (ngModelChange)="loadLessons()"
                class="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Toutes les catégories</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>

              <!-- Filter by Status -->
              <select
                [(ngModel)]="filterLessonPublished"
                (ngModelChange)="loadLessons()"
                class="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PUBLISHED">Publiées uniquement</option>
                <option value="DRAFT">Brouillons uniquement</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="loadLessons()"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-colors"
              >
                Rafraîchir
              </button>
              <button
                type="button"
                (click)="openCreateLessonModal()"
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0"
              >
                <svg lucidePlus class="w-4 h-4"></svg>
                <span>Nouvelle Leçon</span>
              </button>
            </div>
          </div>

          <!-- Lessons List -->
          @if (isLoadingLessons()) {
            <div class="space-y-3">
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="h-20 bg-slate-800/40 rounded-2xl animate-pulse"></div>
              }
            </div>
          } @else if (filteredLessons().length === 0) {
            <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm space-y-3">
              <svg lucideBookOpen class="w-10 h-10 mx-auto text-slate-600"></svg>
              <p>Aucune leçon trouvée pour les filtres sélectionnés.</p>
              <button
                type="button"
                (click)="openCreateLessonModal()"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Créer la première leçon
              </button>
            </div>
          } @else {
            <div class="space-y-3">
              @for (lesson of filteredLessons(); track lesson.id) {
                <div class="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="space-y-1.5 flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <!-- Difficulty -->
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        [class.bg-emerald-500\/10]="lesson.difficulty === 'NOVICE'"
                        [class.text-emerald-400]="lesson.difficulty === 'NOVICE'"
                        [class.bg-amber-500\/10]="lesson.difficulty === 'INTERMEDIAIRE'"
                        [class.text-amber-400]="lesson.difficulty === 'INTERMEDIAIRE'"
                        [class.bg-rose-500\/10]="lesson.difficulty === 'SENIOR'"
                        [class.text-rose-400]="lesson.difficulty === 'SENIOR'"
                      >
                        {{ lesson.difficulty }}
                      </span>

                      <!-- Category Name -->
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {{ lesson.categoryName || lesson.category?.name || 'Sans catégorie' }}
                      </span>

                      <!-- Status -->
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"
                        [class.bg-emerald-500\/10]="lesson.isPublished !== false"
                        [class.text-emerald-300]="lesson.isPublished !== false"
                        [class.bg-slate-700]="lesson.isPublished === false"
                        [class.text-slate-400]="lesson.isPublished === false"
                      >
                        @if (lesson.isPublished !== false) {
                          <svg lucideCheckCircle2 class="w-3 h-3"></svg>
                        } @else {
                          <svg lucideXCircle class="w-3 h-3"></svg>
                        }
                        <span>{{ lesson.isPublished !== false ? 'Publiée' : 'Brouillon' }}</span>
                      </span>

                      <!-- Order -->
                      <span class="text-[11px] font-mono text-slate-500">
                        Ordre #{{ lesson.orderIndex }}
                      </span>
                    </div>

                    <h4 class="text-base font-bold text-white truncate">
                      {{ lesson.title }}
                    </h4>
                    <p class="text-xs text-slate-400 font-mono">
                      /lessons/{{ lesson.slug }}
                    </p>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <a
                      [routerLink]="['/lessons', lesson.slug || lesson.id]"
                      target="_blank"
                      class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Voir sur le site"
                    >
                      <svg lucideExternalLink class="w-3.5 h-3.5"></svg>
                      <span>Aperçu</span>
                    </a>

                    <button
                      type="button"
                      (click)="openEditLessonModal(lesson)"
                      class="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                      title="Modifier la leçon"
                    >
                      <svg lucidePencil class="w-4 h-4"></svg>
                    </button>

                    <button
                      type="button"
                      (click)="openDeleteLessonModal(lesson)"
                      class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                      title="Supprimer la leçon"
                    >
                      <svg lucideTrash2 class="w-4 h-4"></svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 3: QUIZZES                                           -->
      <!-- ======================================================== -->
      @if (activeTab() === 'quizzes') {
        <div class="space-y-6">
          <!-- Action & Filters Bar -->
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <!-- Search -->
              <div class="relative flex-1 max-w-sm">
                <svg lucideSearch class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
                <input
                  type="text"
                  [(ngModel)]="searchQuiz"
                  placeholder="Rechercher un quiz..."
                  class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <!-- Filter by Category -->
              <select
                [(ngModel)]="filterQuizCategory"
                (ngModelChange)="loadQuizzes()"
                class="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="">Toutes les catégories</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>

              <!-- Filter by Status -->
              <select
                [(ngModel)]="filterQuizPublished"
                (ngModelChange)="loadQuizzes()"
                class="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PUBLISHED">Publiés uniquement</option>
                <option value="DRAFT">Brouillons uniquement</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="loadQuizzes()"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-colors"
              >
                Rafraîchir
              </button>
              <button
                type="button"
                (click)="openCreateQuizModal()"
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 shrink-0"
              >
                <svg lucidePlus class="w-4 h-4"></svg>
                <span>Nouveau Quiz</span>
              </button>
            </div>
          </div>

          <!-- Quizzes List -->
          @if (isLoadingQuizzes()) {
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-20 bg-slate-800/40 rounded-2xl animate-pulse"></div>
              }
            </div>
          } @else if (filteredQuizzes().length === 0) {
            <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm space-y-3">
              <svg lucideHelpCircle class="w-10 h-10 mx-auto text-slate-600"></svg>
              <p>Aucun quiz trouvé pour les critères de recherche.</p>
              <button
                type="button"
                (click)="openCreateQuizModal()"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Créer le premier quiz
              </button>
            </div>
          } @else {
            <div class="space-y-3">
              @for (quiz of filteredQuizzes(); track quiz.id) {
                <div class="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="space-y-1.5 flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <!-- Difficulty -->
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        [class.bg-emerald-500\/10]="quiz.difficulty === 'NOVICE'"
                        [class.text-emerald-400]="quiz.difficulty === 'NOVICE'"
                        [class.bg-amber-500\/10]="quiz.difficulty === 'INTERMEDIAIRE'"
                        [class.text-amber-400]="quiz.difficulty === 'INTERMEDIAIRE'"
                        [class.bg-rose-500\/10]="quiz.difficulty === 'SENIOR'"
                        [class.text-rose-400]="quiz.difficulty === 'SENIOR'"
                      >
                        {{ quiz.difficulty }}
                      </span>

                      <!-- Category -->
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {{ quiz.categoryName || quiz.category?.name || 'Catégorie inconnue' }}
                      </span>

                      <!-- Questions count -->
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {{ quiz.questionsCount || quiz.questions?.length || 0 }} questions
                      </span>

                      <!-- Status -->
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"
                        [class.bg-emerald-500\/10]="quiz.isPublished !== false"
                        [class.text-emerald-300]="quiz.isPublished !== false"
                        [class.bg-slate-700]="quiz.isPublished === false"
                        [class.text-slate-400]="quiz.isPublished === false"
                      >
                        <span>{{ quiz.isPublished !== false ? 'Publié' : 'Brouillon' }}</span>
                      </span>
                    </div>

                    <h4 class="text-base font-bold text-white truncate">
                      {{ quiz.title }}
                    </h4>

                    @if (quiz.description) {
                      <p class="text-xs text-slate-400 line-clamp-1">
                        {{ quiz.description }}
                      </p>
                    }
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <a
                      [routerLink]="['/quizzes', quiz.id]"
                      target="_blank"
                      class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Tester le quiz"
                    >
                      <svg lucideExternalLink class="w-3.5 h-3.5"></svg>
                      <span>Tester</span>
                    </a>

                    <button
                      type="button"
                      (click)="openEditQuizModal(quiz)"
                      class="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Gérer le quiz et questions"
                    >
                      <svg lucidePencil class="w-3.5 h-3.5"></svg>
                      <span>Gérer</span>
                    </button>

                    <button
                      type="button"
                      (click)="openDeleteQuizModal(quiz)"
                      class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                      title="Supprimer le quiz"
                    >
                      <svg lucideTrash2 class="w-4 h-4"></svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 4: TAGS                                              -->
      <!-- ======================================================== -->
      @if (activeTab() === 'tags') {
        <div class="space-y-6">
          <!-- Action Bar -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div class="relative flex-1 max-w-md">
              <svg lucideSearch class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
              <input
                type="text"
                [(ngModel)]="searchTag"
                placeholder="Rechercher un tag technique..."
                class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="loadTags()"
                class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-colors"
              >
                Rafraîchir
              </button>
              <button
                type="button"
                (click)="openCreateTagModal()"
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 shrink-0"
              >
                <svg lucidePlus class="w-4 h-4"></svg>
                <span>Nouveau Tag</span>
              </button>
            </div>
          </div>

          <!-- Tags Grid -->
          @if (isLoadingTags()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="h-28 bg-slate-800/40 rounded-2xl animate-pulse"></div>
              }
            </div>
          } @else if (filteredTags().length === 0) {
            <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm space-y-3">
              <svg lucideTag class="w-10 h-10 mx-auto text-slate-600"></svg>
              <p>Aucun tag technique trouvé.</p>
              <button
                type="button"
                (click)="openCreateTagModal()"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                Créer un premier tag
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (tag of filteredTags(); track tag.id) {
                <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between space-y-3 group">
                  <div class="space-y-2">
                    <div class="flex items-start justify-between gap-2">
                      <div class="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <svg lucideTag class="w-4 h-4"></svg>
                      </div>
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          (click)="openEditTagModal(tag)"
                          class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                          title="Modifier"
                        >
                          <svg lucidePencil class="w-3.5 h-3.5"></svg>
                        </button>
                        <button
                          type="button"
                          (click)="openDeleteTagModal(tag)"
                          class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Supprimer"
                        >
                          <svg lucideTrash2 class="w-3.5 h-3.5"></svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 class="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                        {{ tag.name }}
                      </h4>
                      <span class="text-xs font-mono text-slate-400">#{{ tag.slug }}</span>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                    <span>{{ tag.categories?.length || 0 }} catégories associées</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 5: REPORTS                                           -->
      <!-- ======================================================== -->
      @if (activeTab() === 'reports') {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Anomalies et coquilles signalées</h2>
            <button
              type="button"
              (click)="loadReports()"
              class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Rafraîchir
            </button>
          </div>

          @if (reportsError()) {
            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center gap-2.5">
              <svg lucideAlertTriangle class="w-5 h-5 shrink-0"></svg>
              <span>{{ reportsError() }}</span>
            </div>
          }

          @if (isLoadingReports()) {
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-20 bg-slate-800/40 rounded-xl animate-pulse"></div>
              }
            </div>
          } @else if (reports().length === 0 && !reportsError()) {
            <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm">
              🎉 Aucun signalement en attente. Tout le contenu pédagogique est opérationnel !
            </div>
          } @else {
            <div class="space-y-3">
              @for (report of reports(); track report.id) {
                <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="space-y-1.5 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-indigo-300 border border-slate-700">
                        {{ report.type }}
                      </span>
                      <span class="text-xs text-slate-400 font-mono">ID: {{ report.targetId }}</span>
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-semibold"
                        [class.bg-amber-500\/10]="report.status === 'PENDING'"
                        [class.text-amber-400]="report.status === 'PENDING'"
                        [class.bg-emerald-500\/10]="report.status === 'RESOLVED'"
                        [class.text-emerald-400]="report.status === 'RESOLVED'"
                      >
                        {{ report.status }}
                      </span>
                    </div>

                    <p class="text-sm text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-mono">
                      "{{ report.comment }}"
                    </p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      (click)="updateReportStatus(report.id, 'RESOLVED')"
                      class="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Marquer comme résolu"
                    >
                      <svg lucideCheck class="w-3.5 h-3.5"></svg>
                      <span>Résolu</span>
                    </button>

                    <button
                      type="button"
                      (click)="updateReportStatus(report.id, 'DISMISSED')"
                      class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Rejeter"
                    >
                      <svg lucideX class="w-3.5 h-3.5"></svg>
                      <span>Rejeter</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ======================================================== -->
      <!-- TAB 6: DONATIONS                                         -->
      <!-- ======================================================== -->
      @if (activeTab() === 'donations') {
        <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm space-y-3">
          <svg lucideCoffee class="w-8 h-8 text-amber-400 mx-auto"></svg>
          <p>Journal d'audit des dons Buy Me a Coffee configuré avec succès.</p>
        </div>
      }

    </div>

    <!-- ========================================================== -->
    <!-- MODALS                                                     -->
    <!-- ========================================================== -->

    <!-- Category Modal -->
    @if (showCategoryModal()) {
      <app-category-form-modal
        [category]="selectedCategory()"
        [availableTags]="tags()"
        [isSaving]="isSavingCategory()"
        (save)="onSaveCategory($event)"
        (close)="showCategoryModal.set(false)"
      ></app-category-form-modal>
    }

    <!-- Lesson Modal -->
    @if (showLessonModal()) {
      <app-lesson-form-modal
        [lesson]="selectedLesson()"
        [categories]="categories()"
        [isSaving]="isSavingLesson()"
        (save)="onSaveLesson($event)"
        (close)="showLessonModal.set(false)"
      ></app-lesson-form-modal>
    }

    <!-- Quiz Modal -->
    @if (showQuizModal()) {
      <app-quiz-form-modal
        [quiz]="selectedQuiz()"
        [categories]="categories()"
        [lessons]="lessons()"
        [isSaving]="isSavingQuiz()"
        (save)="onSaveQuiz($event)"
        (close)="showQuizModal.set(false)"
      ></app-quiz-form-modal>
    }

    <!-- Tag Modal -->
    @if (showTagModal()) {
      <app-tag-form-modal
        [tag]="selectedTag()"
        [availableCategories]="categories()"
        [isSaving]="isSavingTag()"
        (save)="onSaveTag($event)"
        (close)="showTagModal.set(false)"
      ></app-tag-form-modal>
    }

    <!-- Confirm Delete Modal -->
    @if (showDeleteModal()) {
      <app-confirm-delete-modal
        [title]="deleteModalTitle()"
        [message]="deleteModalMessage()"
        [itemName]="deleteModalItemName()"
        [isDeleting]="isDeletingItem()"
        (confirm)="onConfirmDelete()"
        (cancel)="showDeleteModal.set(false)"
      ></app-confirm-delete-modal>
    }
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  // Active Tab
  readonly activeTab = signal<AdminTab>('categories');

  // Categories State
  readonly categories = signal<AdminCategory[]>([]);
  readonly isLoadingCategories = signal<boolean>(false);
  searchCategory = '';

  // Lessons State
  readonly lessons = signal<AdminLesson[]>([]);
  readonly isLoadingLessons = signal<boolean>(false);
  searchLesson = '';
  filterLessonCategory = '';
  filterLessonPublished: 'ALL' | 'PUBLISHED' | 'DRAFT' = 'ALL';

  // Quizzes State
  readonly quizzes = signal<AdminQuiz[]>([]);
  readonly isLoadingQuizzes = signal<boolean>(false);
  searchQuiz = '';
  filterQuizCategory = '';
  filterQuizPublished: 'ALL' | 'PUBLISHED' | 'DRAFT' = 'ALL';

  // Tags State
  readonly tags = signal<AdminTag[]>([]);
  readonly isLoadingTags = signal<boolean>(false);
  searchTag = '';

  // Reports State
  readonly reports = signal<AdminReport[]>([]);
  readonly isLoadingReports = signal<boolean>(false);
  readonly reportsError = signal<string | null>(null);

  // Modals Visibility & State
  readonly showCategoryModal = signal<boolean>(false);
  readonly selectedCategory = signal<AdminCategory | null>(null);
  readonly isSavingCategory = signal<boolean>(false);

  readonly showLessonModal = signal<boolean>(false);
  readonly selectedLesson = signal<AdminLesson | null>(null);
  readonly isSavingLesson = signal<boolean>(false);

  readonly showQuizModal = signal<boolean>(false);
  readonly selectedQuiz = signal<AdminQuiz | null>(null);
  readonly isSavingQuiz = signal<boolean>(false);

  readonly showTagModal = signal<boolean>(false);
  readonly selectedTag = signal<AdminTag | null>(null);
  readonly isSavingTag = signal<boolean>(false);

  // Delete Modal State
  readonly showDeleteModal = signal<boolean>(false);
  readonly deleteModalTitle = signal<string>('Supprimer');
  readonly deleteModalMessage = signal<string>('Êtes-vous sûr ?');
  readonly deleteModalItemName = signal<string>('');
  readonly isDeletingItem = signal<boolean>(false);
  private pendingDeleteAction: (() => void) | null = null;

  // Filtered lists (computed)
  readonly filteredCategories = computed(() => {
    const q = this.searchCategory.toLowerCase().trim();
    const list = this.categories();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  });

  readonly filteredLessons = computed(() => {
    const q = this.searchLesson.toLowerCase().trim();
    let list = this.lessons();

    if (this.filterLessonCategory) {
      list = list.filter(
        (l) => l.categoryId === this.filterLessonCategory || l.category?.id === this.filterLessonCategory
      );
    }

    if (this.filterLessonPublished === 'PUBLISHED') {
      list = list.filter((l) => l.isPublished !== false);
    } else if (this.filterLessonPublished === 'DRAFT') {
      list = list.filter((l) => l.isPublished === false);
    }

    if (!q) return list;
    return list.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q))
    );
  });

  readonly filteredQuizzes = computed(() => {
    const q = this.searchQuiz.toLowerCase().trim();
    let list = this.quizzes();

    if (this.filterQuizCategory) {
      list = list.filter(
        (qz) => qz.categoryId === this.filterQuizCategory || qz.category?.id === this.filterQuizCategory
      );
    }

    if (this.filterQuizPublished === 'PUBLISHED') {
      list = list.filter((qz) => qz.isPublished !== false);
    } else if (this.filterQuizPublished === 'DRAFT') {
      list = list.filter((qz) => qz.isPublished === false);
    }

    if (!q) return list;
    return list.filter(
      (qz) =>
        qz.title.toLowerCase().includes(q) ||
        (qz.description && qz.description.toLowerCase().includes(q))
    );
  });

  readonly filteredTags = computed(() => {
    const q = this.searchTag.toLowerCase().trim();
    const list = this.tags();
    if (!q) return list;
    return list.filter(
      (t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
    );
  });

  pendingReportsCount(): number {
    const list = this.reports();
    return Array.isArray(list) ? list.filter((r) => r.status === 'PENDING').length : 0;
  }

  ngOnInit(): void {
    // Initial fetch
    this.loadCategories();
    this.loadLessons();
    this.loadQuizzes();
    this.loadTags();
    this.loadReports();
  }

  setTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  onIconError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/icons/architecture.svg';
  }

  // ==========================================
  // CATEGORIES CRUD
  // ==========================================
  loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.adminService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoadingCategories.set(false);
      },
      error: (err) => {
        this.isLoadingCategories.set(false);
        this.toast.error('Erreur lors du chargement des catégories.');
      },
    });
  }

  openCreateCategoryModal(): void {
    this.selectedCategory.set(null);
    this.showCategoryModal.set(true);
  }

  openEditCategoryModal(cat: AdminCategory): void {
    this.selectedCategory.set(cat);
    this.showCategoryModal.set(true);
  }

  onSaveCategory(event: { id?: string; dto: CreateCategoryDto | UpdateCategoryDto }): void {
    this.isSavingCategory.set(true);
    if (event.id) {
      // Update
      this.adminService.updateCategory(event.id, event.dto).subscribe({
        next: () => {
          this.toast.success('Catégorie mise à jour avec succès.');
          this.isSavingCategory.set(false);
          this.showCategoryModal.set(false);
          this.loadCategories();
        },
        error: (err) => {
          this.isSavingCategory.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la mise à jour de la catégorie.');
        },
      });
    } else {
      // Create
      this.adminService.createCategory(event.dto as CreateCategoryDto).subscribe({
        next: () => {
          this.toast.success('Nouvelle catégorie créée avec succès.');
          this.isSavingCategory.set(false);
          this.showCategoryModal.set(false);
          this.loadCategories();
        },
        error: (err) => {
          this.isSavingCategory.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la création de la catégorie.');
        },
      });
    }
  }

  openDeleteCategoryModal(cat: AdminCategory): void {
    this.deleteModalTitle.set('Supprimer la catégorie');
    this.deleteModalMessage.set(
      'Voulez-vous vraiment supprimer définitivement cette catégorie ? Toutes les leçons et quiz associés pourraient être impactés.'
    );
    this.deleteModalItemName.set(cat.name);
    this.pendingDeleteAction = () => {
      this.isDeletingItem.set(true);
      this.adminService.deleteCategory(cat.id).subscribe({
        next: () => {
          this.toast.success('Catégorie supprimée avec succès.');
          this.isDeletingItem.set(false);
          this.showDeleteModal.set(false);
          this.loadCategories();
        },
        error: (err) => {
          this.isDeletingItem.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la suppression de la catégorie.');
        },
      });
    };
    this.showDeleteModal.set(true);
  }

  // ==========================================
  // LESSONS CRUD
  // ==========================================
  loadLessons(): void {
    this.isLoadingLessons.set(true);
    const filters: { categoryId?: string; isPublished?: boolean } = {};
    if (this.filterLessonCategory) {
      filters.categoryId = this.filterLessonCategory;
    }
    if (this.filterLessonPublished === 'PUBLISHED') {
      filters.isPublished = true;
    } else if (this.filterLessonPublished === 'DRAFT') {
      filters.isPublished = false;
    }

    this.adminService.getLessons(filters).subscribe({
      next: (data) => {
        this.lessons.set(data);
        this.isLoadingLessons.set(false);
      },
      error: () => {
        this.isLoadingLessons.set(false);
        this.toast.error('Erreur lors du chargement des leçons.');
      },
    });
  }

  openCreateLessonModal(): void {
    this.selectedLesson.set(null);
    this.showLessonModal.set(true);
  }

  openEditLessonModal(lesson: AdminLesson): void {
    // If markdown is missing in list item, fetch full lesson
    if (!lesson.contentMarkdown) {
      this.adminService.getLesson(lesson.id).subscribe({
        next: (full) => {
          this.selectedLesson.set(full);
          this.showLessonModal.set(true);
        },
        error: () => {
          this.selectedLesson.set(lesson);
          this.showLessonModal.set(true);
        },
      });
    } else {
      this.selectedLesson.set(lesson);
      this.showLessonModal.set(true);
    }
  }

  onSaveLesson(event: { id?: string; dto: CreateLessonDto | UpdateLessonDto }): void {
    this.isSavingLesson.set(true);
    if (event.id) {
      this.adminService.updateLesson(event.id, event.dto).subscribe({
        next: () => {
          this.toast.success('Leçon mise à jour avec succès.');
          this.isSavingLesson.set(false);
          this.showLessonModal.set(false);
          this.loadLessons();
        },
        error: (err) => {
          this.isSavingLesson.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la mise à jour de la leçon.');
        },
      });
    } else {
      this.adminService.createLesson(event.dto as CreateLessonDto).subscribe({
        next: () => {
          this.toast.success('Nouvelle leçon créée avec succès.');
          this.isSavingLesson.set(false);
          this.showLessonModal.set(false);
          this.loadLessons();
        },
        error: (err) => {
          this.isSavingLesson.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la création de la leçon.');
        },
      });
    }
  }

  openDeleteLessonModal(lesson: AdminLesson): void {
    this.deleteModalTitle.set('Supprimer la leçon');
    this.deleteModalMessage.set(
      'Voulez-vous supprimer définitivement cette leçon ? Les apprenants ne pourront plus y accéder.'
    );
    this.deleteModalItemName.set(lesson.title);
    this.pendingDeleteAction = () => {
      this.isDeletingItem.set(true);
      this.adminService.deleteLesson(lesson.id).subscribe({
        next: () => {
          this.toast.success('Leçon supprimée avec succès.');
          this.isDeletingItem.set(false);
          this.showDeleteModal.set(false);
          this.loadLessons();
        },
        error: (err) => {
          this.isDeletingItem.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la suppression de la leçon.');
        },
      });
    };
    this.showDeleteModal.set(true);
  }

  // ==========================================
  // QUIZZES CRUD
  // ==========================================
  loadQuizzes(): void {
    this.isLoadingQuizzes.set(true);
    const filters: { categoryId?: string; isPublished?: boolean } = {};
    if (this.filterQuizCategory) {
      filters.categoryId = this.filterQuizCategory;
    }
    if (this.filterQuizPublished === 'PUBLISHED') {
      filters.isPublished = true;
    } else if (this.filterQuizPublished === 'DRAFT') {
      filters.isPublished = false;
    }

    this.adminService.getQuizzes(filters).subscribe({
      next: (data) => {
        this.quizzes.set(data);
        this.isLoadingQuizzes.set(false);
      },
      error: () => {
        this.isLoadingQuizzes.set(false);
        this.toast.error('Erreur lors du chargement des quiz.');
      },
    });
  }

  openCreateQuizModal(): void {
    this.selectedQuiz.set(null);
    this.showQuizModal.set(true);
    if (this.lessons().length === 0) {
      this.loadLessons();
    }
  }

  openEditQuizModal(quiz: AdminQuiz): void {
    this.selectedQuiz.set(quiz);
    this.showQuizModal.set(true);
    if (this.lessons().length === 0) {
      this.loadLessons();
    }
  }

  onSaveQuiz(event: { id?: string; dto: CreateQuizDto | UpdateQuizDto }): void {
    this.isSavingQuiz.set(true);
    if (event.id) {
      this.adminService.updateQuiz(event.id, event.dto as UpdateQuizDto).subscribe({
        next: () => {
          this.toast.success('Quiz mis à jour avec succès.');
          this.isSavingQuiz.set(false);
          this.showQuizModal.set(false);
          this.loadQuizzes();
        },
        error: (err) => {
          this.isSavingQuiz.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la mise à jour du quiz.');
        },
      });
    } else {
      this.adminService.createQuiz(event.dto as CreateQuizDto).subscribe({
        next: () => {
          this.toast.success('Nouveau quiz créé avec succès.');
          this.isSavingQuiz.set(false);
          this.showQuizModal.set(false);
          this.loadQuizzes();
        },
        error: (err) => {
          this.isSavingQuiz.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la création du quiz.');
        },
      });
    }
  }

  openDeleteQuizModal(quiz: AdminQuiz): void {
    this.deleteModalTitle.set('Supprimer le quiz');
    this.deleteModalMessage.set(
      'Voulez-vous supprimer définitivement ce quiz ? Toutes les questions et réponses seront effacées en cascade.'
    );
    this.deleteModalItemName.set(quiz.title);
    this.pendingDeleteAction = () => {
      this.isDeletingItem.set(true);
      this.adminService.deleteQuiz(quiz.id).subscribe({
        next: () => {
          this.toast.success('Quiz supprimé avec succès.');
          this.isDeletingItem.set(false);
          this.showDeleteModal.set(false);
          this.loadQuizzes();
        },
        error: (err) => {
          this.isDeletingItem.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la suppression du quiz.');
        },
      });
    };
    this.showDeleteModal.set(true);
  }

  // ==========================================
  // TAGS CRUD
  // ==========================================
  loadTags(): void {
    this.isLoadingTags.set(true);
    this.adminService.getTags().subscribe({
      next: (data) => {
        this.tags.set(data);
        this.isLoadingTags.set(false);
      },
      error: () => {
        this.isLoadingTags.set(false);
        this.toast.error('Erreur lors du chargement des tags.');
      },
    });
  }

  openCreateTagModal(): void {
    this.selectedTag.set(null);
    this.showTagModal.set(true);
  }

  openEditTagModal(tag: AdminTag): void {
    this.selectedTag.set(tag);
    this.showTagModal.set(true);
  }

  onSaveTag(event: { id?: string; dto: CreateTagDto | UpdateTagDto }): void {
    this.isSavingTag.set(true);
    if (event.id) {
      this.adminService.updateTag(event.id, event.dto).subscribe({
        next: () => {
          this.toast.success('Tag technique mis à jour.');
          this.isSavingTag.set(false);
          this.showTagModal.set(false);
          this.loadTags();
          this.loadCategories();
        },
        error: (err) => {
          this.isSavingTag.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la mise à jour du tag.');
        },
      });
    } else {
      this.adminService.createTag(event.dto as CreateTagDto).subscribe({
        next: () => {
          this.toast.success('Nouveau tag créé avec succès.');
          this.isSavingTag.set(false);
          this.showTagModal.set(false);
          this.loadTags();
          this.loadCategories();
        },
        error: (err) => {
          this.isSavingTag.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la création du tag.');
        },
      });
    }
  }

  openDeleteTagModal(tag: AdminTag): void {
    this.deleteModalTitle.set('Supprimer le tag technique');
    this.deleteModalMessage.set(
      'Voulez-vous supprimer ce tag ? Il sera retiré de toutes les catégories associées.'
    );
    this.deleteModalItemName.set(tag.name);
    this.pendingDeleteAction = () => {
      this.isDeletingItem.set(true);
      this.adminService.deleteTag(tag.id).subscribe({
        next: () => {
          this.toast.success('Tag supprimé avec succès.');
          this.isDeletingItem.set(false);
          this.showDeleteModal.set(false);
          this.loadTags();
          this.loadCategories();
        },
        error: (err) => {
          this.isDeletingItem.set(false);
          this.toast.error(err.error?.message || 'Erreur lors de la suppression du tag.');
        },
      });
    };
    this.showDeleteModal.set(true);
  }

  // ==========================================
  // CONFIRM MODAL DISPATCHER
  // ==========================================
  onConfirmDelete(): void {
    if (this.pendingDeleteAction) {
      this.pendingDeleteAction();
    }
  }

  // ==========================================
  // REPORTS
  // ==========================================
  loadReports(): void {
    this.isLoadingReports.set(true);
    this.reportsError.set(null);
    this.adminService.getReports().subscribe({
      next: (items) => {
        this.reports.set(items);
        this.isLoadingReports.set(false);
      },
      error: (err) => {
        this.isLoadingReports.set(false);
        this.reports.set([]);
        if (err.status === 403) {
          this.reportsError.set('Accès restreint : votre compte n’a pas le rôle ADMIN.');
        } else {
          this.reportsError.set(err.error?.message || 'Erreur lors du chargement des signalements.');
        }
      },
    });
  }

  updateReportStatus(reportId: string, status: 'RESOLVED' | 'DISMISSED'): void {
    this.adminService.updateReportStatus(reportId, status).subscribe({
      next: () => {
        this.toast.success(`Signalement mis à jour (${status}).`);
        this.reports.update((list) =>
          list.map((r) => (r.id === reportId ? { ...r, status } : r))
        );
      },
      error: () => {
        this.toast.error('Erreur lors de la mise à jour du signalement.');
      },
    });
  }
}
