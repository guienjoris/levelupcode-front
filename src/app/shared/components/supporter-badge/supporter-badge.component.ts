import { Component, input } from '@angular/core';
import { LucideCoffee } from '@lucide/angular';

@Component({
  selector: 'app-supporter-badge',
  standalone: true,
  imports: [LucideCoffee],
  template: `
    <div
      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-sm shadow-yellow-500/10 transition-transform hover:scale-105"
      title="Membre Donateur Buy Me a Coffee"
    >
      <svg lucideCoffee class="w-3.5 h-3.5 text-yellow-400"></svg>
      <span>{{ compact() ? 'Supporter' : '☕ Supporter' }}</span>
    </div>
  `,
})
export class SupporterBadgeComponent {
  readonly compact = input<boolean>(false);
}
