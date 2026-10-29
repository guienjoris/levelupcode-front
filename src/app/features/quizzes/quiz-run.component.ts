import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { ToastService } from '../../core/services/toast.service';
import { QuizDetail, QuizSubmissionResult, QuizQuestionResult } from '../../core/models/quiz.model';
import { ReportModalComponent } from '../../shared/components/report-modal/report-modal.component';
import { MarkdownViewerComponent } from '../../shared/components/markdown-viewer/markdown-viewer.component';
import confetti from 'canvas-confetti';
import {
  LucideArrowLeft,
  LucideHelpCircle,
  LucideCheckCircle2,
  LucideXCircle,
  LucideFlame,
  LucideSparkles,
  LucideAlertTriangle,
  LucideRotateCcw,
} from '@lucide/angular';

@Component({
  selector: 'app-quiz-run',
  standalone: true,
  imports: [
    RouterLink,
    ReportModalComponent,
    MarkdownViewerComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideXCircle,
    LucideFlame,
    LucideSparkles,
    LucideAlertTriangle,
    LucideRotateCcw,
  ],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Top Bar -->
      <div class="flex items-center justify-between">
        <a
          routerLink="/catalog"
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <svg lucideArrowLeft class="w-4 h-4"></svg>
          <span>Retour</span>
        </a>

        @if (quiz()) {
          <button
            type="button"
            (click)="isReportModalOpen.set(true)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <svg lucideAlertTriangle class="w-3.5 h-3.5 text-amber-400"></svg>
            <span class="hidden sm:inline">Signaler une erreur sur ce quiz</span>
          </button>
        }
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="space-y-6">
          <div class="h-10 w-2/3 bg-slate-800/60 rounded-xl animate-pulse"></div>
          <div class="h-48 bg-slate-800/40 rounded-2xl animate-pulse"></div>
          <div class="h-48 bg-slate-800/40 rounded-2xl animate-pulse"></div>
        </div>
      } @else if (quiz()) {
        <div class="space-y-8">
          
          <!-- Quiz Header -->
          <div class="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-xl space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Quiz d'évaluation
              </span>
              <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-700">
                {{ quiz()!.difficulty }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {{ quiz()!.title }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              Répondez à chaque question avec attention. Les réponses exactes et leurs explications pédagogiques s'afficheront après soumission.
            </p>
          </div>

          <!-- Score Banner (when submitted) -->
          @if (submissionResult()) {
            <div
              class="p-6 sm:p-8 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in zoom-in-95"
              [class.bg-emerald-950\/40]="submissionResult()!.passed"
              [class.border-emerald-500\/40]="submissionResult()!.passed"
              [class.bg-rose-950\/30]="!submissionResult()!.passed"
              [class.border-rose-500\/40]="!submissionResult()!.passed"
            >
              <div class="space-y-1 text-center sm:text-left">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Résultat</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold" [class.text-emerald-400]="submissionResult()!.passed" [class.text-rose-400]="!submissionResult()!.passed">
                  Score : {{ submissionResult()!.score }}%
                  {{ submissionResult()!.passed ? '🎉 Validé !' : '💪 À perfectionner' }}
                </h2>
                <p class="text-xs text-slate-300">
                  {{ submissionResult()!.passed ? 'Félicitations, vous maîtrisez les notions de ce cours.' : 'Relisez la leçon et réessayez pour décrocher les points !' }}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <div class="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-center">
                  <span class="block text-xs text-slate-400">XP Remportés</span>
                  <span class="text-lg font-bold text-indigo-400">+{{ submissionResult()!.xpEarned }} XP</span>
                </div>

                <div class="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-center">
                  <span class="block text-xs text-slate-400">Série active</span>
                  <span class="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
                    <svg lucideFlame class="w-4 h-4"></svg>
                    {{ submissionResult()!.currentStreak }} j
                  </span>
                </div>
              </div>
            </div>
          }

          <!-- Questions List -->
          <div class="space-y-6">
            @for (question of quiz()!.questions; track question.id; let qIdx = $index) {
              <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 shadow-md space-y-4">
                
                <!-- Question Title & Snippet -->
                <div>
                  <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Question {{ qIdx + 1 }} sur {{ quiz()!.questions.length }}
                  </span>
                  <div class="mt-1">
                    <app-markdown-viewer [content]="question.title"></app-markdown-viewer>
                  </div>

                  @if (question.codeSnippet) {
                    <pre class="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-200 overflow-x-auto"><code>{{ question.codeSnippet }}</code></pre>
                  }
                </div>

                <!-- Answer Options -->
                <div class="space-y-2">
                  @for (answer of question.answers; track answer.id) {
                    @let isSelected = selectedAnswers()[question.id] === answer.id;
                    @let qResult = getQuestionResult(question.id);
                    @let isCorrect = qResult?.correctAnswerId === answer.id;
                    @let isUserWrong = qResult && (qResult.selectedAnswerId === answer.id || qResult.userAnswerId === answer.id) && !qResult.isCorrect;

                    <label
                      class="flex items-center justify-between p-3.5 rounded-xl border transition-all"
                      [class.cursor-pointer]="!submissionResult()"
                      [class.bg-slate-900\/60]="!submissionResult() && !isSelected"
                      [class.border-slate-700\/70]="!submissionResult() && !isSelected"
                      [class.hover:border-slate-600]="!submissionResult() && !isSelected"
                      [class.bg-indigo-950\/40]="!submissionResult() && isSelected"
                      [class.border-indigo-500]="!submissionResult() && isSelected"
                      [class.bg-emerald-950\/40]="submissionResult() && isCorrect"
                      [class.border-emerald-500]="submissionResult() && isCorrect"
                      [class.bg-rose-950\/40]="submissionResult() && isUserWrong"
                      [class.border-rose-500]="submissionResult() && isUserWrong"
                    >
                      <div class="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="radio"
                          [name]="'question_' + question.id"
                          [value]="answer.id"
                          [disabled]="!!submissionResult()"
                          [checked]="isSelected"
                          (change)="selectAnswer(question.id, answer.id)"
                          class="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 shrink-0"
                        />
                        <div class="text-sm font-medium flex-1 min-w-0" [class.text-white]="isSelected || (submissionResult() && isCorrect)" [class.text-slate-300]="!isSelected">
                          <app-markdown-viewer [content]="answer.text"></app-markdown-viewer>
                        </div>
                      </div>

                      <!-- Validation icon -->
                      @if (submissionResult()) {
                        @if (isCorrect) {
                          <svg lucideCheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0 ml-2"></svg>
                        } @else if (isUserWrong) {
                          <svg lucideXCircle class="w-5 h-5 text-rose-400 shrink-0 ml-2"></svg>
                        }
                      }
                    </label>
                  }
                </div>

                <!-- Pedagogical Explanation (post submission) -->
                @if (getQuestionResult(question.id); as qResult) {
                  @if (qResult.explanation) {
                    <div class="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs space-y-1.5">
                      <span class="font-bold uppercase tracking-wider text-indigo-300 block">💡 Explication Pédagogique :</span>
                      <app-markdown-viewer [content]="qResult.explanation"></app-markdown-viewer>
                    </div>
                  }
                }

              </div>
            }
          </div>

          <!-- Bottom Submit Action -->
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            @if (!submissionResult()) {
              <button
                type="button"
                (click)="submitQuiz()"
                [disabled]="isSubmitting() || !allQuestionsAnswered()"
                class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                @if (isSubmitting()) {
                  <span>Correction en cours...</span>
                } @else {
                  <svg lucideSparkles class="w-5 h-5"></svg>
                  <span>Valider mes réponses</span>
                }
              </button>

              @if (!allQuestionsAnswered()) {
                <span class="text-xs text-amber-400">
                  Veuillez répondre à toutes les questions avant de valider.
                </span>
              }
            } @else {
              <!-- Restart quiz button -->
              <button
                type="button"
                (click)="resetQuiz()"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <svg lucideRotateCcw class="w-4 h-4"></svg>
                <span>Recommencer le quiz</span>
              </button>

              <a
                routerLink="/catalog"
                class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                Continuer mon apprentissage
              </a>
            }
          </div>

        </div>
      }

      <!-- Bug report modal -->
      @if (quiz()) {
        <app-report-modal
          [isOpen]="isReportModalOpen()"
          type="QUIZ"
          [targetId]="quiz()!.id"
          [targetTitle]="quiz()!.title"
          (closed)="isReportModalOpen.set(false)"
        ></app-report-modal>
      }

    </div>
  `,
})
export class QuizRunComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly quizService = inject(QuizService);
  private readonly toast = inject(ToastService);

  readonly quiz = signal<QuizDetail | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly isReportModalOpen = signal<boolean>(false);

  // Map of questionId -> answerId
  readonly selectedAnswers = signal<Record<string, string>>({});
  readonly submissionResult = signal<QuizSubmissionResult | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.quizService.getQuiz(id).subscribe({
      next: (data) => {
        this.quiz.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  selectAnswer(questionId: string, answerId: string): void {
    if (this.submissionResult()) return;
    this.selectedAnswers.update((prev) => ({ ...prev, [questionId]: answerId }));
  }

  allQuestionsAnswered(): boolean {
    const q = this.quiz();
    if (!q) return false;
    const answers = this.selectedAnswers();
    return q.questions.every((question) => !!answers[question.id]);
  }

  getQuestionResult(questionId: string): QuizQuestionResult | undefined {
    const res = this.submissionResult();
    const list = res?.corrections || res?.results || [];
    return list.find((r) => r.questionId === questionId);
  }

  submitQuiz(): void {
    const q = this.quiz();
    if (!q || !this.allQuestionsAnswered() || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const payload = {
      answers: Object.entries(this.selectedAnswers()).map(([questionId, selectedAnswerId]) => ({
        questionId,
        selectedAnswerId,
      })),
    };

    this.quizService.submitQuiz(q.id, payload).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        this.submissionResult.set(result);

        const xpEarned = result.reward?.xpEarned ?? result.xpEarned ?? 0;
        const currentStreak = result.reward?.currentStreak ?? result.currentStreak ?? 0;

        if (result.passed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          this.toast.streak(currentStreak, xpEarned);
        } else {
          this.toast.info(`Quiz terminé. Score : ${result.score}%. Retentez pour valider !`);
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const errMsg = Array.isArray(err.error?.message)
          ? err.error.message.join(', ')
          : err.error?.message || 'Erreur lors de la soumission du quiz.';
        this.toast.error(errMsg);
      },
    });
  }

  resetQuiz(): void {
    this.selectedAnswers.set({});
    this.submissionResult.set(null);
  }
}
