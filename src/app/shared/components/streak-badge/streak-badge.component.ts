import { Component, input } from '@angular/core';
import { LucideFlame } from '@lucide/angular';

@Component({
  selector: 'app-streak-badge',
  standalone: true,
  imports: [LucideFlame],
  template: `
    <div
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border transition-transform hover:scale-105"
      [class.bg-amber-500\/10]="true"
      [class.border-amber-500\/30]="true"
      [class.text-amber-400]="true"
      [class.text-xs]="size() === 'sm'"
      [class.text-sm]="size() === 'md'"
      [class.text-base]="size() === 'lg'"
      title="Série de jours actifs consécutifs"
    >
      <svg
        lucideFlame
        [class.w-3.5]="size() === 'sm'"
        [class.h-3.5]="size() === 'sm'"
        [class.w-4]="size() === 'md'"
        [class.h-4]="size() === 'md'"
        [class.w-5]="size() === 'lg'"
        [class.h-5]="size() === 'lg'"
        class="text-amber-500 fill-amber-500/20 animate-pulse"
      ></svg>
      <span>{{ streak() }} {{ streak() > 1 ? 'jours' : 'jour' }}</span>
    </div>
  `,
})
export class StreakBadgeComponent {
  readonly streak = input.required<number>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
