import { Component, input, output } from '@angular/core';
import { LucideAlertTriangle, LucideX, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [LucideAlertTriangle, LucideX, LucideTrash2],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <svg lucideAlertTriangle class="w-6 h-6"></svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ title() }}</h3>
              <p class="text-xs text-slate-400">Cette action est irréversible</p>
            </div>
          </div>
          <button
            type="button"
            (click)="cancel.emit()"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg lucideX class="w-5 h-5"></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="space-y-3">
          <p class="text-sm text-slate-300">
            {{ message() }}
          </p>
          @if (itemName()) {
            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm font-semibold text-rose-300 font-mono break-all">
              "{{ itemName() }}"
            </div>
          }
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            (click)="cancel.emit()"
            [disabled]="isDeleting()"
            class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            (click)="confirm.emit()"
            [disabled]="isDeleting()"
            class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            @if (isDeleting()) {
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Suppression...</span>
            } @else {
              <svg lucideTrash2 class="w-4 h-4"></svg>
              <span>Confirmer la suppression</span>
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDeleteModalComponent {
  readonly title = input<string>('Confirmer la suppression');
  readonly message = input<string>('Êtes-vous sûr de vouloir supprimer cet élément ?');
  readonly itemName = input<string>('');
  readonly isDeleting = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
