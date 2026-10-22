import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { LucideCheckCircle2, LucideAlertCircle, LucideFlame, LucideInfo, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [LucideCheckCircle2, LucideAlertCircle, LucideFlame, LucideInfo, LucideX],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right"
          [class.bg-emerald-950\/90]="toast.type === 'success'"
          [class.border-emerald-600\/40]="toast.type === 'success'"
          [class.text-emerald-100]="toast.type === 'success'"
          [class.bg-rose-950\/90]="toast.type === 'error'"
          [class.border-rose-600\/40]="toast.type === 'error'"
          [class.text-rose-100]="toast.type === 'error'"
          [class.bg-slate-900\/95]="toast.type === 'info'"
          [class.border-slate-700]="toast.type === 'info'"
          [class.text-slate-100]="toast.type === 'info'"
          [class.bg-gradient-to-r]="toast.type === 'streak'"
          [class.from-amber-950\/95]="toast.type === 'streak'"
          [class.to-orange-950\/95]="toast.type === 'streak'"
          [class.border-amber-500\/50]="toast.type === 'streak'"
          [class.text-amber-100]="toast.type === 'streak'"
        >
          <div class="shrink-0 mt-0.5">
            @switch (toast.type) {
              @case ('success') {
                <svg lucideCheckCircle2 class="w-5 h-5 text-emerald-400"></svg>
              }
              @case ('error') {
                <svg lucideAlertCircle class="w-5 h-5 text-rose-400"></svg>
              }
              @case ('streak') {
                <svg lucideFlame class="w-6 h-6 text-amber-400 animate-pulse"></svg>
              }
              @default {
                <svg lucideInfo class="w-5 h-5 text-indigo-400"></svg>
              }
            }
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm leading-snug">{{ toast.message }}</p>
            @if (toast.subMessage) {
              <p class="text-xs opacity-80 mt-0.5">{{ toast.subMessage }}</p>
            }
          </div>

          <button
            type="button"
            (click)="toastService.remove(toast.id)"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded focus:outline-none"
            aria-label="Fermer la notification"
          >
            <svg lucideX class="w-4 h-4"></svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
