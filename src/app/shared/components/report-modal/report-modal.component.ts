import { Component, input, output, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services/report.service';
import { ToastService } from '../../../core/services/toast.service';
import { ReportType } from '../../../core/models/report.model';
import { LucideAlertTriangle, LucideX, LucideSend } from '@lucide/angular';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [FormsModule, LucideAlertTriangle, LucideX, LucideSend],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
        <div class="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <svg lucideAlertTriangle class="w-5 h-5"></svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Signaler une erreur</h3>
                <p class="text-xs text-slate-400">Aidez-nous à améliorer le contenu pédagogique</p>
              </div>
            </div>

            <button
              type="button"
              (click)="closeModal()"
              class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <svg lucideX class="w-5 h-5"></svg>
            </button>
          </div>

          <!-- Body -->
          <form (ngSubmit)="submitReport()" class="mt-4 space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Cible du signalement
              </label>
              <div class="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs font-mono text-slate-300">
                {{ type() === 'LESSON' ? 'Leçon' : 'Quiz' }} : {{ targetTitle() || targetId() }}
              </div>
            </div>

            <div>
              <label for="reportComment" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description de l'erreur ou de la coquille *
              </label>
              <textarea
                id="reportComment"
                [(ngModel)]="comment"
                name="comment"
                rows="4"
                required
                placeholder="Ex : La commande npm install dans le deuxième snippet a un espace en trop, ou l'explication de la question 2 est imprécise..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-200 placeholder-slate-500 resize-none transition-all"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>

              <button
                type="submit"
                [disabled]="isSubmitting() || !comment().trim()"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2"
              >
                @if (isSubmitting()) {
                  <span>Envoi en cours...</span>
                } @else {
                  <svg lucideSend class="w-4 h-4"></svg>
                  <span>Envoyer le signalement</span>
                }
              </button>
            </div>
          </form>

        </div>
      </div>
    }
  `,
})
export class ReportModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly type = input.required<ReportType>();
  readonly targetId = input.required<string>();
  readonly targetTitle = input<string>('');
  readonly closed = output<void>();

  readonly comment = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);

  private readonly reportService = inject(ReportService);
  private readonly toast = inject(ToastService);

  closeModal(): void {
    this.comment.set('');
    this.closed.emit();
  }

  submitReport(): void {
    const text = this.comment().trim();
    if (!text) return;

    this.isSubmitting.set(true);

    this.reportService
      .createReport({
        type: this.type(),
        targetId: this.targetId(),
        comment: text,
      })
      .subscribe({
        next: (res) => {
          this.toast.success(res.message || 'Signalement transmis avec succès !');
          this.isSubmitting.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.toast.error(
            err.error?.message || 'Erreur lors de l’envoi. Vous avez peut-être atteint la limite temporaire.'
          );
          this.isSubmitting.set(false);
        },
      });
  }
}
