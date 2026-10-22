import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonService } from '../../core/services/lesson.service';
import { ToastService } from '../../core/services/toast.service';
import { LessonDetail } from '../../core/models/lesson.model';
import { MarkdownViewerComponent } from '../../shared/components/markdown-viewer/markdown-viewer.component';
import { ReportModalComponent } from '../../shared/components/report-modal/report-modal.component';
import confetti from 'canvas-confetti';
import {
  LucideArrowLeft,
  LucideCheckCircle2,
  LucideAlertTriangle,
  LucideHelpCircle,
  LucideSparkles,
  LucideCheck,
} from '@lucide/angular';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [
    RouterLink,
    MarkdownViewerComponent,
    ReportModalComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideAlertTriangle,
    LucideHelpCircle,
    LucideSparkles,
    LucideCheck,
  ],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Top Navigation & Breadcrumb -->
      <div class="flex items-center justify-between">
        @if (categorySlug()) {
          <a
            [routerLink]="['/catalog', categorySlug()]"
            class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <svg lucideArrowLeft class="w-4 h-4"></svg>
            <span>Retour à {{ categoryDisplayName() }}</span>
          </a>
        } @else {
          <a
            routerLink="/catalog"
            class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <svg lucideArrowLeft class="w-4 h-4"></svg>
            <span>Retour au catalogue</span>
          </a>
        }

        <!-- Bug report trigger button -->
        <button
          type="button"
          (click)="isReportModalOpen.set(true)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-700/60 transition-colors"
        >
          <svg lucideAlertTriangle class="w-3.5 h-3.5 text-amber-400"></svg>
          <span class="hidden sm:inline">Signaler une erreur</span>
        </button>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="space-y-6">
          <div class="h-10 w-2/3 bg-slate-800/60 rounded-xl animate-pulse"></div>
          <div class="h-6 w-1/4 bg-slate-800/40 rounded-lg animate-pulse"></div>
          <div class="h-96 bg-slate-800/30 rounded-2xl animate-pulse"></div>
        </div>
      } @else if (lesson()) {
        <!-- Lesson Content Card -->
        <article class="p-6 sm:p-10 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-2xl backdrop-blur-sm space-y-8">
          
          <!-- Header -->
          <header class="space-y-4 pb-6 border-b border-slate-700/60">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {{ categoryDisplayName() }}
              </span>

              <span
                class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md"
                [class.bg-emerald-500\/10]="lesson()!.difficulty === 'NOVICE'"
                [class.text-emerald-400]="lesson()!.difficulty === 'NOVICE'"
                [class.border]="true"
                [class.border-emerald-500\/30]="lesson()!.difficulty === 'NOVICE'"
                [class.bg-blue-500\/10]="lesson()!.difficulty === 'INTERMEDIAIRE'"
                [class.text-blue-400]="lesson()!.difficulty === 'INTERMEDIAIRE'"
                [class.border-blue-500\/30]="lesson()!.difficulty === 'INTERMEDIAIRE'"
                [class.bg-rose-500\/10]="lesson()!.difficulty === 'SENIOR'"
                [class.text-rose-400]="lesson()!.difficulty === 'SENIOR'"
                [class.border-rose-500\/30]="lesson()!.difficulty === 'SENIOR'"
              >
                {{ lesson()!.difficulty }}
              </span>

              @if (lesson()!.isCompleted) {
                <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <svg lucideCheckCircle2 class="w-3.5 h-3.5"></svg>
                  <span>Leçon Déjà Validée</span>
                </span>
              }
            </div>

            <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {{ lesson()!.title }}
            </h1>
          </header>

          <!-- Markdown Content Body -->
          <div class="py-2">
            <app-markdown-viewer [content]="lesson()!.contentMarkdown || ''"></app-markdown-viewer>
          </div>

          <!-- Bottom Action Bar -->
          <footer class="pt-8 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <!-- Validate Lesson Button -->
            <button
              type="button"
              (click)="completeLesson()"
              [disabled]="isCompleting() || lesson()!.isCompleted"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 group"
              [class.bg-gradient-to-r]="!lesson()!.isCompleted"
              [class.from-emerald-600]="!lesson()!.isCompleted"
              [class.to-teal-600]="!lesson()!.isCompleted"
              [class.hover:from-emerald-500]="!lesson()!.isCompleted"
              [class.hover:to-teal-500]="!lesson()!.isCompleted"
              [class.shadow-emerald-600\/20]="!lesson()!.isCompleted"
              [class.bg-slate-700]="lesson()!.isCompleted"
              [class.text-slate-300]="lesson()!.isCompleted"
              [class.cursor-default]="lesson()!.isCompleted"
            >
              @if (lesson()!.isCompleted) {
                <svg lucideCheck class="w-5 h-5 text-emerald-400"></svg>
                <span>Leçon terminée & validée</span>
              } @else if (isCompleting()) {
                <span>Validation en cours...</span>
              } @else {
                <svg lucideSparkles class="w-5 h-5"></svg>
                <span>Valider la lecture & gagner l'XP</span>
              }
            </button>

            <!-- Quiz CTA if attached -->
            @if (quizId()) {
              <a
                [routerLink]="['/quizzes', quizId()]"
                class="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <svg lucideHelpCircle class="w-5 h-5"></svg>
                <span>Passer le Quiz de validation</span>
              </a>
            }

          </footer>

        </article>
      }

      <!-- Floating Bug Report Modal -->
      @if (lesson()) {
        <app-report-modal
          [isOpen]="isReportModalOpen()"
          type="LESSON"
          [targetId]="lesson()!.id"
          [targetTitle]="lesson()!.title"
          (closed)="isReportModalOpen.set(false)"
        ></app-report-modal>
      }

    </div>
  `,
})
export class LessonDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly lessonService = inject(LessonService);
  private readonly toast = inject(ToastService);

  readonly lesson = signal<LessonDetail | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isCompleting = signal<boolean>(false);
  readonly isReportModalOpen = signal<boolean>(false);

  readonly categoryDisplayName = computed(() => {
    const l = this.lesson();
    return l?.categoryName || l?.category?.name || 'Catégorie';
  });

  readonly categorySlug = computed(() => {
    const l = this.lesson();
    if (l?.category?.slug) return l.category.slug;
    if (l?.categoryName) return l.categoryName.toLowerCase();
    return '';
  });

  readonly quizId = computed(() => {
    const l = this.lesson();
    return l?.quizId || l?.quiz?.id || null;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('idOrSlug') || '';
    this.lessonService.getLesson(slug).subscribe({
      next: (data) => {
        this.lesson.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error(err.error?.message || 'Impossible de charger la leçon.');
      },
    });
  }

  completeLesson(): void {
    const current = this.lesson();
    if (!current || current.isCompleted || this.isCompleting()) return;

    this.isCompleting.set(true);

    this.lessonService.completeLesson(current.id).subscribe({
      next: (res) => {
        this.isCompleting.set(false);
        this.lesson.update((l) => (l ? { ...l, isCompleted: true } : null));

        // Celebratory Confetti!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });

        // Trigger streak & XP toast
        const streak = res.currentStreak ?? res.newStreak ?? 1;
        this.toast.streak(streak, res.xpEarned);
      },
      error: (err) => {
        this.isCompleting.set(false);
        this.toast.error(err.error?.message || 'Erreur lors de la validation.');
      },
    });
  }
}
